// Import Firebase initialization
import './firebase-init.js';
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

// Initialize Firebase Auth
const auth = getAuth();

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
    } catch (err) {
        document.getElementById('signinResult').textContent = 'Sign-in failed: ' + err.message;
    }
});