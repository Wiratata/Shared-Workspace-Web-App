$(() => {
    function parseJwt(token) {
        try {
            return JSON.parse(atob(token.split('.')[1]));
        } catch (e) {
            return null;
        }
    }

    function renderNavBar() {
        const token = localStorage.getItem('token');
        const currentUser = token ? parseJwt(token) : null;

        const $navBar = $(`
            <div id="navBarContainer">
                <div id="logoContainer">
                    <img class="logoWhite" src="./Images/logo Worksy white.png" alt="logo-white">
                </div>
                <div id="brandNameContainer">
                    <h1>Coworking Space</h1>
                </div>
                <ul id="nav">
                    ${
                        currentUser
                            ? `
                                <li><a href="#" id="dashboardLink">Dashboard</a></li> 
                                <li><a href="#" id="logoutBtn">LogOut</a></li>
                              `
                            : `
                                <li><a href="./LandingPage.html">Home</a></li>
                                <li><a href="./LoginPage.html">Login</a></li>
                              `
                    }
                </ul>
            </div>
        `);

        $('#navBarContainer').remove();
        $('body').prepend($navBar);

        $('#dashboardLink').on('click', () => {
            if (!currentUser) return;
            if (currentUser.userType === 'Owner') {
                window.location.href = './OwnerDashboardPage.html';
            } else {
                window.location.href = './CoworkerDashboardPage.html';
            }
        });

        $('#logoutBtn').on('click', () => {
            localStorage.removeItem('token');
            renderNavBar();
            window.location.href = './LandingPage.html';
        });
    }

    renderNavBar();
});