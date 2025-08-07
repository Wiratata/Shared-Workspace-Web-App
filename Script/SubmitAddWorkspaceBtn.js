$(() => {
    $('#addWorkspaceForm').on('submit', function(e) {
        e.preventDefault();

        const db = JSON.parse(localStorage.getItem('coworkingDB')) || { properties: [] };
        const propertyId = localStorage.getItem('selectedPropertyId');

        if (!propertyId) {
            alert("No property selected to add workspace to.");
            return;
        }

        const property = db.properties.find(p => p.propertyId === propertyId);
        if (!property) {
            alert("Property not found.");
            return;
        }

        const workspace = {
            workspaceId: `ws_${Date.now()}`,
            name: $('#workspaceName').val(),
            type: $('#workspaceType').val(),
            capacity: $('#capacity').val(),
            smoking: $('input[name="smoking"]:checked').val(),
            availableFrom: $('#availableFrom').val(),
            leaseTerm: $('#leaseTerm').val(),
            price: $('#price').val(),
            notes: $('#notes').val()
        };

        property.workspaces = property.workspaces || [];
        property.workspaces.push(workspace);

        localStorage.setItem('coworkingDB', JSON.stringify(db));

        console.log("Added Workspace:", workspace);
        alert("Workspace saved!");
        $('#addWorkspaceForm')[0].reset();
    });
});