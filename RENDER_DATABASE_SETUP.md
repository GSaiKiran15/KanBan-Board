# Render Database Setup Guide

## Step 1: Get Your Database Credentials from Render

From the screenshot you showed, you have these credentials in your Render dashboard:

```
Hostname: dpg-d4vk851r0fns739ne9tg-a
Port: 5432
Database: kanban_db_9a7e
Username: saikiran
Password: 1dPVZ1I08xR0jjnnwkMAtSS2MTTILiPk
```

You'll also have two connection strings:

- **Internal Database URL** (for backend service): `postgresql://saikiran:1dPVZ1I08xR0jjnnwkMAtSS2MTTILiPk@dpg-d4vk851r0fns739ne9tg-a/kanban_db_9a7e`
- **External Database URL** (for connecting from your local machine or PSQL)

## Step 2: Initialize Your Database Schema

### Option A: Using Render's PSQL Command (Recommended)

1. In your Render database dashboard, find the **"PSQL Command"** section
2. Copy the command and run it based on your terminal:

   **Git Bash (Windows):**

   ```bash
   PGPASSWORD=1dPVZ1I08xR0jjnnwkMAtSS2MTTILiPk winpty psql -h dpg-d4vk851r0fns739ne9tg-a.oregon-postgres.render.com -U saikiran kanban_db_9a7e
   ```

   **PowerShell:**

   ```powershell
   $env:PGPASSWORD='1dPVZ1I08xR0jjnnwkMAtSS2MTTILiPk'; psql -h dpg-d4vk851r0fns739ne9tg-a.oregon-postgres.render.com -U saikiran kanban_db_9a7e
   ```

   **CMD:**

   ```cmd
   set PGPASSWORD=1dPVZ1I08xR0jjnnwkMAtSS2MTTILiPk && psql -h dpg-d4vk851r0fns739ne9tg-a.oregon-postgres.render.com -U saikiran kanban_db_9a7e
   ```

   **Linux/Mac:**

   ```bash
   PGPASSWORD=1dPVZ1I08xR0jjnnwkMAtSS2MTTILiPk psql -h dpg-d4vk851r0fns739ne9tg-a.oregon-postgres.render.com -U saikiran kanban_db_9a7e
   ```

3. Once connected, run the schema:
   ```sql
   -- Copy and paste the entire contents of backend/schema.sql
   -- Or run: \i C:/Users/ganes/OneDrive/Documents/Coding/KanBan/backend/schema.sql
   ```

### Option B: Using Render's Web Shell

1. Go to your Render database dashboard
2. Click on the **"Connect"** button or **"Shell"** tab
3. Click **"Open Shell"**
4. Copy the contents of `backend/schema.sql` and paste it into the shell
5. Press Enter to execute

### Option C: Using a Database GUI (Recommended for Windows)

1. Download [DBeaver](https://dbeaver.io/) or [pgAdmin](https://www.pgadmin.org/)
2. Create a new PostgreSQL connection with these details:

   - **Host**: Use the External Database URL hostname ending in `.render.com`
   - **Port**: 5432
   - **Database**: kanban_db_9a7e
   - **Username**: saikiran
   - **Password**: 1dPVZ1I08xR0jjnnwkMAtSS2MTTILiPk
   - **SSL Mode**: Require

3. Open `backend/schema.sql` and execute it

## Step 3: Configure Your Backend Environment Variables on Render

1. Go to your Render **Backend Web Service** dashboard (not the database)
2. Click on **"Environment"** in the left sidebar
3. Add these environment variables:

```env
DB_HOST=dpg-d4vk851r0fns739ne9tg-a
DB_PORT=5432
DB_DATABASE=kanban_db_9a7e
DB_USER=saikiran
DB_PASSWORD=1dPVZ1I08xR0jjnnwkMAtSS2MTTILiPk
```

**OR** use the single DATABASE_URL (easier approach - see Step 4 for code change):

```env
DATABASE_URL=postgresql://saikiran:1dPVZ1I08xR0jjnnwkMAtSS2MTTILiPk@dpg-d4vk851r0fns739ne9tg-a/kanban_db_9a7e
```

Also add your Firebase credentials:

```env
FIREBASE_SERVICE_ACCOUNT=<paste your credentials.json content as a single-line JSON string>
FRONTEND_URL=https://your-frontend.onrender.com
```

## Step 4: Update Backend Code to Use DATABASE_URL (Optional but Recommended)

If you want to use a single DATABASE_URL environment variable instead of 5 separate variables, update [db.js](backend/src/db.js):

```javascript
import "dotenv/config";
import pkg from "pg";
const { Pool } = pkg;

let pool;

if (process.env.DATABASE_URL) {
  // For Render deployment using connection string
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });
} else {
  // For local development using separate variables
  pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });
}

pool.connect((err, client, release) => {
  if (err) {
    return console.error("Error acquiring client", err.stack);
  }
  console.log("Successfully connected to PostgreSQL database!");
  release();
});

export default pool;
```

## Step 5: Deploy Your Backend

1. Push your changes to GitHub (if using Git deploy)
2. In Render, go to your **Backend Web Service**
3. Click **"Manual Deploy"** → **"Clear build cache & deploy"**
4. Check the logs to verify:
   - ✅ "Successfully connected to PostgreSQL database!"
   - ✅ No database connection errors

## Step 6: Test the Connection

Once deployed, test your backend:

```bash
# Check if backend is running
curl https://your-backend-url.onrender.com/

# Test with authentication (you'll need a Firebase token)
curl https://your-backend-url.onrender.com/api/projects \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN"
```

## Troubleshooting

### Connection Refused / Timeout

- Make sure you're using the **Internal Database URL** (without `.render.com`) in your Render backend service
- Verify SSL is enabled in db.js if using DATABASE_URL

### Authentication Errors

- Verify DB_USER and DB_PASSWORD are correct
- Check that the database is active (not suspended)

### Table Doesn't Exist

- Make sure you ran the schema.sql file
- Verify tables exist: Run `SELECT * FROM information_schema.tables WHERE table_schema = 'public';` in PSQL

### ECONNREFUSED in Logs

- Check that all environment variables are set correctly
- Restart the backend service after adding environment variables

## Local Development Setup

Create a `.env` file in your `backend/` directory:

```env
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=kanban_local
DB_USER=postgres
DB_PASSWORD=your_local_password

# Or use Render's External URL for testing against production DB
# DATABASE_URL=postgresql://saikiran:1dPVZ1I08xR0jjnnwkMAtSS2MTTILiPk@dpg-d4vk851r0fns739ne9tg-a.oregon-postgres.render.com/kanban_db_9a7e

FIREBASE_SERVICE_ACCOUNT=<your credentials.json content>
FRONTEND_URL=http://localhost:5173
```

## Verification Checklist

- [ ] Database created on Render
- [ ] Schema tables created (users, projects, boards, elements)
- [ ] Backend environment variables configured
- [ ] Backend deployed successfully
- [ ] "Successfully connected to PostgreSQL database!" in logs
- [ ] Frontend can communicate with backend
- [ ] Users can sign up/login
- [ ] Projects/boards can be created

---

**Next Steps**: Once your database is set up and backend is connected, make sure your frontend is also deployed with the correct `VITE_FIREBASE_*` environment variables as covered in the [FIREBASE_FIX_GUIDE.md](../FIREBASE_FIX_GUIDE.md).
