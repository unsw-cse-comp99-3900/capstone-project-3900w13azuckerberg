from flask import Flask, request, jsonify
from flask_migrate import Migrate
from dotenv import load_dotenv

from config import Config
from db_manager import db, get_records, init_db
from model import VirusData

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
    records = get_records(VirusData, 10)
    results = [
        {
            "strain": record.strain,
            "virus": record.virus,
            "segment": record.segment,
            "length": record.length,
            "gisaid_epi_isl": record.gisaid_epi_isl,
            "date": record.date,
            "division": record.division,
            "location": record.location,
            "region_exposure": record.region_exposure,
            "country_exposure": record.country_exposure,
            "division_exposure": record.division_exposure,
            "age": record.age,
            "sex": record.sex,
            "originating_lab": record.originating_lab,
            "submitting_lab": record.submitting_lab,
            "date_submitted": record.date_submitted
        } for record in records]
    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True)