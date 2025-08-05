$(() => {
    $('#addWorkspaceForm').on('submit', function(e) {
        e.preventDefault();

        const workspace = {
            name: $('#workspaceName').val(),
            type: $('#workspaceType').val(),
            capacity: $('#capacity').val(),
            smoking: $('input[name="smoking"]:checked').val(),
            availableFrom: $('#availableFrom').val(),
            leaseTerm: $('#leaseTerm').val(),
            price: $('#price').val(),
            notes: $('#notes').val()
        };

        const existing = JSON.parse(localStorage.getItem('workspaces')) || [];
        existing.push(workspace);
        localStorage.setItem('workspaces', JSON.stringify(existing));

        console.log("Added Workspace:", workspace);
        console.log("All Workspaces:", existing);

        alert("Workspace saved!");
        $('#addWorkspaceForm')[0].reset();
    });
});