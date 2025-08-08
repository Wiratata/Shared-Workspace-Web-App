
$(document).ready(function () {
    let coworkingDB = JSON.parse(localStorage.getItem('coworkingDB')) || { properties: [], workspaces: [] };
    let properties = coworkingDB.properties || [];
    let workspaces = coworkingDB.workspaces || [];

    function renderWorkspaceList(results) {
  const $list = $('#workspaceList');
  $list.empty();

  if (results.length === 0) {
    $list.append('<p id="filterNoMatch">No workspaces match your search.</p>');
    return;
  }

    results.forEach(item => {
        const ws = item.workspace;
        const prop = item.property;

        const $card = $(`
        <div class="workspaceCard" style="cursor:pointer;" data-workspace-id="${ws.workspaceId}">
            <h3>${ws.name}</h3>
            <p><strong>Location:</strong> ${prop.address}</p>
            <p><strong>Seats:</strong> ${ws.capacity}</p>
            <p><strong>Smoking:</strong> ${ws.smoking}</p>
            <p><strong>Parking:</strong> ${prop.parking}</p>
            <p><strong>Transit:</strong> ${prop.transit}</p>
            <p><strong>Lease Term:</strong> ${ws.leaseTerm}</p>
            <p><strong>Price:</strong> $${ws.price}</p>
        </div>
        `);

        $card.on('click', () => {
        const coworkingDB = JSON.parse(localStorage.getItem('coworkingDB')) || {};
        const users = coworkingDB.users || [];
        const owner = users.find(u => u.id === prop.ownerId) || {};

        localStorage.setItem('selectedWorkspaceDetail', JSON.stringify({
            workspace: ws,
            property: prop,
            owner: {
            name: owner.firstName + ' ' + owner.lastName,
            phone: owner.phone
            }
        }));

        window.location.href = 'WorkspaceDetailPage.html';
        });

        $list.append($card);
    });
    }

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

        const mapped = workspaces.map(ws => {
        const prop = properties.find(p => p.propertyId === ws.propertyId);
        return { workspace: ws, property: prop };
        });

        const filtered = mapped.filter(({ workspace: ws, property: prop }) => {
        if (!prop) return false;

        return (
            (ws.name || '').toLowerCase().includes(name) &&
            (prop.address || '').toLowerCase().includes(location) &&
            (ws.price || 0) >= minPrice &&
            (ws.price || 0) <= maxPrice &&
            (ws.capacity || 0) >= seats &&
            (smoking === '' || (ws.smoking || '') === smoking) &&
            (parking === '' || (prop.parking || '') === parking) &&
            (transit === '' || (prop.transit || '') === transit) &&
            (leaseTerm === '' || (ws.leaseTerm || '') === leaseTerm) &&
            (ws.sqft || 0) >= minSqft &&
            (ws.sqft || 0) <= maxSqft
        );
        });

        renderWorkspaceList(filtered);
    }
    $('#filtersContainer').hide();
    $('#searchContainer').css('margin-bottom', '5vw');

    $('#filterBtn').on('click', function () {
        $('#filtersContainer').slideToggle(200, function () {
        $('#searchContainer').css('margin-bottom', $('#filtersContainer').is(':visible') ? '0.5vw' : '5vw');
        });
        $('#filterBtn').toggleClass('active');
    });

    const $numberInput = $('#filterSeats');
    $('.minBtn').on('click', function () {
        let current = parseInt($numberInput.val()) || 0;
        if (current > 0) $numberInput.val(current - 1);
    });
    $('.plusBtn').on('click', function () {
        let current = parseInt($numberInput.val()) || 0;
        $numberInput.val(current + 1);
    });

    $('#applyFilters').on('click', applyFilters);

    $('#searchLocation').on('keypress', function (e) {
        if (e.which === 13) {
        e.preventDefault();
        applyFilters();
        }
    });

    renderWorkspaceList(workspaces.map(ws => {
        return { workspace: ws, property: properties.find(p => p.propertyId === ws.propertyId) };
    }));
});
