$(() => {
    const $navBar = $(`
        <div id="navBarContainer">
            <div id="logoContainer">
                <img class="logoWhite" src="./Images/logo Worksy white.png" alt="logo-white">
            </div>
            <div id="brandNameContainer">
                <h1>Coworking Space</h1>
            </div>
            <ul id="nav">
                <li><a href="./LandingPage.html">Home</a></li>
                <li><a href="./LoginPage.html">Login</a></li>
            </ul>
        </div>
        `)
    $(`body`).append($navBar);
})
