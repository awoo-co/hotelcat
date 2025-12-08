// Example: Fetch and display all users (requires backend API support)

async function fetchUsers() {
    try {
        const res = await fetch('/api/users');
        const users = await res.json();
        const adminContent = document.getElementById('adminContent');
        if (Array.isArray(users)) {
            adminContent.innerHTML = `
                <h2>Registered Users</h2>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Signed In At</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${users.map(u => `
                            <tr>
                                <td>${u.id}</td>
                                <td>${u.username}</td>
                                <td>${u.signed_in_at}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        } else {
            adminContent.textContent = 'No users found or error fetching users.';
        }
    } catch (err) {
        document.getElementById('adminContent').textContent = 'Error loading users.';
    }
}

// Call fetchUsers when the admin page loads
window.addEventListener('DOMContentLoaded', fetchUsers);