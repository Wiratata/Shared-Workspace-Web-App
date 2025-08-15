$(() => {
  
  const url = "https://shared-workspace-web-app-j0iq.onrender.com";

  function parseJwt(token) {
    if (!token) return null;
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  }

  const token = localStorage.getItem('token');
  if (!token) {
    alert("You must be logged in to view this page.");
    window.location.href = "LoginPage.html";
    return;
  }

  const $dashboard = $(`
    <section id="ownerDashboardSection">
      <div class="welcomeBox">
        <h2>Welcome to Your Dashboard</h2>
        <p>Manage your properties and workspaces in one place.</p>
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

  const $results = $('#propertyResults');
  let myProperties = [];

  function renderProperties(list) {
    $results.empty();
    if (list.length === 0) {
      $results.html(`
        <p class="emptyMessage">
          You haven’t listed any properties yet.<br>
          Start by adding your first property.
        </p>
      `);
    } else {
      list.forEach(p => {
        const $card = $(`
          <div class="propertyCard">
            <h4>
              <a href="PropertyDetails.html" class="propertyLink" data-id="${p._id}">${p.propertyName}</a>
            </h4>
            <div class="propertyBtn">
              <button class="editBtn" data-id="${p._id}">Edit</button>
              <button class="deleteBtn" data-id="${p._id}">Delete</button>
            </div>
          </div>
        `);
        $results.append($card);

        $card.find('.propertyLink').on('click', function() {
          localStorage.setItem('selectedPropertyId', $(this).data('id'));
        });

        $card.find('.editBtn').on('click', function() {
          localStorage.setItem('selectedPropertyId', $(this).data('id'));
          window.location.href = './EditPropertyPage.html';
        });

        $card.find('.deleteBtn').on('click', async function() {
          const propertyId = $(this).data('id');
          if (confirm('Are you sure you want to delete this property?')) {

            try {
              const res = await fetch(`${url}/properties/${propertyId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
              });

              if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to delete property');
              }

              alert('Property deleted successfully!');

            } catch (err) {
              alert('Error deleting property: ' + err.message);
            }
            myProperties = myProperties.filter(p => p._id !== propertyId);
            renderProperties(myProperties);
          }
        });
      });
    }
  }

  $('#sortProperties').on('change', function() {
    const sortType = $(this).val();
    let sortedList = [...myProperties];
    if (sortType === 'nameAsc') {
      sortedList.sort((a, b) => a.propertyName.localeCompare(b.propertyName));
    } else if (sortType === 'nameDesc') {
      sortedList.sort((a, b) => b.propertyName.localeCompare(a.propertyName));
    }
    renderProperties(sortedList);
  });

    


  fetch(`${url}/properties`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(res => {
      if (!res.ok) throw new Error('Failed to load properties');
      return res.json();
    })
    .then(data => {
      myProperties = data;
      renderProperties(myProperties);
    })
    .catch(err => {
      console.error(err);
      alert('Error loading properties');
    });
});