import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './App.css'
import App from './App.jsx'

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCOGMp9GoEUWoNpWI9CbrLH1YpRwkCGi4o",
  authDomain: "kanban-84021.firebaseapp.com",
  projectId: "kanban-84021",
  storageBucket: "kanban-84021.firebasestorage.app",
  messagingSenderId: "928939303009",
  appId: "1:928939303009:web:6622aa80735ecfb77e4a20",
  measurementId: "G-2NRK8X61R7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
