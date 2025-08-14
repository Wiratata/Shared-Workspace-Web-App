$(() => {
    const propertyId = localStorage.getItem('selectedPropertyId');
    const token = localStorage.getItem('token');

    const $formContainer = $(`<div id="formContainer"></div>`);
    $('body').append($formContainer);

    if (!propertyId || !token) {
      alert("Missing property or authentication. Please login again.");
      window.location.href = "LoginPage.html";
      return;
    }

    const url = "http://localhost:3000";

    fetch(`${url}/properties/${propertyId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => {
      if (!res.ok) throw new Error('Failed to load property data');
      return res.json();
    })
    .then(property => {

      const $form = $(`
        <form id="editPropertyForm" enctype="multipart/form-data">
          <h2>${property.propertyName}</h2>
          <p>Update your property details below.</p>

          <label for="propertyName">Property Name</label>
          <input type="text" id="propertyName" name="propertyName" value="${property.propertyName}" required>

          <label for="address">Address</label>
          <textarea id="address" name="address" rows="2" required>${property.address}</textarea>

          <label for="neighborhood">Neighborhood</label>
          <input type="text" id="neighborhood" name="neighborhood" value="${property.neighborhood}" required>

          <label for="squareFootage">Square Footage</label>
          <input type="text" id="squareFootage" name="squareFootage" value="${property.squareFootage}" required>

          <label>Parking Garage Available</label>
          <div class="radioForm">
            <label><input type="radio" name="parkingGarage" value="true" ${property.parkingGarage ? "checked" : ""}> Yes</label>
            <label><input type="radio" name="parkingGarage" value="false" ${!property.parkingGarage ? "checked" : ""}> No</label>
          </div>

          <label>Public Transit Access</label>
          <div class="radioForm">
            <label><input type="radio" name="publicTransitAccess" value="true" ${property.publicTransitAccess ? "checked" : ""}> Yes</label>
            <label><input type="radio" name="publicTransitAccess" value="false" ${!property.publicTransitAccess ? "checked" : ""}> No</label>
          </div>

          <label for="notes">Additional Notes (optional)</label>
          <textarea id="notes" name="notes" rows="3">${property.additionalNotes || ""}</textarea>

          <button type="submit">Update Property</button>
        </form>
      `);

      $('#formContainer').append($form);

      $('#editPropertyForm').on('submit', async function(e) {
        e.preventDefault();

        const updatedProperty = {
          propertyName: $('#propertyName').val(),
          address: $('#address').val(),
          neighborhood: $('#neighborhood').val(),
          squareFootage: Number($('#squareFootage').val()),
          parkingGarage: $('input[name="parkingGarage"]:checked').val() === 'true',
          publicTransitAccess: $('input[name="publicTransitAccess"]:checked').val() === 'true',
          additionalNotes: $('#notes').val()
        };

        try {
          const response = await fetch(`${url}/properties/${propertyId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updatedProperty)
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to update property');
          }

          alert('Property updated successfully!');
          window.location.href = './OwnerDashboardPage.html';

        } catch (error) {
          alert('❌ ' + error.message);
        }
      });
    })
    .catch(err => {
      alert('Failed to load property data: ' + err.message);
    });
});
