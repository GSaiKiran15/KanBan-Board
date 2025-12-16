# Quick Setup: Render Database Connection

## 🚀 3-Step Quick Start

### 1. Run the Schema on Your Render Database

**Easiest Method - Using Render's PSQL Command:**

From your Render database dashboard, copy the PSQL command and run it locally:

```bash
PGPASSWORD=1dPVZ1I08xR0jjnnwkMAtSS2MTTILiPk psql -h dpg-d4vk851r0fns739ne9tg-a.oregon-postgres.render.com -U saikiran kanban_db_9a7e
```

Then paste the contents of `backend/schema.sql` to create all tables.

**Alternative - Use Render Web Shell:**

- Go to your database → "Connect" → "Open Shell"
- Copy/paste the schema.sql contents

### 2. Add Environment Variable to Your Backend Service

In your Render **Backend Web Service** (not database):

- Go to Environment tab
- Add this variable:

```
DATABASE_URL
```

Value (Internal URL from your database dashboard):

```
postgresql://saikiran:1dPVZ1I08xR0jjnnwkMAtSS2MTTILiPk@dpg-d4vk851r0fns739ne9tg-a/kanban_db_9a7e
```

⚠️ **Important**: Use the **Internal** URL (without `.oregon-postgres.render.com`)

### 3. Deploy Your Backend

- Push your code to GitHub
- Render will auto-deploy, or click "Manual Deploy"
- Check logs for: "Successfully connected to PostgreSQL database!"

## ✅ Verification

After deployment, check your backend logs should show:

```
Using DATABASE_URL connection string
Successfully connected to PostgreSQL database!
```

## 📝 What Was Changed

1. **Created** [backend/schema.sql](backend/schema.sql) - Database schema with all tables
2. **Updated** [backend/src/db.js](backend/src/db.js) - Now supports both DATABASE_URL and individual env vars
3. **Created** [RENDER_DATABASE_SETUP.md](RENDER_DATABASE_SETUP.md) - Detailed setup guide

## 🔗 Important URLs You Need

From your Render database dashboard, you'll need:

- **Internal Database URL** → Add as `DATABASE_URL` in backend service environment
- **PSQL Command** → Use to connect and run schema

---

For detailed troubleshooting, see [RENDER_DATABASE_SETUP.md](RENDER_DATABASE_SETUP.md)
