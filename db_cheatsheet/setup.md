# Setup for PostgreSQL Database

### Installation

To start refresh clean up the previous install using :

```bash
sudo apt-get remove postgresql

[sudo] password for harshityadav95:
Reading package lists... Done
Building dependency tree
Reading state information... Done
Package 'postgresql' is not installed, so not removed
The following package was automatically installed and is no longer required:
  libfreetype6
Use 'sudo apt autoremove' to remove it.
0 upgraded, 0 newly installed, 0 to remove and 0 not upgraded.
```

Now Install fresh using

```bash
sudo apt-get install postgresql
```

### Using psql

After your first install, and each time you restart your machine you will have to also restart the postgres service, or else you will get a `Is the server running?` error.

1. To start the service, type `sudo service postgresql start`.
2. To conntect to postgres, type `sudo -u postgres psql`

### How to Use Flask-Migrate
Do this in your terminal (not psql terminal).

**Install Dependencies**

```sh
pip install -r requirements.txt
```

**Set Up Environment Variables**

- Create a `.env` file in the root directory of the project with the following content:

```plaintext
FLASK_APP=app.py
FLASK_ENV=development
DATABASE_URL=postgresql://username:password@localhost/dbname
SECRET_KEY=1LAKeDYR83stxYv
```

- Replace `username`, `password`, `localhost`, and `dbname` with your actual PostgreSQL credentials and database name.
- refer to [createuser.md](db_cheatsheet/createuser.md) for create a user.
- `SECRET_KEY` is just a random number.

**Initialize the Database**

- Ensure PostgreSQL is running and create the database (do this in psql terminal):

```sql
CREATE DATABASE dbname;
```

Use `covid` as dbname

**Apply Migrations**

- Run the following command to apply all migrations and initialize the database schema:

```sh
flask db upgrade
```

**Run the Application**

```sh
flask run
```
