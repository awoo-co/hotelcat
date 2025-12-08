document.getElementById('signinForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!username || !password) {
        document.getElementById('signinResult').textContent = 'Please enter both username and password.';
        return;
    }

    try {
        const res = await fetch('/api/signin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (data.success) {
            document.getElementById('signinResult').textContent = 'Sign-in successful! Your user ID is ' + data.userId;
        } else {
            document.getElementById('signinResult').textContent = 'Sign-in failed: ' + data.error;
        }
    } catch (err) {
        document.getElementById('signinResult').textContent = 'Network error. Please try again.';
    }
});