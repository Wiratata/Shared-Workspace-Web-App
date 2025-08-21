const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();


const database = "userTest"
const userCollection = "users"
const propertyCollection = "properties"
const workspaceCollection = "workspaces"

// connectDatabase();

//functions
async function connectDatabase() {
    const dbUser = process.env.USER;
    const dbPass = process.env.DB_PASSWORD;
    
    const uri = `mongodb+srv://${dbUser}:${dbPass}@cluster0.lvkhy0i.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
    const client = new MongoClient(uri);
    try {
    
    }
    catch (e){
        console.log(e);
    }
    finally {
        await client.close();
    }

}

//sign up for an account
async function registerNewUser(client, newUser) {
    const result = await client
    .db(database)
    .collection(userCollection)
    .insertOne(newUser);

    console.log(`New user created ${result.insertedId}`);
}

//list properties as owner
async function listProperty(client, userInfo, newProperty) {
    if (userInfo.role != "Owner") {
        console.log("can't list property");
    }
    else {
        const result = await client
        .db(database)
        .collection(propertyCollection)
        .insertOne(newProperty);

        console.log(`New listing created ${result.insertedId}`);
    }
}

//add workspaces
async function listWorkspace(client, userInfo, propertyId, workspaceToAdd) {
    if (userInfo.role != "Owner") {
        console.log("can't list workspace");
    }
    else if (!propertyId) {
        console.log("invalid property, no workspace created");
    }
    else {
        //make new object with property id
        console.log(workspaceToAdd);
        const newWorkspace = {
            propertyId: new ObjectId(propertyId),
            meetingRoom: workspaceToAdd.meetingRoom,
            privateOffice: workspaceToAdd.privateOffice,
            openDesk: workspaceToAdd.openDesk,
            capapcity: workspaceToAdd.capacity,
            smoking: workspaceToAdd.smoking,
            availability: workspaceToAdd.availability,
            term: workspaceToAdd.term,
            price: workspaceToAdd.price
        };

        const result = await client
        .db(database)
        .collection(workspaceCollection)
        .insertOne(newWorkspace);

        console.log(`New workspace created ${result.insertedId}`);
    }
}


