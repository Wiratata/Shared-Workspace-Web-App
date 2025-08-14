const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const crypto = require('node:crypto');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static(path.join(__dirname, '..')));

// path to landingpage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'LandingPage.html'));
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const uri = `mongodb+srv://${process.env.USER}:${process.env.DB_PASSWORD}@shared-workspace-web-ap.tpa61re.mongodb.net/?retryWrites=true&w=majority&appName=Shared-Workspace-Web-App`;
const client = new MongoClient(uri);

const databaseName = "WorksyDB";
const usersCollectionName = "Users";
const propertiesCollectionName = "Properties";
const workspacesCollectionName = "Workspaces";

function hashPassword(password, salt) {
    return crypto.pbkdf2Sync(password, salt, 10, 64, 'sha512').toString('hex');
}

// Middleware for protected routes
const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(403).json({ error: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: "Invalid token" });
    }
};

// Routes

// Register User (existing)
app.post('/register', async (req, res) => {
    const { 
        firstName, 
        lastName, 
        email, 
        phoneNumber, 
        password, 
        confirmPassword, 
        userType 
    } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ error: "Passwords do not match" });
    }

    try {
        await client.connect();
        const usersCol = client.db(databaseName).collection(usersCollectionName);

        const existingUser = await usersCol.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        const salt = crypto.randomBytes(16).toString('hex');
        const hashedPassword = hashPassword(password, salt);

        const newUser = {
            firstName,
            lastName,
            email,
            phoneNumber,
            salt,
            hashedPassword,
            userType,
            createdAt: new Date()
        };

        await usersCol.insertOne(newUser);
        res.status(201).json({ message: "User registered successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    } finally {
        await client.close();
    }
});

// Login User (existing)
app.post('/login', async (req, res) => {
    const { 
        email, 
        password 
    } = req.body;

    try {
        await client.connect();
        const usersCol = client.db(databaseName).collection(usersCollectionName);

        const user = await usersCol.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        const hashedPassword = hashPassword(password, user.salt);
        if (hashedPassword !== user.hashedPassword) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign({ email, userType: user.userType, userId: user._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: '12h'
        });

        res.json({ email, token, userType: user.userType, message: "Login successful" });


    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    } finally {
        await client.close();
    }
});


//get Property
app.get('/properties/:propertyId', verifyToken, async (req, res) => {
  const { propertyId } = req.params;

  try {
    await client.connect();
    const propertiesCol = client.db(databaseName).collection(propertiesCollectionName);

    const property = await propertiesCol.findOne({ _id: new ObjectId(propertyId) });
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    if (property.userId.toString() !== req.user.userId) {
      return res.status(403).json({ error: "You don't have permission to access this property" });
    }

    res.json(property);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  } finally {
    await client.close();
  }
});

//Add Property
app.post('/properties', verifyToken, async (req, res) => {

    if (req.user.userType !== 'Owner') {
        return res.status(403).json({ error: "Only Owners can add properties" });
    }

    const {
        propertyName,
        address,
        neighborhood,
        squareFootage,
        parkingGarage,
        publicTransitAccess,
        photoUrl,
        additionalNotes
    } = req.body;

    try {
        await client.connect();
        const propertiesCol = client.db(databaseName).collection(propertiesCollectionName);

        const newProperty = {
            userId: new ObjectId(req.user.userId),
            propertyName,
            address,
            neighborhood,
            squareFootage: Number(squareFootage),
            parkingGarage: Boolean(parkingGarage),
            publicTransitAccess: Boolean(publicTransitAccess),
            photoUrl: photoUrl || null,
            additionalNotes: additionalNotes || '',
            createdAt: new Date()
        };

        const result = await propertiesCol.insertOne(newProperty);
        res.status(201).json({ message: "Property added successfully", propertyId: result.insertedId });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    } finally {
        await client.close();
    }
});


