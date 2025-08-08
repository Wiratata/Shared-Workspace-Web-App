$(() => {
    const propertyId = localStorage.getItem('selectedPropertyId');
    const db = JSON.parse(localStorage.getItem('coworkingDB'));

    if (!propertyId || !db) {
        $('body').append('<p style="padding:2rem; color:red;">Unable to load property details.</p>');
        return;
    }

    const property = db.properties.find(p => p.propertyId === propertyId);

    if (!property) {
        $('body').append('<p style="padding:2rem; color:red;">Property not found.</p>');
        return;
    }

    const $section = $('<section id="propertyDetailSection"></section>');

    const $detail = $(`
        <div class="propertyDetailCard">
            <div id="propertyHeaderContainer">
                <h2>${property.name}</h2>
                <button id="addWorkspaceBtn" class="btn">Add Workspace</button>
            </div>
            <div id="propertyDetailContainer">
                <div id="PropertyDetail">
                    <p><strong>Address:</strong> ${property.address}</p>
                    <p><strong>Neighborhood:</strong> ${property.neighborhood}</p>
                    <p><strong>Square Footage:</strong> ${property.squareFootage} sq ft</p>
                    <p><strong>Parking:</strong> ${property.parking}</p>
                    <p><strong>Public Transit:</strong> ${property.transit}</p>
                    <p><strong>Notes:</strong> ${property.notes}</p>
                </div>
                <div id="propertyImage">
                    <img src="Images/${property.photoNames[0]}" alt="${property.name}" style="max-width:100%; margin-top:1rem;">
                </div>
            </div>
            <div class="propertyBtn">
                <button id="edit${propertyId}" class="btn">Edit</button>
                <button id="delete${propertyId}" class="btn">Delete</button>
            </div>
        </div>
    `);

    $section.append($detail);
    $('body').append($section);

    $('#addWorkspaceBtn').click(function() {
        window.location.href = './AddWorkspaceFormPage.html';
    });

    $(`#edit${propertyId}`).click(() => {
        window.location.href = './EditPropertyPage.html';
    });
});

