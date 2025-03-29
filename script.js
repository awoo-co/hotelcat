// Utility function to set a cookie
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${encodeURIComponent(value)};expires=${date.toUTCString()};path=/`;
}

// Utility function to get a cookie
function getCookie(name) {
    const cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
        const [key, value] = cookie.split("=");
        if (key === name) {
            return decodeURIComponent(value);
        }
    }
    return null;
}

// Google Sheets API endpoint
const sheetsApiUrl = "https://sheets.googleapis.com/v4/spreadsheets/1BD_EFnkifNUnJfVP53D085qNmKK92r3XvsFe_AKAEt0/values/Sheet1:append?valueInputOption=USER_ENTERED";
const apiKey = "AIzaSyBeALtL1M0zQ_sJFeC71pc9CgKcI9hfXyA"; // Replace with your actual API key

// Handle form submission
document.getElementById("checkInForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const guestName = document.getElementById("guestName").value;
    const roomNumber = document.getElementById("roomNumber").value;

    // Prepare the data to append to the Google Sheet
    const requestData = {
        values: [[guestName, roomNumber, new Date().toLocaleString()]], // Add timestamp
    };

    try {
        // Append the data to the Google Sheet
        const response = await fetch(`${sheetsApiUrl}&key=${apiKey}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
        });

        if (!response.ok) {
            throw new Error("Failed to submit the check-in request.");
        }

        // Show success message
        const message = document.getElementById("message");
        message.textContent = "Check-in request submitted successfully!";
        message.style.color = "green";

        // Clear the form
        document.getElementById("checkInForm").reset();
    } catch (error) {
        // Show error message
        const message = document.getElementById("message");
        message.textContent = `Error: ${error.message}`;
        message.style.color = "red";
    }
});