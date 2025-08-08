$(() => {
  $('#loginForm').on('submit', function (e) {
    e.preventDefault();

    const email = $('#loginEmail').val().trim().toLowerCase();
    const password = $('#loginPassword').val();

    // Get coworkingDB object from localStorage
    const coworkingDB = JSON.parse(localStorage.getItem('coworkingDB')) || {};
    const users = coworkingDB.users || [];

    // Find matching user
    const user = users.find(u => 
      u.email.toLowerCase() === email && u.password === password
    );

    if (!user) {
      alert("⚠️ Invalid email or password.");
      return;
    }

    // Save current user
    localStorage.setItem('currentUser', JSON.stringify(user));

    // Redirect based on userType
    if (user.userType === 'Coworker') {
      window.location.href = 'CoworkerDashboardPage.html';
    } else if (user.userType === 'Owner') {
      window.location.href = 'OwnerDashboardPage.html';
    } else {
      alert("⚠️ Unknown user type.");
    }
  });
});