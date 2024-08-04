-- Create a new role
DROP ROLE IF EXISTS user1;
CREATE ROLE user1 WITH LOGIN PASSWORD 'password' SUPERUSER CREATEDB CREATEROLE;

-- Create a new database with user1 as the owner
CREATE DATABASE covid OWNER user1;

-- Grant all privileges on the database to user1
GRANT ALL PRIVILEGES ON DATABASE covid TO user1;