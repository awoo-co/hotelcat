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

const CLIENT_ID = '761085690030-pp072sgla7d3sf9tm2nreibrc5cnb1po.apps.googleusercontent.com'; // Replace with your OAuth 2.0 Client ID
const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';

let tokenClient;
let gapiInited = false;
let gisInited = false;

document.getElementById("checkInForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const guestName = document.getElementById("guestName").value;
    const roomNumber = document.getElementById("roomNumber").value;

    // Authenticate and append data
    if (!gapiInited || !gisInited) {
        alert("Google API is not initialized yet.");
        return;
    }

    tokenClient.callback = async (response) => {
        if (response.error) {
            console.error("OAuth Error:", response.error);
            return;
        }
        await appendData(guestName, roomNumber);
    };

    if (gapi.client.getToken() === null) {
        tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
        await appendData(guestName, roomNumber);
    }
});

function gapiLoaded() {
    gapi.load('client', initializeGapiClient);
}

async function initializeGapiClient() {
    await gapi.client.init({
        discoveryDocs: [DISCOVERY_DOC],
    });
    gapiInited = true;
}

function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: '', // Will be set dynamically
    });
    gisInited = true;
}

async function appendData(guestName, roomNumber) {
    const spreadsheetId = '1BD_EFnkifNUnJfVP53D085qNmKK92r3XvsFe_AKAEt0'; // Replace with your spreadsheet ID
    const range = 'Sheet1'; // Replace with your sheet name
    const requestData = {
        values: [[guestName, roomNumber, new Date().toLocaleString()]],
    };

    try {
        const response = await gapi.client.sheets.spreadsheets.values.append({
            spreadsheetId: spreadsheetId,
            range: range,
            valueInputOption: 'USER_ENTERED',
            resource: requestData,
        });
        console.log("Data appended:", response);
        document.getElementById("message").textContent = "Check-in request submitted successfully!";
        document.getElementById("message").style.color = "green";
        document.getElementById("checkInForm").reset();
    } catch (error) {
        console.error("Error appending data:", error);
        document.getElementById("message").textContent = "Failed to submit check-in request.";
        document.getElementById("message").style.color = "red";
    }
}

// Load the Google API and GIS libraries
const script1 = document.createElement("script");
script1.src = "https://apis.google.com/js/api.js";
script1.onload = gapiLoaded;
document.body.appendChild(script1);

const script2 = document.createElement("script");
script2.src = "https://accounts.google.com/gsi/client";
script2.onload = gisLoaded;
document.body.appendChild(script2);