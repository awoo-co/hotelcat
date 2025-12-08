// Import Firebase initialization
import './firebase-init.js';
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";

// Initialize Firebase Auth and Realtime Database
const auth = getAuth();
const database = getDatabase();

document.getElementById('signinForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!username || !password) {
        document.getElementById('signinResult').textContent = 'Please enter both username and password.';
        return;
    }

    try {
        // Sign in with Firebase Authentication
        const userCredential = await signInWithEmailAndPassword(auth, username, password);
        const user = userCredential.user;
        document.getElementById('signinResult').textContent = 'Sign-in successful! Your user ID is ' + user.uid;
        
        // Load guest requests from Realtime Database
        loadGuestRequests();
    } catch (err) {
        document.getElementById('signinResult').textContent = 'Sign-in failed: ' + err.message;
    }
});

// Load guest requests from Firebase Realtime Database
function loadGuestRequests() {
    const requestsRef = ref(database, 'guestRequests');
    onValue(requestsRef, (snapshot) => {
        const data = snapshot.val();
        const tableBody = document.getElementById('requestsTable');
        tableBody.innerHTML = '';
        
        if (data) {
            Object.entries(data).forEach(([key, request]) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${request.guestName || 'N/A'}</td>
                    <td>${request.roomNumber || 'N/A'}</td>
                    <td>${request.status || 'Pending'}</td>
                `;
                tableBody.appendChild(row);
            });
        }
    });
}