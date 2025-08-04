$(() => {
    $('#addPropertyForm').on('submit', function(e) {
        e.preventDefault();

        const property = {
            name: $('#propertyName').val(),
            address: $('#address').val(),
            neighborhood: $('#neighborhood').val(),
            squareFootage: $('#squareFootage').val(),
            parking: $('input[name="parking"]:checked').val(),
            transit: $('input[name="transit"]:checked').val(),
            notes: $('#notes').val(),
            photoNames: []
        };

        const files = $('#photos')[0].files;
        for (let i = 0; i < files.length; i++) {
            property.photoNames.push(files[i].name);
        }

        const existing = JSON.parse(localStorage.getItem('properties')) || [];

        existing.push(property);

        localStorage.setItem('properties', JSON.stringify(existing));

        console.log("Added Property:", property);

        console.log("All Properties:", existing);

        alert('Property saved!');
        $('#addPropertyForm')[0].reset();
    });
});
