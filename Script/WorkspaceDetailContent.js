$(document).ready(async function () {
  const propertyId = localStorage.getItem('selectedPropertyId');
  const workspaceId = localStorage.getItem('selectedWorkspaceId');
  const token = localStorage.getItem('authToken');

  const url = "http://localhost:3000";

  if (!propertyId || !workspaceId) {
    $('body').append('<p>No workspace selected.</p>');
    return;
  }

  let $workspaceContainer = $('#workspaceContainer');
  if (!$workspaceContainer.length) {
    $workspaceContainer = $('<div id="workspaceContainer"></div>');
    $('body').append($workspaceContainer);
  }

  async function fetchWorkspaceDetail() {
    try {
      const res = await fetch(`${url}/properties/${propertyId}/workspaces/${workspaceId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to load workspace detail');
      return await res.json();
    } catch (error) {
      console.error(error);
      alert('Error loading workspace detail.');
    }
  }

  const detail = await fetchWorkspaceDetail();
  if (!detail) return;

  const { workspace, property, user } = detail;

  const $content = $(`
    <section id="workspaceDetailSection">
      <h2>${workspace.workspaceName}</h2>
      <p><strong>Location:</strong> ${property.address}</p>
      <p><strong>Seats:</strong> ${workspace.capacity}</p>
      <p><strong>Smoking:</strong> ${workspace.smokingAllowed ? 'Yes' : 'No'}</p>
      <p><strong>Parking:</strong> ${property.parkingGarage ? 'Yes' : 'No'}</p>
      <p><strong>Transit:</strong> ${property.publicTransitAccess ? 'Yes' : 'No'}</p>
      <p><strong>Lease Term:</strong> ${workspace.leaseTerm}</p>
      <p><strong>Price:</strong> $${workspace.price}</p>
      <hr>
      <h3>Contact Owner</h3>
      <p><strong>Name:</strong> ${user?.firstName + ' ' + user?.lastName || 'N/A'}</p>
      <p><strong>Phone:</strong> ${user?.phoneNumber || 'N/A'}</p>
    </section>
  `);

  $workspaceContainer.append($content);
});
