# Hotel Kiosk Check-In

## Overview
The **Hotel Kiosk Check-In** project is a web-based application designed to simulate the check-in process for a hotel. It provides an interactive and user-friendly interface where guests can enter their details to complete a check-in. This project is intended as a fun, educational game and not an actual hotel management system.

## Features
- **Guest Check-In Form**: Guests can enter their name to check in, and a random room number is assigned automatically.
- **Admin Panel**: Admins can view and manage check-in requests in real time.
- **Dark Mode Theme**: A visually appealing dark mode design for better user experience.
- **Real-Time Updates**: The admin panel automatically refreshes to display new check-in requests.
- **Interactive Feedback**: Users receive confirmation messages upon successful check-in.
- **PWA Support**: The application is installable as a Progressive Web App (PWA) for a native-like experience.

## Project Structure
- **`index.html`**: The main page for the kiosk where guests can check in.
- **`script.js`**: Handles form submission, random room number assignment, and interaction with the Google Sheets API.
- **`admin/index.html`**: Admin panel for managing check-in requests.
- **`admin/script.js`**: Handles admin functionalities like viewing and managing requests.
- **`manifest.json`**: Defines metadata for PWA support.
- **`service-worker.js`**: Registers a basic service worker for PWA installation (no offline support).
- **`style.css`**: Stylesheet for the application, including dark mode styling.

## How to Use
### Guest Check-In
1. Open the main page (`index.html`) in your browser.
2. Enter your name in the "Enter your name" field.
3. Click the "Check In" button to submit the form.
4. A confirmation message will display your assigned room number.

### Admin Panel
1. Open the admin panel (`admin/index.html`) in your browser.
2. View the list of check-in requests in real time.
3. Manage requests as needed.

## Notes
- This is a game and not an actual hotel management system.
- The project uses the Google Sheets API for data storage and retrieval.
- The application includes PWA support but does not provide offline functionality.

## Credits
This project was created with the help of **GitHub Copilot**.