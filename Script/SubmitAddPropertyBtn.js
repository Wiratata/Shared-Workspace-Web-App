import {url} from "./config.js";

$(() => {
    $('#addPropertyForm').on('submit', async function(e) {
        e.preventDefault();

        function parseJwt(token) {
        try {
            if (!token) return null;
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
            '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
            ).join(''));
            return JSON.parse(jsonPayload);
        } catch (e) {
            return null;
        }
        }
        
        const token = localStorage.getItem('token');
        if (!token) {
        alert("You must be logged in to add properties.");
        window.location.href = "LoginPage.html";
        return;
        }

        const currentUser = parseJwt(token);

        const property = {
        propertyName: $('#propertyName').val(),
        address: $('#address').val(),
        neighborhood: $('#neighborhood').val(),
        squareFootage: Number($('#squareFootage').val()),
        parkingGarage: $('input[name="parking"]:checked').val() === 'true',
        publicTransitAccess: $('input[name="transit"]:checked').val() === 'true',
        photoUrl: $('#photos')[0].files[0].name,
        additionalNotes: $('#notes').val()
        };

        try {
        const response = await fetch(`${url}/properties`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(property)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Adding Property Failed");
        }

        alert("Property saved!");
        window.location.href = './OwnerDashboardPage.html';

        } catch (error) {
        alert("❌ " + error.message);
        }
    });
});