// URL of the hosted JSON file
const requestsUrl = "/requests.json";

// Fetch and render requests
async function renderRequests() {
    const response = await fetch(requestsUrl);
    const requests = await response.json();

    const requestsTable = document.getElementById("requestsTable");
    requestsTable.innerHTML = ""; // Clear existing rows

    requests.forEach((request, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${request.guestName}</td>
            <td>${request.roomNumber}</td>
            <td>
                <button class="approve-btn" onclick="approveRequest(${index})">Approve</button>
                <button class="decline-btn" onclick="declineRequest(${index})">Decline</button>
            </td>
        `;

        requestsTable.appendChild(row);
    });
}

// Approve a request
async function approveRequest(index) {
    const response = await fetch(requestsUrl);
    const requests = await response.json();

    // Remove the approved request
    requests.splice(index, 1);

    // Send the updated requests back to the server
    await fetch(requestsUrl, {
        method: "PUT", // Netlify doesn't support PUT directly; see limitations below
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(requests),
    });

    alert("Request approved.");
    renderRequests();
}

// Decline a request
async function declineRequest(index) {
    const response = await fetch(requestsUrl);
    const requests = await response.json();

    // Remove the declined request
    requests.splice(index, 1);

    // Send the updated requests back to the server
    await fetch(requestsUrl, {
        method: "PUT", // Netlify doesn't support PUT directly; see limitations below
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(requests),
    });

    alert("Request declined.");
    renderRequests();
}

// Fetch requests on page load
document.addEventListener("DOMContentLoaded", renderRequests);