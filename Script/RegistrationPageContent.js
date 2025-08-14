

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
  $('#registerForm').on('submit', async function (e) {
    e.preventDefault();

    const url = "http://localhost:3000";

    const user = {
      firstName: $('#firstName').val().trim(),
      lastName: $('#lastName').val().trim(),
      email: $('#email').val().trim().toLowerCase(),
      phoneNumber: $('#phone').val().trim(),
      password: $('#password').val(),
      confirmPassword: $('#confirmPassword').val(),
      userType: $('#userType').val()
    };

    const confirmPassword = $('#confirmPassword').val();
    if (user.password !== confirmPassword) {
      alert("❌ Passwords do not match!");
      return;
    }

    try {
      const response = await fetch(`${url}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(user)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      alert("✅ Account created. Now you can log in.");
      window.location.href = 'LoginPage.html';
    } catch (error) {
      alert("❌ " + error.message);
    }
  });
});

});