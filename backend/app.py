from datetime import datetime
import time
from flask import Flask, redirect, request, jsonify, url_for
from flask_migrate import Migrate
from flask_cors import CORS
from dotenv import load_dotenv
from config import Config
from data_loader import load_into_db
from db_manager import get_all_case_by_coordinate, get_all_time_case_pie_chart, get_case_by_coordinate, init_db
from model import db
from datetime import datetime, timedelta
from seirsplus.models import *
import threading
from seirsplus.networks import custom_exponential_graph
import networkx as nx
from network import *
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

selected_strains = {
    "left": {
        "Alpha": 'true',
        "Beta": 'true',
        "Delta": 'true',
        "Gamma": 'true',
        "Omicron": 'true'
    },
    "right": {
        "Alpha": 'true',
        "Beta": 'true',
        "Delta": 'true',
        "Gamma": 'true',
        "Omicron": 'true'
    },
    "m": {
        "Alpha": 'true',
        "Beta": 'true',
        "Delta": 'true',
        "Gamma": 'true',
        "Omicron": 'true'
    },
    "all": {
        "Alpha": 'true',
        "Beta": 'true',
        "Delta": 'true',
        "Gamma": 'true',
        "Omicron": 'true'
    },
    "none": {
        "Alpha": 'false',
        "Beta": 'false',
        "Delta": 'false',
        "Gamma": 'false',
        "Omicron": 'false'
    }
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
    print("Starting my test...")
    start_time = time.time()


    start_date_str = '2020-01-01'
    end_date_str = '2023-12-31'
    start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
    end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()
    results = get_all_case_by_coordinate(start_date, end_date, labels=[])


    end_time = time.time()
    execution_time = end_time - start_time
    print(f"Execution time: {execution_time} seconds")
    return jsonify(results)

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
@app.route('/map', methods=['GET'])
def heat_map():
    start_time = time.time()
    containerId = request.args.get('containerId')
    print("/map containerId", containerId)
    start_date = datetime.strptime('2020-01-01', '%Y-%m-%d').date()
    end_date = datetime.strptime('2024-4-29', '%Y-%m-%d').date()

    global selected_strains

    selected_strains_dict = selected_strains[containerId]
    # convert to list for db function
    selected_strains_arr = [strain for strain, selected in selected_strains_dict.items() if selected == 'true']

    results = get_all_case_by_coordinate(start_date, end_date, selected_strains_arr)

    end_time = time.time()
    execution_time = end_time - start_time
    print(f"Execution time: {execution_time} seconds")
    return jsonify(results)

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

    global selected_strains

    selected_strains_dict = selected_strains['all']
    selected_strains_arr = [strain for strain, selected in selected_strains_dict.items() if selected == 'true']

    print(selected_strains_arr)

    current_date = datetime.strptime('2024-5-29', '%Y-%m-%d').date()
    loc_data = get_case_by_coordinate(current_date, selected_strains_arr)

    for key, data in loc_data.items():
        init_data[key] = {
            "latitude": data["latitude"],
            "longitude": data["longitude"],
            "state": data["state"],
            "initN": default_population,
            "intensity": data["case_count"]
        }

    for location, data in init_data.items():

        # running the network model
        
        center_lat = data["latitude"]
        center_lon = data["longitude"]

        G_normal = create_graph(center_lat, center_lon)
        init_N = get_init_N(data["state"])

        # run model for each location
        model = SEIRSNetworkModel(initN   = init_N,
            G       = G_normal,
            beta    = default_beta,
            sigma   = default_sigma,
            gamma   = default_gamma,
            initI = data["intensity"]
        )

        model.run(T = predictive_period, verbose=False)

        for i in range(1, predictive_period):
            date_key = (current_date + timedelta(days=i)).strftime('%Y-%m-%d')

            # need to initalise if date is not alr in dictionary
            if date_key not in predictive_map_data:
                predictive_map_data[date_key] = []

            # add predicted infection data to dictionary
            predictive_map_data[date_key].append({
                "latitude": data["latitude"],
                "longitude": data["longitude"],
                "intensity": round(model.numI[i*10]),
                "state": data["state"],
                "numS": round(model.numS[i*10]),
                "numE": round(model.numE[i*10]),
                "numR": round(model.numR[i*10])
            })
            # print(predictive_map_data[date_key])

    return jsonify(predictive_map_data)

def update_selected_strains(container_id, label, selected):
    global selected_strains
    if label == 'all' or label == 'none':
        selected_strains[container_id] = selected_strains[label].copy()
    else:
        selected_strains[container_id][label] = selected


# variant filter for heatmap
@app.route('/filter', methods=['GET'])
def filter_variant():

    """"
    data from frontend in the format
    {
        "label": 'alpha',
        "selected": 'true',
        'containerId': 'left'
    }
    """
    print("caught filter change")

    label = request.args.get('label')
    selected = request.args.get('selected')
    containerId = request.args.get('containerId')

    print("label:", label)
    print("selected:", selected)
    print("containerId:", containerId)

    update_selected_strains(containerId, label, selected)

    return "success"


def create_default_state():
     # Define the expected states and strains
    expected_states = ['Australia', 'New South Wales', 'Victoria', 'Queensland', 'Western Australia', 'Tasmania', 'Northern Territory', 'Australian Capital Territory', 'South Australia']
    strains = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Omicron']

    # Initialize the dictionary with default values
    return {state: {strain: 0 for strain in strains} for state in expected_states}


# graph showing distribution of infections for variant strains
# graph showing distribution of infections for variant strains
@app.route('/graphdata', methods=['GET'])
def variant_pie_chart():
    start_time = time.time()
    # date = request.args.get('date')
    end_date = datetime.strptime('2023-12-30', '%Y-%m-%d').date()
    # start_date = datetime.strptime('2021-12-30', '%Y-%m-%d').date()

    graph_data = get_all_time_case_pie_chart()

    result_graph_data = {}

    global selected_strains

    selected_strains_dict = selected_strains['m']
    selected_strains_arr = [strain for strain, selected in selected_strains_dict.items() if selected == 'true']

    for date, states_info in graph_data.items():

        default_states = create_default_state()

        for state, strains_info in states_info.items():
            if state in default_states:
                for strain, count in strains_info.items():
                    # Only add to australia if strain is selected
                    if strain in selected_strains_arr:
                        default_states[state][strain] += count
                        # Also add this count to the 'Australia' total
                        default_states['Australia'][strain] += count


        result_graph_data[date] = default_states


    end_time = time.time()
    execution_time = end_time - start_time
    print(f"Execution time: {execution_time} seconds")
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

    # # Now call load_data() without blocking the main thread
    # load_data()


    # ONLY IF RUNNING BACKEND IN TERMINAL
    with app.app_context():
        app.run(debug=True, host='0.0.0.0', port=8964)