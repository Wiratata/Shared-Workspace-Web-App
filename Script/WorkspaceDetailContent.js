$(document).ready(function () {
  const detail = JSON.parse(localStorage.getItem('selectedWorkspaceDetail'));

  if (!detail) {
    $('body').append('<p>No workspace selected.</p>');
    return;
  }

  const { workspace, property, owner } = detail;

  const $content = $(`
    <section id="workspaceDetailSection">
      <h2>${workspace.name}</h2>
      <p><strong>Location:</strong> ${property.address}</p>
      <p><strong>Seats:</strong> ${workspace.capacity}</p>
      <p><strong>Smoking:</strong> ${workspace.smoking}</p>
      <p><strong>Parking:</strong> ${property.parking}</p>
      <p><strong>Transit:</strong> ${property.transit}</p>
      <p><strong>Lease Term:</strong> ${workspace.leaseTerm}</p>
      <p><strong>Price:</strong> $${workspace.price}</p>
      <hr>
      <h3>Contact Owner</h3>
      <p><strong>Name:</strong> ${owner.name}</p>
      <p><strong>Phone:</strong> ${owner.phone}</p>
    </section>
  `);

  $('body').append($content);
});
