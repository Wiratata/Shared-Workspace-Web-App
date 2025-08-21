$(() => {
    const $landingPageContent = $(`
        <div id="ctaContainer">
            <div id="ctaContent">
                <h2>Ready to work smarter and earn more?</h2>
                <p>Join our community of coworkers and space providers.</p>
                <div id="ctaBtn">
                    <button id="registerBtn">Register</button>
                    <button id="loginBtn">Login</button>
                </div>
            </div>
            <div>
                    <img id="ctaImage" src="Images/first cover.webp" alt="coworking-space">
            </div>
        </div>

        <div id="recomendationContainer">
            <video id="bgPicture" autoplay muted playsinline>
                <source src="Images/Loop Video.mp4" type="video/mp4">
            </video>

            <div id="blackShape"></div>
            <div id="recomendationContent">
                <h2 id="recomendationTitle">Find Your Perfect Workspace, Anytime, Anywhere</h2>
                <div id="cardContainer">
                    <div class="propertyCard">
                        <img class="propertyImage">
                        <h2>Property 1</h2>
                        <p>short description from the property</p>
                    </div>
                    <div class="propertyCard">
                        <img class="propertyImage">
                        <h2>Property 2</h2>
                        <p>short description from the property</p>
                    </div>
                    <div class="propertyCard">
                        <img class="propertyImage">
                        <h2>Property 3</h2>
                        <p>short description from the property</p>
                    </div>
                </div>
            </div>
        </div>

        <div id="whyContainer">
            <div id="whyImageContainer">
                <img id="whyImage" src="Images/why picture.jpg" alt="coworking-space">
            </div>
            <div id="whyText">
                <h2>Why Choose Us</h2>
                <p>Whether you're looking to share your space or find the perfect place to work, we've got you covered. Our platform makes it easy to list, discover, and book workspaces that fit your needs. With a user-friendly experience, flexible options, and a growing community of professionals, we’re here to make coworking simple, smart, and seamless.</p>
            </div>

        </div>
        `)
    $(`body`).append($landingPageContent);

    const videoElement = document.getElementById("bgPicture");

    function loopVideo() {
        if (videoElement.currentTime >= videoElement.duration - 0.05) {
            videoElement.currentTime = 0;
            videoElement.play();
        }
        requestAnimationFrame(loopVideo);
    }

    // Start looping
    videoElement.play();
    requestAnimationFrame(loopVideo);
})