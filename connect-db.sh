#!/bin/bash
# Connect to Render PostgreSQL and run schema

echo "Connecting to Render PostgreSQL database..."
echo "Once connected, you'll see a prompt like: kanban_db_9a7e=>"
echo ""
echo "Then run this command inside psql:"
echo "\i backend/schema.sql"
echo ""
echo "Or copy/paste the SQL from backend/schema.sql"
echo ""

PGPASSWORD=1dPVZ1I08xR0jjnnwkMAtSS2MTTILiPk winpty psql -h dpg-d4vk851r0fns739ne9tg-a.oregon-postgres.render.com -U saikiran kanban_db_9a7e
