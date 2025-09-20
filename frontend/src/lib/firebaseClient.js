// src/lib/firebaseClient.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// ⬇️ Replace with your real config values
const firebaseConfig = {
  apiKey: "AIzaSyCOGMp9GoEUWoNpWI9CbrLH1YpRwkCGi4o",
  authDomain: "kanban-84021.firebaseapp.com",
  projectId: "kanban-84021",
  storageBucket: "kanban-84021.firebasestorage.app",
  messagingSenderId: "928939303009",
  appId: "1:928939303009:web:6622aa80735ecfb77e4a20",
  measurementId: "G-2NRK8X61R7"
};

// Create or reuse the default app, so we never call getAuth() before init
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app); // <-- export ONE shared Auth instance