//Edit Property
app.put('/properties/:propertyId', verifyToken, async (req, res) => {
  const { propertyId } = req.params;
  const { propertyName, address, neighborhood, squareFootage, parkingGarage, publicTransitAccess, additionalNotes } = req.body;

  try {
    await client.connect();
    const propertiesCol = client.db(databaseName).collection(propertiesCollectionName);

    const property = await propertiesCol.findOne({ _id: new ObjectId(propertyId) });

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    if (property.userId.toString() !== req.user.userId) {
      return res.status(403).json({ error: "You don't have permission to edit this property" });
    }

    const updateDoc = {
      $set: {
        propertyName,
        address,
        neighborhood,
        squareFootage: Number(squareFootage),
        parkingGarage: Boolean(parkingGarage),
        publicTransitAccess: Boolean(publicTransitAccess),
        additionalNotes: additionalNotes || ''
      }
    };

    await propertiesCol.updateOne({ _id: new ObjectId(propertyId) }, updateDoc);

    res.json({ message: "Property updated successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  } finally {
    await client.close();
  }
});

//Delete Property

app.delete('/properties/:propertyId', verifyToken, async (req, res) => {
    const { propertyId } = req.params;

    try {
        await client.connect();
        const propertiesCol = client.db(databaseName).collection(propertiesCollectionName);
        const workspacesCol = client.db(databaseName).collection(workspacesCollectionName);

        // Find the property
        const property = await propertiesCol.findOne({ _id: new ObjectId(propertyId) });
        if (!property) {
            return res.status(404).json({ error: "Property not found" });
        }

        // Check ownership
        if (property.userId.toString() !== req.user.userId) {
            return res.status(403).json({ error: "You don't have permission to delete this property" });
        }

        // Delete associated workspaces first
        await workspacesCol.deleteMany({ propertyId: new ObjectId(propertyId) });

        // Then delete the property itself
        await propertiesCol.deleteOne({ _id: new ObjectId(propertyId) });

        res.status(200).json({ message: "Property and associated workspaces deleted successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    } finally {
        await client.close();
    }
});

// Get all workspaces for a property
app.get('/properties/:propertyId/workspaces', verifyToken, async (req, res) => {
    const { propertyId } = req.params;

    try {
        await client.connect();
        const db = client.db(databaseName);
        const propertiesCol = db.collection(propertiesCollectionName);
        const workspacesCol = db.collection(workspacesCollectionName);
        const usersCol = db.collection(usersCollectionName);

        const property = await propertiesCol.findOne({ _id: new ObjectId(propertyId) });
        if (!property) return res.status(404).json({ error: "Property not found" });

        if (property.userId.toString() !== req.user.userId) {
            return res.status(403).json({ error: "You don't have permission to access this property" });
        }

        const workspaces = await workspacesCol.find({ propertyId: new ObjectId(propertyId) }).toArray();

        const owner = await usersCol.findOne({ _id: new ObjectId(property.userId) }, 
            { projection: { firstName: 1, lastName: 1, phoneNumber: 1 } }
        );

        const response = workspaces.map(ws => ({
            ...ws,
            ownerName: owner ? `${owner.firstName} ${owner.lastName}` : '',
            ownerPhone: owner ? owner.phoneNumber : ''
        }));

        res.json(response);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error fetching workspaces" });
    } finally {
        await client.close();
    }
});


//Get Workspace
app.get('/properties/:propertyId/workspaces/:workspaceId', async (req, res) => {
  try {
    await client.connect();
    const db = client.db(databaseName);

    const propertiesCol = db.collection(propertiesCollectionName);
    const workspacesCol = db.collection(workspacesCollectionName);
    const usersCol = db.collection(usersCollectionName);

    const { propertyId, workspaceId } = req.params;

    const propertyObjectId = ObjectId.isValid(propertyId) ? new ObjectId(propertyId) : null;
    const workspaceObjectId = ObjectId.isValid(workspaceId) ? new ObjectId(workspaceId) : null;

    if (!propertyObjectId || !workspaceObjectId) {
      return res.status(400).json({ error: "Invalid propertyId or workspaceId" });
    }

    const property = await propertiesCol.findOne({ _id: propertyObjectId });
    if (!property) return res.status(404).json({ error: 'Property not found' });

    const workspace = await workspacesCol.findOne({ 
      _id: workspaceObjectId,
      propertyId: propertyObjectId
    });
    if (!workspace) return res.status(404).json({ error: 'Workspace not found' });

    let owner = null;
    if (property.userId && ObjectId.isValid(property.userId)) {
    owner = await usersCol.findOne(
        { _id: new ObjectId(property.userId) },
        { projection: { firstName: 1, lastName: 1, phoneNumber: 1 } }
    );
    }

    res.json({ workspace, property, user: owner });
  } catch (error) {
    console.error("GET /properties/:propertyId/workspaces/:workspaceId error:", error);
    res.status(500).json({ error: 'Error retrieving workspace details' });
  } finally {
    await client.close();
  }
});

//Add Workspace
app.post('/properties/:propertyId/workspaces', verifyToken, async (req, res) => {
    const { propertyId } = req.params;

    const {
        workspaceName,
        workspaceType,
        capacity,
        smokingAllowed,
        availabilityStartDate,
        leaseTerm,
        price,
        additionalNotes
    } = req.body;

    try {
        await client.connect();
        const propertiesCol = client.db(databaseName).collection(propertiesCollectionName);
        const workspacesCol = client.db(databaseName).collection(workspacesCollectionName);

        const property = await propertiesCol.findOne({ _id: new ObjectId(propertyId) });
        if (!property) {
            return res.status(404).json({ error: "Property not found" });
        }
        if (property.userId.toString() !== req.user.userId) {
            return res.status(403).json({ error: "You don't have permission to add workspace to this property" });
        }

        const newWorkspace = {
            propertyId: new ObjectId(propertyId),
            workspaceName,
            workspaceType,
            capacity: Number(capacity),
            smokingAllowed: Boolean(smokingAllowed),
            availabilityStartDate: new Date(availabilityStartDate),
            leaseTerm,
            price: Number(price),
            additionalNotes: additionalNotes || '',
            createdAt: new Date()
        };

        const result = await workspacesCol.insertOne(newWorkspace);
        res.status(201).json({ message: "Workspace added successfully", workspaceId: result.insertedId });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    } finally {
        await client.close();
    }
});


//delete Workspace
app.delete('/workspaces/:workspaceId', verifyToken, async (req, res) => {
    const { workspaceId } = req.params;

    try {
        await client.connect();
        const propertiesCol = client.db(databaseName).collection(propertiesCollectionName);
        const workspacesCol = client.db(databaseName).collection(workspacesCollectionName);

        // Find workspace
        const workspace = await workspacesCol.findOne({ _id: new ObjectId(workspaceId) });
        if (!workspace) {
            return res.status(404).json({ error: "Workspace not found" });
        }

        // Find linked property
        const property = await propertiesCol.findOne({ _id: workspace.propertyId });
        if (!property) {
            return res.status(404).json({ error: "Linked property not found" });
        }

        // Check ownership
        if (property.userId.toString() !== req.user.userId) {
            return res.status(403).json({ error: "You don't have permission to delete this workspace" });
        }

        // Delete workspace
        await workspacesCol.deleteOne({ _id: new ObjectId(workspaceId) });

        res.status(200).json({ message: "Workspace deleted successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    } finally {
        await client.close();
    }
});

//Get Properties for logged-in user
app.get('/properties', verifyToken, async (req, res) => {
    try {
        await client.connect();
        const propertiesCol = client.db(databaseName).collection(propertiesCollectionName);
        const workspacesCol = client.db(databaseName).collection(workspacesCollectionName);

        const userId = new ObjectId(req.user.userId);

        const properties = await propertiesCol.find({ userId }).toArray();

        for (let property of properties) {
            const workspaces = await workspacesCol.find({ propertyId: property._id }).toArray();
            property.workspaces = workspaces;
        }

        res.json(properties);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    } finally {
        await client.close();
    }
});

//Get Workspaces for logged-in user

app.get('/workspaces', verifyToken, async (req, res) => {
    try {
        await client.connect();
        const db = client.db(databaseName);
        const propertiesCol = db.collection(propertiesCollectionName);
        const workspacesCol = db.collection(workspacesCollectionName);
        const usersCol = db.collection(usersCollectionName);

        const workspaces = await workspacesCol.find({}).toArray();

        const result = await Promise.all(workspaces.map(async ws => {

            let prop;
            try {
                prop = await propertiesCol.findOne({ _id: new ObjectId(ws.propertyId) });
            } catch {
                return null;
            }
            if (!prop) return null;

            let owner = {};
            if (prop.userId) {
                try {
                    owner = await usersCol.findOne({ _id: new ObjectId(prop.userId) }) || {};
                } catch {}
            }

            return {
                workspace: ws,
                property: {
                    ...prop,
                    ownerName: (owner.firstName || '') + ' ' + (owner.lastName || ''),
                    ownerPhone: owner.phone || ''
                }
            };
        }));

        res.json(result.filter(r => r !== null));

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    } finally {
        await client.close();
    }
});

// Edit Workspace
app.put('/workspaces/:workspaceId', verifyToken, async (req, res) => {
    const { workspaceId } = req.params;
    const {
        workspaceName,
        workspaceType,
        capacity,
        smokingAllowed,
        availabilityStartDate,
        leaseTerm,
        price,
        additionalNotes
    } = req.body;

    try {
        await client.connect();
        const workspacesCol = client.db(databaseName).collection(workspacesCollectionName);
        const propertiesCol = client.db(databaseName).collection(propertiesCollectionName);

        const workspace = await workspacesCol.findOne({ _id: new ObjectId(workspaceId) });
        if (!workspace) return res.status(404).json({ error: "Workspace not found" });

        const property = await propertiesCol.findOne({ _id: workspace.propertyId });
        if (!property) return res.status(404).json({ error: "Linked property not found" });

        if (property.userId.toString() !== req.user.userId) {
            return res.status(403).json({ error: "You don't have permission to edit this workspace" });
        }

        const updateDoc = {
            $set: {
                workspaceName,
                workspaceType,
                capacity: Number(capacity),
                smokingAllowed: Boolean(smokingAllowed),
                availabilityStartDate: new Date(availabilityStartDate),
                leaseTerm,
                price: Number(price),
                additionalNotes: additionalNotes || ''
            }
        };

        await workspacesCol.updateOne({ _id: new ObjectId(workspaceId) }, updateDoc);
        res.json({ message: "Workspace updated successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    } finally {
        await client.close();
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
