# Firebase Deployment Fix - Render Configuration

## Problem Fixed

The "No Firebase App '[DEFAULT]' has been created" error occurred because Firebase was not properly initialized before being used across the application.

## Changes Made

### 1. Created Centralized Firebase Configuration

Created [firebase/config.js](frontend/src/firebase/config.js) that:

- Initializes Firebase once using `getApps()` to prevent duplicate initialization
- Exports a single `auth` instance to be used throughout the app
- Validates environment variables at startup
- Safely initializes Analytics only in browser environment

### 2. Updated All Firebase Imports

Updated the following files to use the centralized `auth` instance:

- [main.jsx](frontend/src/main.jsx) - Now imports config to initialize Firebase before app starts
- [useUser.js](frontend/src/useUser.js)
- [waitForAuth.js](frontend/src/utils/waitForAuth.js)
- [Login.jsx](frontend/src/pages/Login.jsx)
- [CreateAccount.jsx](frontend/src/pages/CreateAccount.jsx)
- [NavBar.jsx](frontend/src/components/NavBar/NavBar.jsx)

All files now import `{ auth }` from the config file instead of calling `getAuth()` directly.

## Required Render Configuration

### Environment Variables

In your Render dashboard, go to your Static Site settings → **Environment** tab and add these variables:

```
VITE_FIREBASE_API_KEY=<your-firebase-api-key>
VITE_FIREBASE_AUTH_DOMAIN=<your-project-id>.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=<your-project-id>
VITE_FIREBASE_STORAGE_BUCKET=<your-project-id>.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=<your-messaging-sender-id>
VITE_FIREBASE_APP_ID=<your-firebase-app-id>
```

**Important**:

- All variable names MUST start with `VITE_` prefix for Vite to include them in the build
- These variables must be set BEFORE you trigger a new deployment
- The values can be found in your Firebase Console → Project Settings → General tab

### Build Configuration

Ensure your Render Static Site has:

- **Build Command**: `cd frontend && npm install && npm run build`
- **Publish Directory**: `frontend/dist`

### Deploy

After adding the environment variables:

1. Click "Manual Deploy" → "Clear build cache & deploy" in Render
2. Wait for the build to complete
3. Test your deployed site

## Testing the Fix Locally

1. Copy `.env.example` to `.env` in the frontend directory:

   ```bash
   cd frontend
   cp .env.example .env
   ```

2. Fill in your Firebase values in `.env`

3. Run the dev server:

   ```bash
   npm run dev
   ```

4. Verify no Firebase initialization errors in browser console

## How This Fix Works

**Before**: Each file called `getAuth()` without an app instance, causing Firebase to look for a default app that might not be initialized yet.

**After**:

1. Firebase app is initialized once in `firebase/config.js` using `getApps()` guard
2. A single `auth` instance is created and exported
3. All other files import and use this pre-configured `auth` instance
4. The config is imported in `main.jsx` before React renders, ensuring Firebase is ready

This prevents race conditions and ensures Firebase is always properly initialized before any component tries to use it.

## Troubleshooting

If you still see errors after deploying:

1. **Check Render Logs**: Look for "Firebase initialization failed" messages
2. **Verify Environment Variables**: Ensure all `VITE_FIREBASE_*` variables are set in Render
3. **Clear Build Cache**: Use "Clear build cache & deploy" option in Render
4. **Check Browser Console**: Look for any remaining Firebase initialization errors
5. **Verify Firebase Config**: Ensure your Firebase project allows your Render domain in Firebase Console → Authentication → Settings → Authorized domains

## Additional Notes

- The fix uses `getApps()` to check if Firebase is already initialized, preventing duplicate initialization errors during hot reloads
- Analytics is wrapped in a try-catch and window check to prevent SSR/build-time errors
- All environment variables are validated at startup, failing fast if any required values are missing
