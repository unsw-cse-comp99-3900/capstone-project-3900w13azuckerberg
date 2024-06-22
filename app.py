from flask import Flask, request, jsonify
from flask_migrate import Migrate
from dotenv import load_dotenv
from sqlalchemy import inspect

from config import Config
from db_manager import db, init_db

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# Database configuration
app.config.from_object(Config)

init_db(app)


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

if __name__ == '__main__':
    app.run(debug=True)