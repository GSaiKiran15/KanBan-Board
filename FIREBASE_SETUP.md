# Firebase Environment Variables Setup for Render

## Problem

Your application is failing with: `Firebase: No Firebase App '[DEFAULT]' has been created`

This happens because Firebase environment variables are not configured on Render.

## Solution

### Step 1: Get Your Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click the gear icon ⚙️ > Project settings
4. Scroll down to "Your apps" section
5. Find your web app or create one if needed
6. Copy the configuration values

### Step 2: Set Environment Variables on Render

1. Go to your [Render Dashboard](https://dashboard.render.com/)
2. Select your **frontend** service (kanban-frontend)
3. Go to "Environment" tab
4. Add the following environment variables:

```
VITE_FIREBASE_API_KEY=your_actual_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_actual_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_actual_sender_id
VITE_FIREBASE_APP_ID=your_actual_app_id
```

**Important:** Replace `your_actual_*` with the real values from your Firebase console!

### Step 3: Redeploy

After adding the environment variables, Render will automatically redeploy your app. If not:

1. Go to your service
2. Click "Manual Deploy" > "Deploy latest commit"

### Step 4: Verify

1. Wait for deployment to complete
2. Open your app URL
3. Check browser console (F12) for any errors
4. You should no longer see the Firebase initialization error

## Local Development Setup

For local development, create a `.env` file in the `frontend` folder:

```bash
cd frontend
cp .env.example .env
```

Then edit `.env` with your Firebase configuration values.

**Note:** Never commit `.env` files to git - they're already in `.gitignore`

## Troubleshooting

### Still getting errors?

1. **Check variable names**: Render is case-sensitive. Ensure they match exactly:

   - `VITE_FIREBASE_API_KEY` (not `VITE_FIREBASE_APIKEY`)
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - etc.

2. **No quotes needed**: In Render's environment variables, don't wrap values in quotes

   - ✅ Correct: `AIzaSyC...`
   - ❌ Wrong: `"AIzaSyC..."`

3. **Restart required**: After adding variables, you must redeploy or restart the service

4. **Check build logs**: In Render, check the build logs for any errors during the build process

### Firebase Security Rules

Make sure your Firebase security rules allow your domain:

1. Go to Firebase Console > Authentication > Settings
2. Add your Render domain to authorized domains
3. Update Firestore/Database security rules as needed

## Additional Notes

- Environment variables in Vite **must** start with `VITE_` to be exposed to the client
- These are public values (visible in browser), so don't put secrets here
- Firebase API keys are safe to expose - they're meant to identify your project
