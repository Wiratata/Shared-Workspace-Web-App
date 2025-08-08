$(() => {
const $coworkerDashboardPageContent = $(`     
        
        <div id="recomendationContainer">
            <img id="bgPicture" src="Images/coworking background.jpg" alt="backgroundCoworking">
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
        `)
    $(`body`).append($coworkerDashboardPageContent);
})