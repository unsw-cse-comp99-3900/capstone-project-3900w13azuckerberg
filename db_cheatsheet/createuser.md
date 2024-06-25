### Steps to Create a PostgreSQL User

1. **Access PostgreSQL Shell:**
   Open a terminal and access the PostgreSQL shell as the `postgres` user:

   ```sh
   sudo -u postgres psql
   ```
2. **Create a New Role:**
   Inside the PostgreSQL shell, create a new role with a password:

   ```sql
   CREATE ROLE yourusername WITH LOGIN PASSWORD 'yourpassword';
   ```
3. **Create a Database:**
   Create a database owned by this new role:

   ```sql
   CREATE DATABASE yourdbname OWNER yourusername;
   ```
4. **Grant Permissions:**
   Grant all privileges on the database to the new user:

   ```sql
   GRANT ALL PRIVILEGES ON DATABASE yourdbname TO yourusername;
   ```
5. **Exit the PostgreSQL Shell:**

   ```sql
   \q
   ```