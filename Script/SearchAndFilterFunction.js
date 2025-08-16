import {url} from "./config.js";

$(document).ready(function () {
    let workspaces = [];
    
    async function fetchWorkspaces() {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${url}/workspaces`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to fetch workspaces');
            const data = await res.json();
            workspaces = data;
            renderWorkspaceList(workspaces);
        } catch (err) {
            console.error(err);
            $('#workspaceList').html('<p style="color:red;">Failed to load workspaces</p>');
        }
    }

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
                <div class="workspaceCard" style="cursor:pointer;" data-workspace-id="${ws._id}">
                    <h3>${ws.workspaceName}</h3>
                    <p><strong>Location:</strong> ${prop.address}</p>
                    <p><strong>Seats:</strong> ${ws.capacity}</p>
                    <p><strong>Smoking:</strong> ${ws.smokingAllowed ? 'Yes' : 'No'}</p>
                    <p><strong>Parking:</strong> ${prop.parkingGarage ? 'Yes' : 'No'}</p>
                    <p><strong>Transit:</strong> ${prop.publicTransitAccess ? 'Yes' : 'No'}</p>
                    <p><strong>Lease Term:</strong> ${ws.leaseTerm}</p>
                    <p><strong>Price:</strong> $${ws.price}</p>
                </div>
            `);

            $card.on('click', () => {
                localStorage.setItem('selectedWorkspaceId', ws._id);
                localStorage.setItem('selectedPropertyId', prop._id);
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

        const filtered = workspaces.filter(({ workspace: ws, property: prop }) => {
            if (!prop) return false;

            return (
                (ws.workspaceName || '').toLowerCase().includes(name) &&
                (prop.address || '').toLowerCase().includes(location) &&
                (ws.price || 0) >= minPrice &&
                (ws.price || 0) <= maxPrice &&
                (ws.capacity || 0) >= seats &&
                (smoking === '' || (ws.smokingAllowed ? 'yes' : 'no') === smoking) &&
                (parking === '' || (prop.parkingGarage ? 'yes' : 'no') === parking) &&
                (transit === '' || (prop.publicTransitAccess ? 'yes' : 'no') === transit) &&
                (leaseTerm === '' || (ws.leaseTerm || '') === leaseTerm) &&
                (ws.squareFootage || 0) >= minSqft &&
                (ws.squareFootage || 0) <= maxSqft
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

    fetchWorkspaces();
});