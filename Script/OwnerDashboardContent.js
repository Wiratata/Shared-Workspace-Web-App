if (!localStorage.getItem('coworkingDB')) {
  fetch('Data/full_coworking_database.json')
    .then(res => res.json())
    .then(data => {
      localStorage.setItem('coworkingDB', JSON.stringify(data));
    })
    .catch(err => console.error('Failed to load coworkingDB:', err));
}

$(() => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const coworkingDB = JSON.parse(localStorage.getItem('coworkingDB')); // load the full JSON structure
  const ownerId = currentUser?.id;

  const $dashboard = $(`
    <section id="ownerDashboardSection">
      <div class="welcomeBox">
        <h2>Welcome to Your Dashboard</h2>
        <p>Manage your properties and workspaces in one place. List new locations, edit details, or view bookings at a glance.</p>
        <button id="addPropertyBtn">Add Property</button>
      </div>

      <div class="propertiesList">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <h3>My Properties Dashboard</h3>
          <select id="sortProperties">
            <option value="nameAsc">Name (A–Z)</option>
            <option value="nameDesc">Name (Z–A)</option>
          </select>
        </div>
        <div id="propertyResults"></div>
      </div>
    </section>
  `);

  $('body').append($dashboard);

  $('#addPropertyBtn').on('click', () => {
    window.location.href = 'AddPropertyFormPage.html';
  });

  let allProperties = coworkingDB?.properties || [];
  let myProperties = allProperties.filter(p => p.ownerId === ownerId);

  const $results = $('#propertyResults');

  function renderProperties(list) {
    $results.empty();
    if (list.length === 0) {
      $results.html(`
        <p class="emptyMessage">
          You haven’t listed any properties yet.<br>
          Start by adding your first property to make your workspaces available for booking.
        </p>
      `);
    } else {
      list.forEach(p => {
        const $card = $(`
          <div class="propertyCard">
            <h4>
              <a id="property${p.propertyId}" href="PropertyDetails.html" class="propertyLink" data-id="${p.propertyId}">${p.name}</a>
            </h4>
            <div class="propertyBtn">
              <button id="edit${p.propertyId}" class="editBtn">Edit</button>
              <button id="delete${p.propertyId}" class="deleteBtn">Delete</button>
            </div>
          </div>
        `);
        $results.append($card);

        $card.find('.propertyLink').on('click', function () {
          const propertyId = $(this).data('id');
          localStorage.setItem('selectedPropertyId', propertyId);
        });

        $card.find('.editBtn').on('click', function () {
          const propertyId = $(this).attr('id').replace('edit', '');
          localStorage.setItem('selectedPropertyId', propertyId);
          window.location.href = './EditPropertyPage.html';
        });

        $card.find('.deleteBtn').on('click', function () {
          const propertyId = $(this).attr('id').replace('delete', '');
          if (confirm('Are you sure you want to delete this property?')) {
            coworkingDB.properties = coworkingDB.properties.filter(p => p.propertyId !== propertyId);
            localStorage.setItem('coworkingDB', JSON.stringify(coworkingDB));
            myProperties = coworkingDB.properties.filter(p => p.ownerId === ownerId);
            renderProperties(myProperties);
          }
        });
      });
    }
  }

  // Sorting functionality
  $('#sortProperties').on('change', function () {
    const sortType = $(this).val();
    let sortedList = [...myProperties];
    if (sortType === 'nameAsc') {
      sortedList.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortType === 'nameDesc') {
      sortedList.sort((a, b) => b.name.localeCompare(a.name));
    }
    renderProperties(sortedList);
  });

  // Initial render
  renderProperties(myProperties);
});