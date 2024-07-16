from datetime import datetime
from flask import Flask, redirect, request, jsonify, url_for
from flask_migrate import Migrate
from flask_cors import CORS
from dotenv import load_dotenv
from config import Config
from data_loader import load_into_db
from db_manager import get_all_time_case_pie_chart, get_case_by_coordinate, get_case_by_coordinate_and_strain, init_db
from model import db
from datetime import datetime, timedelta
from seirsplus.models import *
import threading
# from basic_seirs import get_predictive_data 

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

# Database configuration
app.config.from_object(Config)

init_db(app)

migrate = Migrate(app, db)

data_loaded = False

init_left_flag = True
init_right_flag = True
init_main_flag = True

selected_strains_left = {
    "Alpha": False,
    "Beta": False,
    "Delta": False,
    "Omicron": False
}

selected_strains_right = {
    "alpha": False,
    "beta": False,
    "delta": False,
    "omicron": False
}

selected_strains_main = {
    "alpha": False,
    "beta": False,
    "delta": False,
    "omicron": False
}

selected_strains_all= {
    "Alpha": True,
    "Beta": True,
    "Delta": True,
    "Omicron": True
}

@app.before_request
def before_request():
    global data_loaded
    if not data_loaded:
        load_data()
        data_loaded = True

# Route for the home page
@app.route('/')
def home():
    return "Welcome to COVID Compass!"

@app.route('/test', methods=['GET'])
def mytest():
    print("testing pie chart db function\n")
    res = get_all_time_case_pie_chart()
    return jsonify(res)

@app.route('/test1', methods=['GET'])
def mytest1():
    print("testing heatmap db function\n")
    date = datetime.strptime('2023-12-31', '%Y-%m-%d').date()
    case_counts = get_case_by_coordinate(date, ["Omicron"])
    return jsonify(case_counts)

@app.route('/load_data', methods=['GET'])
def load_data():
    global data_loaded
    data_loaded = True
    load_into_db(app)
    return redirect(url_for('home'))

# frontend uses the midpoint of the state that's returned for below routes

# returns list of coordinate cases for a particular date
@app.route('/map/<containerId>', methods=['GET'])
def heat_map(containerId):

    # date_str = request.args.get('date')
    start_date = datetime.strptime('2023-12-20', '%Y-%m-%d').date()
    end_date = datetime.strptime('2023-12-30', '%Y-%m-%d').date()

    # select strains based off filter or select all if no filter has been selected
    if (containerId) == 'left':
        if (init_left_flag) == True:
            selected_strains = selected_strains_all
        else:
            selected_strains = selected_strains_left
    elif (containerId) == 'right':
        if (init_right_flag) == True:
            selected_strains = selected_strains_all
        else:
            selected_strains = selected_strains_right
    elif (containerId) == 'm':
        if (init_main_flag) == True:
            selected_strains = selected_strains_all
        else:
            selected_strains = selected_strains_main

    selected_strains = [strain for strain, selected in selected_strains.items() if selected is True]
    print(selected_strains)
    # Dictionary for daily cases grouped by location from 1-Jan-21 up until provided date
    map_data = {}
    
    # Loop over each day from start_date to end_date
    current_date = start_date
    while current_date <= end_date:
        daily_cases = get_case_by_coordinate_and_strain(current_date, selected_strains)

        # Initialize a list to store the cases for the current day
        cases_list = []

        for location, data in daily_cases.items():

            cases_list.append({
                "latitude": data['latitude'],
                "longitude": data['longitude'],
                "intensity": data['case_count'],
                "state": data["state"]
            })

        # Use the date as a key in the data dictionary
        map_data[current_date.strftime('%Y-%m-%d')] = cases_list
        print("date:", current_date, "added")
        current_date += timedelta(days=1)
    return jsonify(map_data)

@app.route('/predictive_map', methods=['GET'])
def predictive_map():
    # predictive_map = get_predictive_data()

    # dictionary to store map data
    predictive_map_data = {}

    # Initialise dictionary to store intial model parameters into
    init_data = {}

    # for each location in the db
    # set beta, sigma, gamma
    default_population = 10000
    default_sigma = 1/5.2
    default_gamma = 1/10
    default_beta = 0.25
    
    predictive_period = 365 # one year of prediction

    current_date = datetime.strptime('2024-4-30', '%Y-%m-%d').date()
    loc_data = get_case_by_coordinate(current_date)

    for key, data in loc_data.items():
        init_data[key] = {
            "latitude": data["latitude"],
            "longitude": data["longitude"],
            "state": data["state"],
            "initN": default_population,
            "intensity": data["case_count"]
        }

    for location, data in init_data.items():
        
        # run model for each location
        model = SEIRSModel(initN   = data["initN"],
            beta    = default_beta, 
            sigma   = default_sigma, 
            gamma   = default_gamma, 
            psi_E   = 1,
            psi_I   = 1,
            initI = data["initI"]
            # initI   = 10000 
        )

        model.run(T = predictive_period, verbose=False)

        for i in range(1, predictive_period):
            date_key = (current_date + timedelta(days=i)).strftime('%Y-%m-%d')
            
            # need to initalise if date is not alr in dictionary
            if date_key not in predictive_map_data:
                predictive_map_data[date_key] = [] 
            
            # add predicted infection data to dictionary
            predictive_map_data[date_key].append({
                "lattitude": data["latitude"],
                "longtitude": data["longitude"],
                "state": data["state"],
                "numS": round(model.numS[i*10]),
                "numE": round(model.numE[i*10]),
                "numI": round(model.numI[i*10]),
                "numR": round(model.numR[i*10])
            })

    return jsonify(predictive_map_data)


# variant filter for heatmap
@app.route('/filter', methods=['GET'])
def filter_variant():
    # data from frontend in the format
    # {
    #     "label": 'alpha',
    #     "selected": 'true',
    #     'containerId': 'left'
    # }

    label = request.args.get('label')
    selected = request.args.get('selected')
    containerId = request.args.get('containerId')

    if (containerId) == 'left':
        init_left_flag = False
        selected_strains_left[label] = selected
    elif (containerId) == 'right':
        init_right_flag = False
        selected_strains_right[label] = selected
    else:
        init_main_flag = False
        selected_strains_main[label] = selected

    return "nil"

def create_default_state():
     # Define the expected states and strains
    expected_states = ['Australia', 'New South Wales', 'Victoria', 'Queensland', 'Western Australia', 'Tasmania', 'Northern Territory']
    strains = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Omicron']

    # Initialize the dictionary with default values
    return {state: {strain: 0 for strain in strains} for state in expected_states}


# graph showing distribution of infections for variant strains 
@app.route('/graph_data', methods=['GET'])
def variant_pie_chart():
    # date = request.args.get('date')
    end_date = datetime.strptime('2023-12-30', '%Y-%m-%d').date()
    # start_date = datetime.strptime('2021-12-30', '%Y-%m-%d').date()

    graph_data = get_all_time_case_pie_chart()

    result_graph_data = {}

    for date, states_info in graph_data.items():

        default_states = create_default_state()

        for state, strains_info in states_info.items():
            if state in default_states:
                for strain, count in strains_info.items():
                    if strain in default_states[state]:
                        default_states[state][strain] += count
                        # Also add this count to the 'Australia' total
                        default_states['Australia'][strain] += count


        result_graph_data[date] = default_states


    return jsonify(result_graph_data)




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
    # # Start the Flask server in a separate thread
    # server_thread = threading.Thread(target=run_server)
    # server_thread.start()

    # Now call load_data() without blocking the main thread
    # load_data()
    with app.app_context():
        app.run(debug=True)