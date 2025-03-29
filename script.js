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

// URL of the hosted JSON file
const requestsUrl = "/requests.json";

// Handle form submission
document.getElementById("checkInForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const guestName = document.getElementById("guestName").value;
    const roomNumber = document.getElementById("roomNumber").value;

    // Fetch the current requests
    const response = await fetch(requestsUrl);
    const requests = await response.json();

    // Add the new request
    requests.push({ guestName, roomNumber });

    // Send the updated requests back to the server
    await fetch(requestsUrl, {
        method: "PUT", // Netlify doesn't support PUT directly; see limitations below
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(requests),
    });

    // Show success message
    const message = document.getElementById("message");
    message.textContent = "Check-in request submitted successfully!";
    message.style.color = "green";

    // Clear the form
    document.getElementById("checkInForm").reset();
});