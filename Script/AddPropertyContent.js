$(() => {
    const $form = $(`
        <form id="addPropertyForm" enctype="multipart/form-data">
            <h2>Add a New Property</h2>
            <p>List a new property to make it available for coworking space rentals. Include the location, key details, and at least one photo to attract potential coworkers.</p>
            
            <label for="propertyName">Property Name</label>
            <input type="text" id="propertyName" name="propertyName" placeholder="Example: Downtown Business Hub" required>

            <label for="address">Address</label>
            <textarea id="address" name="address" rows="2" placeholder="123 4th Ave SW, Calgary, AB" required></textarea>

            <label for="neighborhood">Neighborhood</label>
            <input type="text" id="neighborhood" name="neighborhood" placeholder="Beltline, Inglewood" required>

            <label for="squareFootage">Square Footage</label>
            <input type="text" id="squareFootage" name="squareFootage" placeholder="1,200 sq ft" required>

            <label>Parking Garage Available</label>
            <div class="radioForm">
                <label><input type="radio" name="parking" value="Yes" required> Yes</label>
                <label><input type="radio" name="parking" value="No"> No</label>
            </div>

            <label>Public Transit Access</label>
            <div class="radioForm">
                <label><input type="radio" name="transit" value="Yes" required> Yes</label>
                <label><input type="radio" name="transit" value="No"> No</label>
            </div>

            <label for="photos">Upload Photos</label>
            <input type="file" id="photos" name="photos" multiple accept="image/*">

            <label for="notes">Additional Notes (optional)</label>
            <textarea id="notes" name="notes" rows="3" placeholder="Natural light, near washroom, etc."></textarea>

            <button type="submit">Save Property</button>
        </form>
    `);

    $('body').append($form);

})