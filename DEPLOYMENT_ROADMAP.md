# KanBan App - Production Deployment Roadmap

## ✅ Phase 1: Pre-Deployment Preparation

### 1.1 Code Cleanup

- [ ] Remove console.log statements from production code
- [ ] Remove test data and comments
- [ ] Verify .gitignore includes `.env`, `credentials.json`, `node_modules`
- [ ] Review error messages (remove informal "Bro..." messages for production)

### 1.2 Environment Variables Audit

- [ ] List all required backend env vars:
  - `DB_USER`
  - `DB_HOST`
  - `DB_DATABASE`
  - `DB_PASSWORD`
  - `DB_PORT`
- [ ] List all required frontend env vars:
  - `VITE_FIREBASE_API_KEY`
  - `VITE_FIREBASE_AUTH_DOMAIN`
  - `VITE_FIREBASE_PROJECT_ID`
  - `VITE_FIREBASE_STORAGE_BUCKET`
  - `VITE_FIREBASE_MESSAGING_SENDER_ID`
  - `VITE_FIREBASE_APP_ID`
- [ ] Document Firebase service account (`credentials.json`) requirement

### 1.3 Database Schema Preparation

- [ ] Export current database schema (tables, columns, constraints)
- [ ] Create migration scripts or SQL dump for production DB setup
- [ ] Document required tables:
  - `users` (id, email, display_name)
  - `projects` (id, title, owner_id)
  - `boards` (id, title, project_id)
  - `elements` (id, title, subtitle, board_id, position)

### 1.4 Build Configuration

- [ ] Test backend build: `cd backend && npm install`
- [ ] Test frontend build: `cd frontend && npm run build`
- [ ] Verify dist/ folder is created in frontend
- [ ] Check for build errors

---

## ✅ Phase 2: Platform Setup (Render)

### 2.1 Create Render Account

- [ ] Sign up at https://render.com
- [ ] Connect GitHub account
- [ ] Verify email

### 2.2 Push Code to GitHub

- [ ] Create new GitHub repository
- [ ] Initialize git: `git init`
- [ ] Add remote: `git remote add origin <your-repo-url>`
- [ ] Commit all code: `git add . && git commit -m "Initial commit"`
- [ ] Push: `git push -u origin main`
- [ ] Verify `.env` and `credentials.json` are NOT pushed

---

## ✅ Phase 3: Database Deployment

### 3.1 Create PostgreSQL Database on Render

- [ ] Dashboard → New → PostgreSQL
- [ ] Name: `kanban-db`
- [ ] Select free tier
- [ ] Region: Choose closest to your users
- [ ] Create database
- [ ] Save connection details (Internal Database URL)

### 3.2 Initialize Database Schema

- [ ] Connect to database using provided connection string
- [ ] Run schema creation SQL:

  ```sql
  CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    display_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) UNIQUE NOT NULL,
    owner_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE boards (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE elements (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    board_id INTEGER REFERENCES boards(id) ON DELETE CASCADE,
    position INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  ```

- [ ] Verify tables created: `\dt` or query tool

---

## ✅ Phase 4: Backend Deployment

### 4.1 Prepare Backend for Render

- [ ] Add `start` script to `backend/package.json`:
  ```json
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js"
  }
  ```
- [ ] Set PORT dynamically in server.js (Render assigns random port):
  ```javascript
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  ```

### 4.2 Create Backend Web Service on Render

- [ ] Dashboard → New → Web Service
- [ ] Connect GitHub repo
- [ ] Configure:
  - **Name**: `kanban-backend`
  - **Root Directory**: `backend`
  - **Environment**: `Node`
  - **Build Command**: `npm install`
  - **Start Command**: `npm start`
  - **Plan**: Free
- [ ] Add environment variables:
  - `DB_USER` → From PostgreSQL connection info
  - `DB_HOST` → From PostgreSQL connection info
  - `DB_DATABASE` → From PostgreSQL connection info
  - `DB_PASSWORD` → From PostgreSQL connection info
  - `DB_PORT` → From PostgreSQL connection info (usually 5432)
  - `NODE_ENV` → `production`

### 4.3 Upload Firebase Service Account

- [ ] Option A: Use Render Secret Files:
  - Dashboard → Environment → Secret Files
  - Add `credentials.json` content
  - Path: `./credentials.json`
- [ ] Option B: Convert to environment variable:
  - Add `FIREBASE_SERVICE_ACCOUNT` env var
  - Paste entire `credentials.json` as string
  - Update server.js:
    ```javascript
    const credentials = process.env.FIREBASE_SERVICE_ACCOUNT
      ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
      : JSON.parse(fs.readFileSync("./credentials.json"));
    ```

### 4.4 Deploy Backend

- [ ] Click "Create Web Service"
- [ ] Wait for deployment (~2-5 mins)
- [ ] Check logs for errors
- [ ] Verify service is live: `<your-backend-url>/api/projects` (should return 401)
- [ ] Save backend URL: `https://kanban-backend-xxxx.onrender.com`

---

## ✅ Phase 5: Frontend Deployment

### 5.1 Update Frontend Configuration

- [ ] Update `vite.config.js` for production:
  ```javascript
  export default defineConfig({
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        "/api": process.env.VITE_API_URL || "http://localhost:8000",
      },
    },
  });
  ```
