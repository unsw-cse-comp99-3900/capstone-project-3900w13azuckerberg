from datetime import datetime
from flask import Flask, redirect, request, jsonify, url_for, render_template_string
from flask_migrate import Migrate
from flask_cors import CORS
from dotenv import load_dotenv
from config import Config
from data_loader import load_into_db
from db_manager import get_case_by_coordinate, get_case_by_loc, get_records, init_db, load_dataframe_to_db
from model import db
from gmaps import get_coordinates
from datetime import datetime, timedelta
import threading
from basic_seirs import predictive_data 

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

# Database configuration
app.config.from_object(Config)

init_db(app)

migrate = Migrate(app, db)

# Route for the home page
@app.route('/')
def home():
    return "Welcome to COVID Compass!"

@app.route('/test', methods=['GET'])
def mytest():
    date = datetime.strptime('2023-12-31', '%Y-%m-%d').date()
    case_counts = get_case_by_loc(date)
    return jsonify(case_counts)

# Route to handle GET requests
@app.route('/get_data', methods=['GET'])
def get_data():
    records = get_records(10)
    results = [
        {
            "id": record.id,
            "lineage": record.lineage,
            "strain": record.strain,
            "date": record.date,
            "division": record.division,
            "lattitude": get_coordinates(record.originating_lab)['latitude'],
            "longitude": get_coordinates(record.originating_lab)['longitude'],
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

data_loaded = False

@app.before_request
def before_request():
    global data_loaded
    if not data_loaded:
        load_data()
        data_loaded = True

@app.route('/load_data', methods=['GET'])
def load_data():
    load_into_db(app)
    return redirect(url_for('home'))

# frontend uses the midpoint of the state that's returned for below routes

# returns list of coordinate cases for a particular date
@app.route('/map', methods=['GET'])
def heat_map():
    # date_str = request.args.get('date')
    start_date = datetime.strptime('2023-12-20', '%Y-%m-%d').date()
    end_date = datetime.strptime('2023-12-30', '%Y-%m-%d').date()

    # Dictionary for daily cases grouped by location from 1-Jan-21 up until provided date
    data = {}
    
    # Loop over each day from start_date to end_date
    current_date = start_date
    while current_date <= end_date:
        daily_cases = get_case_by_loc(current_date)

        # Initialize a list to store the cases for the current day
        cases_list = []

        for location, intensity in daily_cases.items():
            coordinates = get_coordinates(location)
            # print(coordinates)

            if coordinates['latitude'] != 'Invalid location':
                cases_list.append({
                    "latitude": coordinates['latitude'],
                    "longitude": coordinates['longitude'],
                    "intensity": intensity
                })

        # Use the date as a key in the data dictionary
        data[current_date.strftime('%Y-%m-%d')] = cases_list
        print("date:", current_date, "added")
        current_date += timedelta(days=1)
    print("number of days:", len(data))
    return jsonify(data)

@app.route('/predictive_map', methods=['GET'])
def predictive_map():
    predictive_map = predictive_data()
    return jsonify(predictive_map)


# variant filter for heatmap
@app.route('/filter', methods=['GET'])
def filter_variant():
    return "nil"
    variant = request.args.get('variant_name')
    date = request.args.get('date')
    variant_records = get_variant(variant, date)
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
    variant_split_records = get_variant_split(date)
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

def run_server():
    app.run(debug=True)

if __name__ == '__main__':
    # Start the Flask server in a separate thread
    server_thread = threading.Thread(target=run_server)
    server_thread.start()

    # Now call load_data() without blocking the main thread
    load_data()