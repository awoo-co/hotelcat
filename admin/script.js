// Import Firebase initialization
import '../firebase-init.js';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { getDatabase, ref, onValue, set, remove, update } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";

// Initialize Firebase Auth and Realtime Database
const auth = getAuth();
const database = getDatabase();
let selectedUserId = null;

document.getElementById('signinForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!email || !password) {
        document.getElementById('signinResult').textContent = 'Please enter both email and password.';
        return;
    }

    try {
        // Sign in with Firebase Authentication
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        document.getElementById('signinResult').textContent = 'Admin sign-in successful!';
        document.getElementById('signinForm').style.display = 'none';
        document.getElementById('adminContent').style.display = 'block';
        
        // Load users and requests from Realtime Database
        loadUsers();
        loadRequests();
        setupEventListeners();
    } catch (err) {
        document.getElementById('signinResult').textContent = 'Admin sign-in failed: ' + err.message;
    }
});

// Setup event listeners for buttons
function setupEventListeners() {
    document.getElementById('addUserBtn').addEventListener('click', () => {
        document.getElementById('addUserModal').style.display = 'block';
    });
    
    document.getElementById('addRequestBtn').addEventListener('click', () => {
        document.getElementById('addRequestModal').style.display = 'block';
    });
    
    document.getElementById('deleteUserBtn').addEventListener('click', async () => {
        if (selectedUserId) {
            if (confirm('Are you sure you want to delete this user?')) {
                try {
                    await remove(ref(database, `users/${selectedUserId}`));
                    selectedUserId = null;
                    alert('User deleted successfully');
                } catch (err) {
                    alert('Error deleting user: ' + err.message);
                }
            }
        } else {
            alert('Please select a user first');
        }
    });
    
    document.getElementById('signOutBtn').addEventListener('click', async () => {
        try {
            await signOut(auth);
            document.getElementById('signinForm').style.display = 'block';
            document.getElementById('adminContent').style.display = 'none';
            document.getElementById('signinResult').textContent = '';
            document.getElementById('username').value = '';
            document.getElementById('password').value = '';
        } catch (err) {
            alert('Error signing out: ' + err.message);
        }
    });
    
    // Add User Form
    document.getElementById('addUserForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('newUserEmail').value.trim();
        const password = document.getElementById('newUserPassword').value.trim();
        const status = document.getElementById('newUserStatus').value.trim();
        
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const uid = userCredential.user.uid;
            await set(ref(database, `users/${uid}`), {
                email: email,
                status: status,
                createdAt: new Date().toISOString()
            });
            alert('User added successfully');
            document.getElementById('addUserModal').style.display = 'none';
            document.getElementById('addUserForm').reset();
        } catch (err) {
            alert('Error adding user: ' + err.message);
        }
    });
    
    // Add Request Form
    document.getElementById('addRequestForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const guestName = document.getElementById('newGuestName').value.trim();
        const roomNumber = document.getElementById('newRoomNumber').value.trim();
        const requestStatus = document.getElementById('newRequestStatus').value.trim();
        
        try {
            const newRequestRef = ref(database, 'guestRequests');
            const newKey = Math.random().toString(36).substr(2, 9);
            await set(ref(database, `guestRequests/${newKey}`), {
                guestName: guestName,
                roomNumber: roomNumber,
                status: requestStatus,
                createdAt: new Date().toISOString()
            });
            alert('Request added successfully');
            document.getElementById('addRequestModal').style.display = 'none';
            document.getElementById('addRequestForm').reset();
        } catch (err) {
            alert('Error adding request: ' + err.message);
        }
    });
    
    // Modal close buttons
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', (e) => {
            e.target.closest('.modal').style.display = 'none';
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
    
    // Select all users checkbox
    document.getElementById('selectAllUsers').addEventListener('change', (e) => {
        document.querySelectorAll('input[name="userCheckbox"]').forEach(checkbox => {
            checkbox.checked = e.target.checked;
        });
    });
}

// Load users from Firebase Realtime Database
function loadUsers() {
    const usersRef = ref(database, 'users');
    onValue(usersRef, (snapshot) => {
        const data = snapshot.val();
        const tableBody = document.getElementById('usersTable');
        tableBody.innerHTML = '';
        
        if (data) {
            Object.entries(data).forEach(([uid, user]) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><input type="checkbox" name="userCheckbox" data-uid="${uid}" class="user-checkbox"></td>
                    <td>${uid}</td>
                    <td>${user.email || 'N/A'}</td>
                    <td>${user.status || 'Active'}</td>
                `;
                row.style.cursor = 'pointer';
                row.addEventListener('click', () => {
                    selectedUserId = uid;
                    document.querySelectorAll('#usersTable tr').forEach(r => r.style.backgroundColor = '');
                    row.style.backgroundColor = '#e3f2fd';
                });
                tableBody.appendChild(row);
            });
        } else {
            tableBody.innerHTML = '<tr><td colspan="4">No users found.</td></tr>';
        }
    });
}

// Load guest requests from Firebase Realtime Database
function loadRequests() {
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
                    <td>
                        <button class="btn-small" onclick="deleteRequest('${key}')">Delete</button>
                        <button class="btn-small" onclick="updateRequestStatus('${key}')">Update Status</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        } else {
            tableBody.innerHTML = '<tr><td colspan="4">No requests found.</td></tr>';
        }
    });
}

// Delete request
window.deleteRequest = async function(key) {
    if (confirm('Delete this request?')) {
        try {
            await remove(ref(database, `guestRequests/${key}`));
            alert('Request deleted successfully');
        } catch (err) {
            alert('Error deleting request: ' + err.message);
        }
    }
}

// Update request status
window.updateRequestStatus = async function(key) {
    const newStatus = prompt('Enter new status:');
    if (newStatus) {
        try {
            await update(ref(database, `guestRequests/${key}`), { status: newStatus });
            alert('Request status updated successfully');
        } catch (err) {
            alert('Error updating status: ' + err.message);
        }
    }
}