- [ ] Create production `.env` (don't commit):
  ```
  VITE_API_URL=https://kanban-backend-xxxx.onrender.com
  VITE_FIREBASE_API_KEY=...
  VITE_FIREBASE_AUTH_DOMAIN=...
  VITE_FIREBASE_PROJECT_ID=...
  VITE_FIREBASE_STORAGE_BUCKET=...
  VITE_FIREBASE_MESSAGING_SENDER_ID=...
  VITE_FIREBASE_APP_ID=...
  ```

### 5.2 Update API Calls for Production

- [ ] In `App.jsx`, update axios base URL:
  ```javascript
  const API_URL = import.meta.env.VITE_API_URL || "";
  const response = await axios.get(`${API_URL}/api/projects`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  ```
- [ ] Apply to all axios calls in:
  - `App.jsx` (2 loaders)
  - `Board.jsx` (2 calls)
  - `Card.jsx` (3 calls)
  - `Column.jsx` (1 call)

### 5.3 Create Frontend Static Site on Render

- [ ] Dashboard → New → Static Site
- [ ] Connect GitHub repo
- [ ] Configure:
  - **Name**: `kanban-frontend`
  - **Root Directory**: `frontend`
  - **Build Command**: `npm install && npm run build`
  - **Publish Directory**: `dist`
  - **Plan**: Free
- [ ] Add environment variables (same as local .env)

### 5.4 Deploy Frontend

- [ ] Click "Create Static Site"
- [ ] Wait for build (~3-5 mins)
- [ ] Check build logs for errors
- [ ] Verify site is live: `https://kanban-frontend-xxxx.onrender.com`

---

## ✅ Phase 6: CORS Configuration

### 6.1 Add CORS to Backend

- [ ] Install cors: `cd backend && npm install cors`
- [ ] Update `server.js`:

  ```javascript
  import cors from "cors";

  const allowedOrigins = [
    "https://kanban-frontend-xxxx.onrender.com",
    "http://localhost:5173", // for local dev
  ];

  app.use(
    cors({
      origin: allowedOrigins,
      credentials: true,
    })
  );
  ```

- [ ] Commit and push changes
- [ ] Render auto-redeploys backend

---

## ✅ Phase 7: Firebase Configuration

### 7.1 Update Firebase Console

- [ ] Go to Firebase Console → Authentication → Settings
- [ ] Add authorized domain:
  - `kanban-frontend-xxxx.onrender.com`
- [ ] Save changes

### 7.2 Test Authentication Flow

- [ ] Visit production frontend URL
- [ ] Click "Create Account"
- [ ] Sign up with test email
- [ ] Verify redirect to `/` after signup
- [ ] Check if projects page loads

---

## ✅ Phase 8: Testing & Validation

### 8.1 Manual Testing Checklist

- [ ] **Authentication**:
  - Sign up new user
  - Log in existing user
  - Log out
  - Refresh page (should stay logged in)
- [ ] **Projects**:
  - Create new project
  - View projects list
  - Delete project
- [ ] **Boards**:
  - Open project
  - Create new board (list)
  - Delete board
- [ ] **Cards**:
  - Create new card
  - Edit card title
  - Delete card
  - Move card between boards
  - Drag-and-drop card

### 8.2 Error Scenarios

- [ ] Test with expired token (wait 1 hour, should redirect to login)
- [ ] Test with no internet (should show error, not crash)
- [ ] Test unauthorized access (logout, try to access `/boards/1`)

### 8.3 Performance Check

- [ ] Test cold start time (visit after 15 mins inactivity)
- [ ] Check page load speed
- [ ] Verify no console errors in browser

---

## ✅ Phase 9: Monitoring & Maintenance

### 9.1 Set Up Monitoring

- [ ] Render Dashboard → Service → Logs (check for errors)
- [ ] Set up email alerts for deployment failures
- [ ] Monitor database usage (Render free tier limits)

### 9.2 Documentation

- [ ] Update README.md with production URLs
- [ ] Document deployment process
- [ ] Create runbook for common issues

### 9.3 Backup Strategy

- [ ] Set up database backup schedule
- [ ] Document restore procedure
- [ ] Test backup/restore process

---

## ✅ Phase 10: Post-Launch Improvements

### 10.1 Security Hardening

- [ ] Review CORS settings (tighten if needed)
- [ ] Add rate limiting to API endpoints
- [ ] Review Firebase security rules
- [ ] Add HTTPS-only enforcement

### 10.2 Performance Optimization

- [ ] Add frontend caching headers
- [ ] Optimize images and assets
- [ ] Consider CDN for static assets
- [ ] Add loading states (Issue #7)

### 10.3 Feature Completion

- [ ] Implement drag-and-drop persistence (Issue #6)
- [ ] Add error boundaries in React
- [ ] Implement proper toast notifications
- [ ] Add user profile page

---

## 🚨 Rollback Plan

If deployment fails:

1. **Backend Issues**:

   - Render → Service → Manual Deploy → Select previous version
   - Check logs for specific errors
   - Verify environment variables

2. **Frontend Issues**:

   - Git revert to previous commit
   - Push to trigger redeploy
   - Clear browser cache

3. **Database Issues**:
   - Restore from backup
   - Re-run migration scripts
   - Verify table structure

---

## 📋 Quick Reference

**Backend URL**: `https://kanban-backend-xxxx.onrender.com`  
**Frontend URL**: `https://kanban-frontend-xxxx.onrender.com`  
**Database**: PostgreSQL on Render (Internal URL)

**Key Files**:

- Backend entry: `backend/src/server.js`
- Frontend config: `frontend/vite.config.js`
- Firebase config: `frontend/src/firebase.js`
- Database connection: `backend/src/db.js`

**Support Resources**:

- Render Docs: https://render.com/docs
- Render Community: https://community.render.com
- Firebase Docs: https://firebase.google.com/docs
