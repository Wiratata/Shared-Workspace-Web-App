const dummyDatabase = [
    {
        name: "Worksy Central",
        location: "Downtown",
        seats: 10,
        price: 400,
        smoking: "No",
        parking: "Yes",
        transit: "Yes",
        sqft: 600,
        leaseTerm: "Per Month"
    },
    {
        name: "Creative Hub",
        location: "Uptown",
        seats: 4,
        price: 200,
        smoking: "Yes",
        parking: "No",
        transit: "Yes",
        sqft: 250,
        leaseTerm: "Per Day"
    },
    {
        name: "Freelance Den",
        location: "Midtown",
        seats: 6,
        price: 300,
        smoking: "No",
        parking: "Yes",
        transit: "No",
        sqft: 400,
        leaseTerm: "Per Week"
    },
    {
        name: "Startup Nest",
        location: "Downtown",
        seats: 12,
        price: 600,
        smoking: "No",
        parking: "Yes",
        transit: "Yes",
        sqft: 800,
        leaseTerm: "Per Month"
    },
    {
        name: "Remote Works",
        location: "Suburb",
        seats: 8,
        price: 250,
        smoking: "Yes",
        parking: "No",
        transit: "No",
        sqft: 500,
        leaseTerm: "Per Week"
    }
];

// this will render the result of the search or the filter
function renderWorkspaceList(results) {
    const $list = $('#workspaceList');
    $list.empty();

    if (results.length === 0) {
        $list.append('<p id="filterNoMatch">No workspaces match your search.</p>');
        return;
    }

    results.forEach(ws => {
        const card = $(`
        <div class="workspaceCard">
            <h3>${ws.name}</h3>
            <p><strong>Location:</strong> ${ws.location}</p>
            <p><strong>Seats:</strong> ${ws.seats}</p>
            <p><strong>Smoking:</strong> ${ws.smoking}</p>
            <p><strong>Parking:</strong> ${ws.parking}</p>
            <p><strong>Transit:</strong> ${ws.transit}</p>
            <p><strong>Sqft:</strong> ${ws.sqft}</p>
            <p><strong>Lease Term:</strong> ${ws.leaseTerm}</p>
            <p><strong>Price:</strong> $${ws.price}</p>
        </div>
        `);
        $list.append(card);
    });
}

// this function will apply filter that user input to database and only get the filtered data
function applyFilters() {
    const name = $('#searchName').val().toLowerCase();
    const location = $('#searchLocation').val().toLowerCase();

    const minPrice = parseFloat($('#minPrice').val()) || 0;
    const maxPrice = parseFloat($('#maxPrice').val()) || Infinity;

    const seats = parseInt($('#filterSeats').val()) || 0;
    const smoking = $('#filterSmoking').val();
    const parking = $('#filterParking').val();
    const transit = $('#filterTransit').val();
    const leaseTerm = $('#filterLease').val();

    const minSqft = parseFloat($('#minSqft').val()) || 0;
    const maxSqft = parseFloat($('#maxSqft').val()) || Infinity;

    const filtered = dummyDatabase.filter(ws => {
        return (
        ws.name.toLowerCase().includes(name) &&
        ws.location.toLowerCase().includes(location) &&
        ws.price >= minPrice &&
        ws.price <= maxPrice &&
        ws.seats >= seats &&
        (smoking === '' || ws.smoking === smoking) &&
        (parking === '' || ws.parking === parking) &&
        (transit === '' || ws.transit === transit) &&
        (leaseTerm === '' || ws.leaseTerm === leaseTerm) &&
        ws.sqft >= minSqft &&
        ws.sqft <= maxSqft
        );
    });

    renderWorkspaceList(filtered);
}

//filter button function to show all the filter that can be filter
$(document).ready(function () {
    $('#filtersContainer').hide();
    $('#searchContainer').css('margin-bottom', '5vw');

    $('#filterBtn').on('click', function () {
    $('#filtersContainer').slideToggle(200, function () {
        $('#searchContainer').css(
        'margin-bottom',
        $('#filtersContainer').is(':visible') ? '0.5vw' : '5vw'
        );
    });
    $('#filterBtn').toggleClass('active');
});

// +- button function for seats filter
const $numberInput = $('#filterSeats');
$('.minBtn').on('click', function () {
    let current = parseInt($numberInput.val()) || 0;
    if (current > 0) $numberInput.val(current - 1);
});
$('.plusBtn').on('click', function () {
    let current = parseInt($numberInput.val()) || 0;
    $numberInput.val(current + 1);
});

// Filter trigger
$('#applyFilters').on('click', applyFilters);

$('#searchLocation').on('keypress', function (e) {
    if (e.which === 13) {
      e.preventDefault();
      applyFilters();
    }
});

renderWorkspaceList(dummyDatabase);
});



// Function to sort and re-render properties by selected criteria
function sortProperties(criteria) {
    dummyDatabase.sort((a, b) => {
        if (criteria === 'location') {
            return a.location.localeCompare(b.location);
        } else {
            return (a[criteria] || 0) - (b[criteria] || 0);
        }
    });
    renderProperties(dummyDatabase); // Re-render with sorted data
}

// Add event listener to dropdown (if exists on page)
document.addEventListener("DOMContentLoaded", function () {
    const sortDropdown = document.getElementById("sortBy");
    if (sortDropdown) {
        sortDropdown.addEventListener("change", function () {
            sortProperties(this.value);
        });
    }
});



// Function to delete a workspace by index
function deleteProperty(index) {
    if (index >= 0 && index < dummyDatabase.length) {
        dummyDatabase.splice(index, 1);
        renderProperties(dummyDatabase); // Re-render after deletion
    }
}

// Modify renderProperties to include delete buttons
function renderProperties(data) {
    const listContainer = document.getElementById("propertyList");
    if (!listContainer) return;

    listContainer.innerHTML = "";

    data.forEach((property, index) => {
        const item = document.createElement("li");
        item.innerHTML = \`
            <strong>\${property.name}</strong> - \${property.location} - \$\${property.price}
            <button onclick="deleteProperty(\${index})">Delete</button>
        \`;
        listContainer.appendChild(item);
    });
}
