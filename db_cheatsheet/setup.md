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

#### Step 1: Install Flask-Migrate

If you haven't already installed Flask-Migrate, you can do so using pip:

```sh
pip install Flask-Migrate
```

#### Step 2: Set Up Flask-Migrate in Your Application

1. **Initialize Flask-Migrate in your application**:

   #### app.py


   ```python
   from flask import Flask, request, jsonify
   from flask_sqlalchemy import SQLAlchemy
   from flask_migrate import Migrate
   from config import Config
   from dotenv import load_dotenv


   # Load environment variables from .env file
   load_dotenv()

   app = Flask(__name__)

   # Database configuration
   app.config.from_object(Config)

   db = SQLAlchemy(app)
   migrate = Migrate(app, db)
   ```

   #### config.py

   ```python
   import os

   class Config:
       SECRET_KEY = os.environ.get('SECRET_KEY') or 'you-will-never-guess'
       SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///site.db'
       SQLALCHEMY_TRACK_MODIFICATIONS = False
   ```

   #### .env

   ```bash
   DATABASE_URL=postgresql://username:password@localhost/dbname
   SECRET_KEY=your_generated_secret_key
   ```
2. **Create Your Models**:

   Define your database models in a separate file, such as `models.py`:

   ```python
   from app import db

   class User(db.Model):
       id = db.Column(db.Integer, primary_key=True)
       username = db.Column(db.String(20), unique=True, nullable=False)
       email = db.Column(db.String(120), unique=True, nullable=False)
       password = db.Column(db.String(60), nullable=False)

       def __repr__(self):
           return f"User('{self.username}', '{self.email}')"
   ```

#### Step 3: Initialize the Migration Environment

1. **Initialize the migration directory**:

   ```sh
   flask db init
   ```

   This command creates a new directory called `migrations` in your project directory, which will store migration scripts and configurations.
2. **Create an initial migration**:

   ```sh
   flask db migrate -m "Initial migration."
   ```

   This command generates a migration script that contains the changes needed to create the initial database schema.
3. **Apply the migration**:

   ```sh
   flask db upgrade
   ```

   This command applies the changes described in the migration script to the database, creating the initial schema.

#### Step 4: Making Changes to the Database Schema

1. **Modify your models**:

   For example, if you add a new column to the `User` model:

   ```python
   from app import db

   class User(db.Model):
       id = db.Column(db.Integer, primary_key=True)
       username = db.Column(db.String(20), unique=True, nullable=False)
       email = db.Column(db.String(120), unique=True, nullable=False)
       password = db.Column(db.String(60), nullable=False)
       age = db.Column(db.Integer)  # New column

       def __repr__(self):
           return f"User('{self.username}', '{self.email}', '{self.age}')"
   ```
2. **Create a new migration**:

   ```sh
   flask db migrate -m "Add age column to User model."
   ```
   This command generates a new migration script that includes the changes you made to the models.
3. **Apply the new migration**:

   ```sh
   flask db upgrade
   ```
   This command applies the new migration script to the database, updating the schema with the new changes.
