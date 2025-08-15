$(() => {
    const workspaceId = localStorage.getItem('selectedWorkspaceId');
    const propertyId = localStorage.getItem('selectedPropertyId');
    const token = localStorage.getItem('token');

    const $formContainer = $(`<div id="formContainer"></div>`);
    $('body').append($formContainer);

    if (!workspaceId || !propertyId || !token) {
        $('#formContainer').append('<p style="padding:2rem; color:red;">Missing workspace, property, or token.</p>');
        return;
    }

    async function fetchWorkspace() {
        try {
            const res = await fetch(`/properties/${propertyId}/workspaces/${workspaceId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to fetch workspace');
            return await res.json();
        } catch (err) {
            console.error(err);
            alert('Error loading workspace data');
            return null;
        }
    }

    function renderForm(workspace) {
        const $form = $(`
            <form id="editWorkspaceForm">
                <h2>Edit Workspace</h2>
                <p>Workspaces can be meeting rooms, private offices, or desks in an open area. Update the details below.</p>

                <label for="workspaceName">Workspace Name</label>
                <input type="text" id="workspaceName" name="workspaceName" required>

                <label for="workspaceType">Workspace Type</label>
                <select id="workspaceType" name="workspaceType" required>
                    <option value="">-- Select Type --</option>
                    <option value="Desk">Desk</option>
                    <option value="Meeting Room">Meeting Room</option>
                    <option value="Private Office">Private Office</option>
                </select>

                <label for="capacity">Capacity</label>
                <input type="number" id="capacity" name="capacity" required>

                <label>Smoking Allowed</label>
                <div>
                    <label><input type="radio" name="smoking" value="Yes"> Yes</label>
                    <label><input type="radio" name="smoking" value="No"> No</label>
                </div>

                <label for="availableFrom">Availability Start Date</label>
                <input type="date" id="availableFrom" name="availableFrom" required>

                <label for="leaseTerm">Lease Term</label>
                <select id="leaseTerm" name="leaseTerm" required>
                    <option value="">-- Select Term --</option>
                    <option value="Per Day">Per Day</option>
                    <option value="Per Week">Per Week</option>
                    <option value="Per Month">Per Month</option>
                </select>

                <label for="price">Price</label>
                <input type="text" id="price" name="price" required>

                <label for="notes">Additional Notes (optional)</label>
                <textarea id="notes" name="notes" rows="3"></textarea>

                <button type="submit">Update Workspace</button>
            </form>
        `);

        // Prefill the data
        $form.find('#workspaceName').val(workspace.workspace.workspaceName);
        $form.find('#workspaceType').val(workspace.workspace.workspaceType);
        $form.find('#capacity').val(workspace.workspace.capacity);
        $form.find('input[name="smoking"][value="' + (workspace.workspace.smokingAllowed ? 'Yes' : 'No') + '"]').prop('checked', true);
        $form.find('#availableFrom').val(workspace.workspace.availabilityStartDate.slice(0, 10)); // format YYYY-MM-DD
        $form.find('#leaseTerm').val(workspace.workspace.leaseTerm);
        $form.find('#price').val(workspace.workspace.price);
        $form.find('#notes').val(workspace.workspace.additionalNotes);

        $('#formContainer').append($form);

        // Handle submit
        $('#editWorkspaceForm').on('submit', async function (e) {
            e.preventDefault();

            const updatedWorkspace = {
                workspaceName: $('#workspaceName').val(),
                workspaceType: $('#workspaceType').val(),
                capacity: $('#capacity').val(),
                smokingAllowed: $('input[name="smoking"]:checked').val() === 'Yes',
                availabilityStartDate: $('#availableFrom').val(),
                leaseTerm: $('#leaseTerm').val(),
                price: $('#price').val(),
                additionalNotes: $('#notes').val()
            };

            try {
                const res = await fetch(`/workspaces/${workspaceId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(updatedWorkspace)
                });

                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.error || 'Failed to update workspace');
                }

                alert('Workspace updated successfully!');
                window.location.href = './PropertyDetails.html';

            } catch (err) {
                console.error(err);
                alert('Error updating workspace: ' + err.message);
            }
        });
    }

    // Initialize
    fetchWorkspace().then(workspace => {
        if (workspace) renderForm(workspace);
    });
});