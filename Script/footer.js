$(() => {
    const year = new Date().getFullYear();
    const $footer = $(`
        <div id="footerContainer">
            <div id="logoContainer">
                <img class="logoWhite" src="./Images/logo Worksy white.png" alt="logo-white">
            </div>
            <footer id="footerText">
                &copy; ${year} Coworking Space. All rights reserved.
            </footer>
        </div>
        `)
    $(`body`).append($footer);
})
