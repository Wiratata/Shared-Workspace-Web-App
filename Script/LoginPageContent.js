$(() => {
    const $loginForm = $(`
        <div id="loginContainer">
            <section id="loginSection">
                <h2>Welcome Back</h2>
                <p>Log in to book workspaces, manage listings, and stay productive.</p>
                <form id="loginForm">
                <input type="email" id="loginEmail" placeholder="Email Address" required />
                <input type="password" id="loginPassword" placeholder="Password" required />
                <p>Don't have an account yet? <a href="RegistrationPage.html">Register now</a></p>
                <button type="submit" id="loginBtn">Login</button>
                </form>
            </section>
            <div id="imgContainer">
                <img src="Images/LoginPicture.jpg" alt="coworkingPic" id="loginImage">
            </div>
        </div>
    `);
    $('body').append($loginForm);
});