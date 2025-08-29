const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const db = new sqlite3.Database('./hotel.db');

// Middleware to parse JSON
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Create users table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    signed_in_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

// API endpoint for sign-in
app.post('/api/signin', (req, res) => {
    const { username, password } = req.body;
    db.run(
        `INSERT INTO users (username, password) VALUES (?, ?)`,
        [username, password],
        function (err) {
            if (err) {
                return res.status(400).json({ error: 'User already exists or error occurred.' });
            }
            res.json({ success: true, userId: this.lastID });
        }
    );
});

// API endpoint to get all users (for admin panel)
app.get('/api/users', (req, res) => {
    db.all(`SELECT id, username, signed_in_at FROM users ORDER BY id DESC`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Database error.' });
        }
        res.json(rows);
    });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});