
$(() => {
  $('#loginForm').on('submit', async (e) => {
    e.preventDefault();

    const email = $('#loginEmail').val().trim().toLowerCase();
    const password = $('#loginPassword').val();
    const url = "https://shared-workspace-web-app-j0iq.onrender.com";

    try {
      const response = await fetch(`${url}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      
      localStorage.setItem('token', data.token);

      
      const userType = data.userType?.toLowerCase();
      switch (userType) {
        case 'coworker':
          window.location.href = 'CoworkerDashboardPage.html';
          break;
        case 'owner':
          window.location.href = 'OwnerDashboardPage.html';
          break;
        default:
          alert(`⚠️ Unknown user type: ${data.userType}`);
      }

    } catch (error) {
      alert(error.message);
      console.error("Login error:", error);
    }
  });
});