$(() => {
    $('#addPropertyForm').on('submit', function(e) {
        e.preventDefault();

        const db = JSON.parse(localStorage.getItem('coworkingDB')) || { properties: [] };
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));

        const property = {
            propertyId: `prop_${Date.now()}`, // Unique ID
            ownerId: currentUser.id,   
            name: $('#propertyName').val(),
            address: $('#address').val(),
            neighborhood: $('#neighborhood').val(),
            squareFootage: $('#squareFootage').val(),
            parking: $('input[name="parking"]:checked').val(),
            transit: $('input[name="transit"]:checked').val(),
            notes: $('#notes').val(),
            photoNames: []
        };

        const files = $('#photos')[0]?.files || [];
        for (let i = 0; i < files.length; i++) {
            property.photoNames.push(files[i].name);
        }

        db.properties.push(property);
        localStorage.setItem('coworkingDB', JSON.stringify(db));

        console.log("Added Property:", property);
        alert('Property saved!');
        window.location.href = './OwnerDashboardPage.html';
    });
});
