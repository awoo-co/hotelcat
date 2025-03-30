// admin/script.js
const CLIENT_ID = '761085690030-pp072sgla7d3sf9tm2nreibrc5cnb1po.apps.googleusercontent.com'; // Replace with your OAuth 2.0 Client ID
const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';

let tokenClient;
let gapiInited = false;
let gisInited = false;
let lastData = []; // Store the last fetched data to detect changes
const inactivityTimers = {}; // Track inactivity timers for each row

function gapiLoaded() {
    console.log("Google API loaded");
    gapi.load('client', initializeGapiClient);
}

async function initializeGapiClient() {
    try {
        await gapi.client.init({
            discoveryDocs: [DISCOVERY_DOC],
        });
        gapiInited = true;
        console.log("Google API client initialized");
        maybeEnableLogin();
    } catch (error) {
        console.error("Error initializing Google API client:", error);
    }
}

function gisLoaded() {
    console.log("Google Identity Services loaded");
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: async (response) => {
            if (response.error) {
                console.error("OAuth Error:", response.error);
                return;
            }
            console.log("Access token received:", response.access_token);
            localStorage.setItem("access_token", response.access_token); // Save the token
            await fetchData();
            startPolling(); // Start polling for updates
        },
    });
    gisInited = true;
    maybeEnableLogin();
}

function maybeEnableLogin() {
    if (gapiInited && gisInited) {
        console.log("Google API and GIS initialized. Ready to log in.");
        const savedToken = localStorage.getItem("access_token");
        if (savedToken) {
            console.log("Using saved access token");
            gapi.client.setToken({ access_token: savedToken });
            fetchData();
            startPolling(); // Start polling for updates
        } else {
            console.log("No saved token, prompting user to log in");
            tokenClient.requestAccessToken({ prompt: 'consent' });
        }
    }
}

async function fetchData() {
    const spreadsheetId = '1BD_EFnkifNUnJfVP53D085qNmKK92r3XvsFe_AKAEt0'; // Replace with your spreadsheet ID
    const range = 'Sheet1'; // Replace with your sheet name

    try {
        const response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: spreadsheetId,
            range: range,
        });
        const requests = response.result.values || [];
        
        // Check if the data has changed
        if (JSON.stringify(requests) !== JSON.stringify(lastData)) {
            console.log("New data detected, refreshing table...");
            lastData = requests; // Update the last fetched data
            renderTable(requests);
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        if (error.status === 401) {
            console.log("Access token expired, prompting user to log in again");
            tokenClient.requestAccessToken({ prompt: '' });
        }
    }
}

function renderTable(requests) {
    const requestsTable = document.getElementById("requestsTable");
    requestsTable.innerHTML = ""; // Clear existing rows

    requests.forEach((request, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${request[0]}</td>
            <td>${request[1]}</td>
            <td>${request[2] || ''}</td>
            <td>
                <button class="approve-btn" onclick="approveRequest(${index})">Approve</button>
                <button class="decline-btn" onclick="declineRequest(${index})">Decline</button>
            </td>
        `;
        requestsTable.appendChild(row);

        // Start inactivity timer for the row
        if (inactivityTimers[index]) {
            clearTimeout(inactivityTimers[index]); // Clear any existing timer
        }
        inactivityTimers[index] = setTimeout(() => {
            deleteRow(index); // Delete the row after inactivity
        }, 30000); // 30 seconds of inactivity
    });
}

async function approveRequest(index) {
    await updateRowStatus(index, 'Approved');
    deleteRow(index); // Delete the row after approval
}

async function declineRequest(index) {
    await updateRowStatus(index, 'Declined');
    deleteRow(index); // Delete the row after decline
}

async function updateRowStatus(index, status) {
    const spreadsheetId = '1BD_EFnkifNUnJfVP53D085qNmKK92r3XvsFe_AKAEt0'; // Replace with your spreadsheet ID
    const range = `Sheet1!C${index + 2}`; // Assuming column C is for status, and index starts at 0

    try {
        console.log(`Updating range: ${range} with status: ${status}`);
        const response = await gapi.client.sheets.spreadsheets.values.update({
            spreadsheetId: spreadsheetId,
            range: range,
            valueInputOption: 'USER_ENTERED',
            resource: {
                values: [[status]], // Update the status
            },
        });
        console.log("API Response:", response);
    } catch (error) {
        console.error(`Error updating row status to ${status}:`, error);
    }
}

async function deleteRow(index) {
    const spreadsheetId = '1BD_EFnkifNUnJfVP53D085qNmKK92r3XvsFe_AKAEt0'; // Replace with your spreadsheet ID
    const requestsTable = document.getElementById("requestsTable");

    try {
        console.log(`Deleting row ${index + 2} from the sheet`);
        const response = await gapi.client.sheets.spreadsheets.batchUpdate({
            spreadsheetId: spreadsheetId,
            resource: {
                requests: [
                    {
                        deleteDimension: {
                            range: {
                                sheetId: 0, // Replace with your sheet ID (0 is usually the first sheet)
                                dimension: 'ROWS',
                                startIndex: index + 1, // Zero-based index
                                endIndex: index + 2, // Delete one row
                            },
                        },
                    },
                ],
            },
        });
        console.log("Row deleted:", response);

        // Remove the row from the table
        const row = requestsTable.querySelector(`tr:nth-child(${index + 1})`);
        if (row) {
            row.classList.add('fade-out');
            setTimeout(() => row.remove(), 1000); // Remove the row after the animation
        }
    } catch (error) {
        console.error("Error deleting row:", error);
    }
}

function startPolling() {
    setInterval(fetchData, 5000); // Poll every 5 seconds
}

document.getElementById("logout_button").addEventListener("click", () => {
    localStorage.removeItem("access_token"); // Clear the token
    gapi.client.setToken(null); // Reset the Google API client
    alert("You have been logged out.");
    location.reload(); // Reload the page
});

// Load the Google API and GIS libraries
const script1 = document.createElement("script");
script1.src = "https://apis.google.com/js/api.js";
script1.onload = gapiLoaded;
document.body.appendChild(script1);

const script2 = document.createElement("script");
script2.src = "https://accounts.google.com/gsi/client";
script2.onload = gisLoaded;
document.body.appendChild(script2);