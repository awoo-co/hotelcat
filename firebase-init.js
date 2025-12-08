  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyAy9fapNsFA2AyZSZDwGmflfWBStEnrAOI",
    authDomain: "hotelcat-6258a.firebaseapp.com",
    projectId: "hotelcat-6258a",
    storageBucket: "hotelcat-6258a.firebasestorage.app",
    messagingSenderId: "921984582710",
    appId: "1:921984582710:web:782f4976c526f14a41c497",
    measurementId: "G-BLXENSWTFT"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
