$(() => {
    const propertyId = localStorage.getItem('selectedPropertyId');
    const token = localStorage.getItem('token');

    const url = "http://localhost:3000";

    const $section = $('<div id="propertyDetailSection"></div>');
    $('body').append($section);


    if (!propertyId || !token) {
        $('body').append('<p style="padding:2rem; color:red;">Unable to load property details or missing token.</p>');
        return;
    }

    async function fetchProperty() {
        try {
        const res = await fetch(`${url}/properties/${propertyId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!res.ok) throw new Error('Failed to load property details');
        return await res.json();
        } catch (error) {
        console.error(error);
        alert('Error loading property details.');
        return null;
        }
    }

    async function fetchWorkspaces() {
        try {
        const res = await fetch(`${url}/properties/${propertyId}/workspaces`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to load workspaces');
        return await res.json();
        } catch (error) {
        console.error(error);
        alert('Error loading workspaces.');
        return [];
        }
    }

    async function init() {
        const property = await fetchProperty();
        if (!property) return;

        const photoSrc = property.photoUrl || 'Images/default-property.png';


        const $detail = $(`
        <div class="propertyDetailCard">
            <div id="propertyHeaderContainer">
            <h2>${property.propertyName}</h2>
            <button id="addWorkspaceBtn" class="btn">Add Workspace</button>
            </div>
            <div id="propertyDetailContainer">
            <div id="PropertyDetail">
                <p><strong>Address:</strong> ${property.address}</p>
                <p><strong>Neighborhood:</strong> ${property.neighborhood}</p>
                <p><strong>Square Footage:</strong> ${property.squareFootage} sq ft</p>
                <p><strong>Parking:</strong> ${property.parkingGarage ? 'Yes' : 'No'}</p>
                <p><strong>Public Transit:</strong> ${property.publicTransitAccess ? 'Yes' : 'No'}</p>
                <p><strong>Notes:</strong> ${property.additionalNotes || 'N/A'}</p>
            </div>
            <div id="propertyImage">
                <img src="${photoSrc}" alt="${property.propertyName}" style="max-width:100%; margin-top:1rem;">
            </div>
            </div>
            <div class="propertyBtn">
            <button id="editPropertyBtn" class="btn">Edit</button>
            <button id="deletePropertyBtn" class="btn">Delete</button>
            </div>
            <div id="workspaceResults"></div>
        </div>
        `);

        $section.append($detail);
        $('#propertyDetailSection').append($detail);

        const $results = $('#workspaceResults');
        let myWorkspaces = [];

        function renderWorkspaces(list) {
        $results.empty();
        if (list.length === 0) {
            $results.html(`
            <p class="emptyMessage">
                You haven’t listed any workspace yet.<br>
                Start by adding your first workspace.
            </p>
            `);
        } else {
            list.forEach(ws => {
            const $card = $(`
                <div class="workspaceCard">
                <h4>
                    <a href="WorkspaceDetailPage.html" class="workspaceLink" data-id="${ws._id}">${ws.workspaceName}</a>
                </h4>
                <div class="workspaceBtn">
                    <button class="editBtn" data-id="${ws._id}">Edit</button>
                    <button class="deleteBtn" data-id="${ws._id}">Delete</button>
                </div>
                </div>
            `);

            $results.append($card);

            $card.find('.workspaceLink').on('click', function () {
                localStorage.setItem('selectedWorkspaceId', $(this).data('id'));
            });

            $card.find('.editBtn').on('click', function () {
                localStorage.setItem('selectedWorkspaceId', $(this).data('id'));
                window.location.href = './EditWorkspacePage.html'; 
            });

            $card.find('.deleteBtn').on('click', async function () {
                const workspaceId = $(this).data('id');
                if (!confirm('Are you sure you want to delete this workspace?')) return;

                try {
                const res = await fetch(`${url}/workspaces/${workspaceId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.error || 'Failed to delete workspace');
                }

                alert('Workspace deleted successfully!');
                myWorkspaces = myWorkspaces.filter(w => w._id !== workspaceId);
                renderWorkspaces(myWorkspaces);

                } catch (err) {
                alert('Error deleting workspace: ' + err.message);
                }
            });
            });
        }
        }

        myWorkspaces = await fetchWorkspaces();
        renderWorkspaces(myWorkspaces);

        $('#addWorkspaceBtn').click(() => {
        localStorage.setItem('selectedPropertyId', propertyId);
        window.location.href = './AddWorkspaceFormPage.html';
        });

        $('#editPropertyBtn').click(() => {
        localStorage.setItem('selectedPropertyId', propertyId);
        window.location.href = './EditPropertyPage.html';
        });

        $('#deletePropertyBtn').click(async () => {
        if (!confirm('Are you sure you want to delete this property?')) return;

        try {
            const res = await fetch(`http://localhost:3000/properties/${propertyId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error || 'Failed to delete property');
            }

            alert('Property deleted successfully!');
            window.location.href = './OwnerDashboardPage.html';

        } catch (err) {
            alert('Error deleting property: ' + err.message);
        }
        });
    }

    init();
});
