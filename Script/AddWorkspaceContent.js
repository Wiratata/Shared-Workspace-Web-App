$(() => {
    const $form = $(`
        <form id="addWorkspaceForm">
            <h2>Add a New Workspace</h2>
            <p>Workspaces can be meeting rooms, private offices, or desks in an open area. Please fill in the details below to make this workspace available for booking.</p>

            <label for="workspaceName">Workspace Name</label>
            <input type="text" id="workspaceName" name="workspaceName" placeholder=" Give your workspace a clear and short name" required>

            <label for="workspaceType">Workspace Type</label>
            <select id="workspaceType" name="workspaceType" required>
                <option value="">-- Select Type --</option>
                <option value="Desk">Desk</option>
                <option value="Meeting Room">Meeting Room</option>
                <option value="Private Office">Private Office</option>
            </select>

            <label for="capacity">Capacity</label>
            <input type="number" id="capacity" name="capacity" placeholder=" Example: 1, 4, 8" required>

            <label>Smoking Allowed</label>
            <div>
                <label><input type="radio" name="smoking" value="Yes" required> Yes</label>
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
            <input type="text" id="price" name="price" placeholder=" Example: $20/day or $150/week" required>

            <label for="notes">Additional Notes (optional)</label>
            <textarea id="notes" name="notes" rows="3" placeholder="Natural light, whiteboard included, near washroom, etc."></textarea>

            <button type="submit">Submit</button>
        </form>
    `);

    $('body').append($form);
    });