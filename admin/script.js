// Google Sheets API endpoint
const sheetsApiUrl = "https://sheets.googleapis.com/v4/spreadsheets/1BD_EFnkifNUnJfVP53D085qNmKK92r3XvsFe_AKAEt0/values/Sheet1";
const apiKey = "AIzaSyBeALtL1M0zQ_sJFeC71pc9CgKcI9hfXyA"; // Replace with your actual API key

// Fetch and render requests
async function renderRequests() {
    try {
        const response = await fetch(`${sheetsApiUrl}?key=${apiKey}`);
        const data = await response.json();

        const requests = data.values || []; // Get rows from the sheet
        const requestsTable = document.getElementById("requestsTable");
        requestsTable.innerHTML = ""; // Clear existing rows

        requests.forEach((request, index) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${request[0]}</td> <!-- Guest Name -->
                <td>${request[1]}</td> <!-- Room Number -->
                <td>
                    <button class="approve-btn" onclick="approveRequest(${index})">Approve</button>
                    <button class="decline-btn" onclick="declineRequest(${index})">Decline</button>
                </td>
            `;

            requestsTable.appendChild(row);
        });
    } catch (error) {
        console.error("Failed to fetch requests:", error);
    }
}

// Approve a request
async function approveRequest(index) {
    alert("Approval functionality is not implemented yet. Please manage directly in the Google Sheet.");
}

// Decline a request
async function declineRequest(index) {
    alert("Decline functionality is not implemented yet. Please manage directly in the Google Sheet.");
}

// Fetch requests on page load
document.addEventListener("DOMContentLoaded", renderRequests);