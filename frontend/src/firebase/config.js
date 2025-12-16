import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Validate Firebase configuration
const requiredConfigKeys = ["apiKey", "authDomain", "projectId", "appId"];
const missingKeys = requiredConfigKeys.filter((key) => !firebaseConfig[key]);

if (missingKeys.length > 0) {
  console.error(
    "Firebase initialization failed. Missing environment variables:"
  );
  missingKeys.forEach((key) => {
    const envVar = `VITE_FIREBASE_${key
      .replace(/([A-Z])/g, "_$1")
      .toUpperCase()}`;
    console.error(`- ${envVar}`);
  });
  throw new Error(
    "Firebase configuration is incomplete. Please set the required environment variables on your deployment platform."
  );
}

// Initialize Firebase - use getApps() to prevent multiple initializations
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);

// Initialize Analytics only in browser environment
let analytics = null;
if (typeof window !== "undefined") {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.warn("Analytics could not be initialized:", error);
  }
}

export { app, analytics };
