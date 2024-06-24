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
            "id": record.id,
            "lineage": record.lineage,
            "strain": record.strain,
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

# frontend uses the midpoint of the state that's returned for below routes

# returns list of coordinate cases for a particular date
@app.route('/map', methods=['GET'])
def display_map():
    date = request.args.get('date')
    coordinate_cases = get_coordinate_cases(VirusData, date)
    # this function get_coordinate_cases should return a list of coordinate & intensity
    results = [
        {
            "state": coordinate_case.state,
            "intensity": coordinate_case.intensity
        } for coordinate_case in coordinate_cases]
    return jsonify(results)

# variant filter for heatmap
@app.route('/filter', methods=['GET'])
def filter_variant():
    variant = request.args.get('variant_name')
    date = request.args.get('date')
    variant_records = get_variant(VirusData, variant, date)
    # this function get_variant should return a list of variant records up until a particular date for displaying on the heat map
    results = [
        {
            "state": variant_record.state,
            "intensity": variant_record.intensity
        } for variant_record in variant_records]
    return jsonify(results)

# graph showing distribution of infections for variant strains 
@app.route('/pie_chart', methods=['GET'])
def variant_pie_chart():
    date = request.args.get('date')
    variant_split_records = get_variant_split(VirusData, date)
    # get variant split should return 4 Records showing variant, %, number of infecteced up until a certain date
    results = [
        {
            "variant": variant_split_record.variant,
            "percentage": variant_split_record.percentage,
            "infected": variant_split_record.infected
        } for variant_split_record in variant_split_records]
    return jsonify(results)

# # TBD once we find a source of vaccination data - graph showing vaccinations
# @app.route('/vaccination', methods=['GET'])
# def vaccinations():
#     date = request.args.get('date')
#     strain = request.args.get('strain')
#     vaccination_records = get_vaccinations(VaccinationData) 
#     results = [
#         {
#             ""
#         }

#     ]

if __name__ == '__main__':
    app.run(debug=True)
