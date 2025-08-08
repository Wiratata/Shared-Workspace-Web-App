$(() => {
  const $form = $(`
    <div id="registerSection">
      <h2>Create Your Account</h2>
      <p>Join our community to start booking or listing shared workspaces.</p>
      <form id="registerForm">
        <label>First Name</label>
        <input type="text" id="firstName" placeholder="First Name" required />
        <label>Last Name</label>
        <input type="text" id="lastName" placeholder="Last Name" required />
        <label>Email Address</label>
        <input type="email" id="email" placeholder="Email Address" required />
        <label>Phone Number</label>
        <input type="tel" id="phone" placeholder="Phone Number" required />
        <label>Password</label>
        <input type="password" id="password" placeholder="Password" required />
        <label>Confirm Password</label>
        <input type="password" id="confirmPassword" placeholder="Confirm Password" required />
        <label>User Type</label>
        <select id="userType" required>
          <option value="Coworker">Coworker</option>
          <option value="Owner">Owner</option>
        </select>

        <button type="submit" id="registerBtn">Create Account</button>
      </form>
    </div>
  `);

  $('body').append($form);

  $(() => {
  const coworkingDB = JSON.parse(localStorage.getItem('coworkingDB'));

  if (coworkingDB && coworkingDB.users) {
    // Load users from coworkingDB only
    users = coworkingDB.users;
  } else {
    // If not found, load from JSON and store in localStorage
    fetch('Data/full_coworking_database.json')
      .then(res => res.json())
      .then(data => {
        users = data.users;
        localStorage.setItem('coworkingDB', JSON.stringify(data));
      })
      .catch(() => {
        users = [];
        alert("⚠️ Could not load user database.");
      });
  }


  $('#registerForm').on('submit', function (e) {
      e.preventDefault();

    const user = {
      firstName: $('#firstName').val().trim(),
      lastName: $('#lastName').val().trim(),
      email: $('#email').val().trim().toLowerCase(),
      phone: $('#phone').val().trim(),
      password: $('#password').val(),
      userType: $('#userType').val()
    };
    console.log(user);
    const confirmPassword = $('#confirmPassword').val();
    if (user.password !== confirmPassword) {
      alert("❌ Passwords do not match!");
      return;
    }

    // Get latest DB from localStorage
    let coworkingDB = JSON.parse(localStorage.getItem('coworkingDB')) || { users: [] };
    coworkingDB.users = coworkingDB.users || [];

    // Email check
    const emailExists = coworkingDB.users.some(u => u.email === user.email);
    if (emailExists) {
      alert("❌ Email already registered.");
      return;
    }

    // Generate unique ID
    user.id = coworkingDB.users.length
      ? Math.max(...coworkingDB.users.map(u => u.id)) + 1
      : 1001;

    // Add to coworkingDB
    coworkingDB.users.push(user);
    localStorage.setItem('coworkingDB', JSON.stringify(coworkingDB));

    alert("✅ Account created. Now you can log in.");
    window.location.href = 'LoginPage.html';
  });
});

  

});