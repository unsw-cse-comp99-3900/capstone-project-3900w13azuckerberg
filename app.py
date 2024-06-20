from flask import Flask, request, jsonify
from flask_migrate import Migrate
from dotenv import load_dotenv
from sqlalchemy import inspect

from config import Config
from db_manager import db, User

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# Database configuration
app.config.from_object(Config)
# # Debug: Print configuration values
# print("Secret Key:", app.config['SECRET_KEY'])
# print("SQLALCHEMY_DATABASE_URI:", app.config['SQLALCHEMY_DATABASE_URI'])
# print("SQLALCHEMY_TRACK_MODIFICATIONS:", app.config['SQLALCHEMY_TRACK_MODIFICATIONS'])

db.init_app(app)
migrate = Migrate(app, db)

# Route for the home page
@app.route('/')
def home():
    return "Welcome to COVID Compass!"

# Route to handle GET requests
@app.route('/get_data', methods=['GET'])
def get_data():
    data = {
        "message": "This is a GET request",
        "status": "success"
    }
    return jsonify(data)

def check_user_table():
    inspector = inspect(db.engine)
    tables = inspector.get_table_names()
    if 'user' in tables:
        print("User table exists in the database.")
    else:
        print("User table does not exist in the database.")

if __name__ == '__main__':
    with app.app_context():
        try:
            check_user_table()
        except Exception as e:
            print(f"Error: {e}")
    app.run(debug=True)