$(() => {
    $('#addWorkspaceForm').on('submit', function(e) {
        e.preventDefault();

        const propertyId = localStorage.getItem('selectedPropertyId');
        const url = "http://localhost:3000";


        if (!propertyId) {
            alert("No property selected to add workspace to.");
            return;
        }

        const workspace = {
            propertyId,
            workspaceName: $('#workspaceName').val(),
            workspaceType: $('#workspaceType').val(),
            capacity: $('#capacity').val(),
            smokingAllowed: $('input[name="smoking"]:checked').val(),
            availabilityStartDate: $('#availableFrom').val(),
            leaseTerm: $('#leaseTerm').val(),
            price: $('#price').val(),
            additionalNotes: $('#notes').val()
        };

        fetch(`${url}/properties/${propertyId}/workspaces`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify(workspace)
        })
        .then(res => res.json())
        .then(data => {
            alert("Workspace saved!");
            console.log(data);
            window.location.href = './PropertyDetails.html';
        })
        .catch(err => {
            console.error(err);
            alert("Error saving workspace");
        });
    });
});