import folium
from flask import Flask, redirect, request, jsonify, url_for, render_template_string
from flask_migrate import Migrate
from dotenv import load_dotenv

from config import Config
from data_cleaner import clean_all_virus_data
from db_manager import db, get_records, init_db, load_dataframe_to_db
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

@app.route('/load_data', methods=['GET'])
def load_data():
    load_dataframe_to_db(clean_all_virus_data(), "virus_data", app)
    return redirect(url_for('home'))

@app.route('/map', methods=['GET'])
def display_map():
    # Create a map centered around a specific location
    start_coords = (-33.8688, 151.2093)  # Coordinates for San Francisco
    folium_map = folium.Map(location=start_coords, zoom_start=13)

    # Save the map to an HTML string
    map_html = folium_map._repr_html_()

    # Render the map HTML in a simple HTML template
    return render_template_string("""
        <!DOCTYPE html>
        <html>
        <head>
            <title>Map</title>
        </head>
        <body>
            <h1>My Map</h1>
            {{ map_html|safe }}
        </body>
        </html>
    """, map_html=map_html)

if __name__ == '__main__':
    app.run(debug=True)
