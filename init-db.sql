-- Create a new role
DROP ROLE IF EXISTS user1;
CREATE ROLE user1 WITH LOGIN PASSWORD 'password' SUPERUSER CREATEDB CREATEROLE;

-- Create a new database with user1 as the owner
CREATE DATABASE covid OWNER user1;

-- Grant all privileges on the database to user1
GRANT ALL PRIVILEGES ON DATABASE covid TO user1;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'alembic_version') THEN
        TRUNCATE TABLE alembic_version;
    END IF;
END $$;