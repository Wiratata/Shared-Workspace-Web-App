$(() => {
  const propertyId = localStorage.getItem('selectedPropertyId');
  const db = JSON.parse(localStorage.getItem('coworkingDB'));

  if (!propertyId || !db) {
    $('body').append('<p style="padding:2rem; color:red;">Unable to load property data for editing.</p>');
    return;
  }

  const property = db.properties.find(p => p.propertyId === propertyId);

  if (!property) {
    $('body').append('<p style="padding:2rem; color:red;">Property not found for editing.</p>');
    return;
  }

  const $form = $(`
          <form id="editPropertyForm" enctype="multipart/form-data">
            <h2>${property.name}</h2>
            <p>Update your property details below. Make sure everything is accurate and up to date to ensure coworkers can easily find and book your space.</p>

            <label for="propertyName">Property Name</label>
            <input type="text" id="propertyName" name="propertyName" value="${property.name}" required>

            <label for="address">Address</label>
            <textarea id="address" name="address" rows="2" required>${property.address}</textarea>

            <label for="neighborhood">Neighborhood</label>
            <input type="text" id="neighborhood" name="neighborhood" value="${property.neighborhood}" required>

            <label for="squareFootage">Square Footage</label>
            <input type="text" id="squareFootage" name="squareFootage" value="${property.squareFootage}" required>

            <label>Parking Garage Available</label>
            <div class="radioForm">
              <label><input type="radio" name="parking" value="Yes" ${property.parking === "Yes" ? "checked" : ""}> Yes</label>
              <label><input type="radio" name="parking" value="No" ${property.parking === "No" ? "checked" : ""}> No</label>
            </div>

            <label>Public Transit Access</label>
            <div class="radioForm">
              <label><input type="radio" name="transit" value="Yes" ${property.transit === "Yes" ? "checked" : ""}> Yes</label>
              <label><input type="radio" name="transit" value="No" ${property.transit === "No" ? "checked" : ""}> No</label>
            </div>

            <label for="photos">Upload New Photos (optional)</label>
            <input type="file" id="photos" name="photos" multiple accept="image/*">

            <label for="notes">Additional Notes (optional)</label>
            <textarea id="notes" name="notes" rows="3">${property.notes || ""}</textarea>

            <button type="submit">Update Property</button>
          </form>
  `);

  $('body').append($form);
  
    $(() => {
    $('#editPropertyForm').on('submit', function (e) {
        e.preventDefault();

        // Update property fields from form values
        property.name = $('#propertyName').val();
        property.address = $('#address').val();
        property.neighborhood = $('#neighborhood').val();
        property.squareFootage = $('#squareFootage').val();
        property.parking = $('input[name="parking"]:checked').val();
        property.transit = $('input[name="transit"]:checked').val();
        property.notes = $('#notes').val();

        // Note: for simplicity, we're not updating photoNames here

        // Save updated DB back to localStorage
        localStorage.setItem('coworkingDB', JSON.stringify(db));

        alert('Property updated successfully!');
        window.location.href = './PropertyDetails.html';
    });
});
});
