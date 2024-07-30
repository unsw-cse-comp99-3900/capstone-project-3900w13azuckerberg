from datetime import datetime
import time
from flask import Flask, redirect, request, jsonify, url_for
from flask_migrate import Migrate
from flask_cors import CORS
from dotenv import load_dotenv
from config import Config
from data_loader import load_into_db
from db_manager import get_all_case_by_coordinate, get_all_time_case_pie_chart, get_case_by_coordinate, init_db, get_all_case_by_date
from model import db
from datetime import datetime, timedelta
from seirsplus.models import *
import threading
from seirsplus.networks import custom_exponential_graph
import networkx as nx
from network import create_graph
# from basic_seirs import get_predictive_data

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

# Database configuration
app.config.from_object(Config)

init_db(app)

migrate = Migrate(app, db)

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

selected_policies = {
    "left": {}, 
    "right": {},
    "m": {}
}

# Route for the home page
@app.route('/')
def home():
    return "Welcome to COVID Compass!"

@app.route('/test', methods=['GET'])
def mytest():
    print("Starting my test...")
    start_time = time.time()

    results = get_all_case_by_date()

    end_time = time.time()
    execution_time = end_time - start_time
    print(f"Execution time: {execution_time} seconds")
    return jsonify(results)

@app.route('/load_data', methods=['GET'])
def load_data():
    """This function should ONLY be called to manually load data into DB

    Returns:
        redirect: redirect to home
    """
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
    

    # dictionary to store map data
    predictive_map_data = {}

    # Initialise dictionary to store intial model parameters into
    init_data = {}

    # for each location in the db
    # set beta, sigma, gamma
    default_population = 10000
    sigma = 1/5.2
    gamma = 1/10
    beta = 0.25

    social_distancing_beta = 0.15
    lockdown_beta = 0.05

    # beta = 0.9994680678176857
    # sigma = 0.05893301173140339
    # gamma = 0.9787453097779406

    predictive_period = 365 # one year of prediction

    global selected_strains

    selected_strains_dict = selected_strains[containerId]
    containerId = request.args.get('containerId')

    # selected_strains_dict = selected_strains['all']
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

        # run model for each location

        model = SEIRSNetworkModel(G=G_normal, beta=beta, sigma=sigma, gamma=gamma, mu_I=0.0004, p=0.5,
                           theta_E=0.02, theta_I=0.02, phi_E=0.2, phi_I=0.2, psi_E=1.0, psi_I=1.0, q=0.5,
                           initI=data["intensity"], initE=5, initR=2)

        if bool(selected_policies[containerId][data["state"]]):
            if (selected_policies[containerId][data["state"]]["policy"] == 'Social Distancing'):
                selected_beta = social_distancing_beta
            else:
                selected_beta = lockdown_beta
            
            policy_start = selected_policies[containerId][data["state"]]["start_date"]
            policy_end = policy_start = selected_policies[containerId][data["state"]]["end_date"]

            checkpoints = {
                't':       [policy_start, policy_end], 
                'beta':    [selected_beta, beta], 
                'theta_E': [0.02, 0.02], 
                'theta_I': [0.02, 0.02]
            }

            model.run(T = predictive_period, checkpoints=checkpoints, verbose=False)
        else: 
            model.run(T = predictive_period, verbose=False)

        model.run(T = predictive_period, verbose=False)

        for i in range(1, predictive_period):

            date_key = (current_date + timedelta(days=i)).strftime('%Y-%m-%d')

            # need to initalise if date is not alr in dictionary
            if date_key not in predictive_map_data:
                predictive_map_data[date_key] = []

            # Accessing the data for the current time step
            numI = model.numI[i] if i < len(model.numI) else 0
            numS = model.numS[i] if i < len(model.numS) else 0
            numE = model.numE[i] if i < len(model.numE) else 0
            numR = model.numR[i] if i < len(model.numR) else 0
            # print(f"for time step {i}, numI is {numI}, numS is {numS}, numE is {numE}, numR is {numR}")

            predictive_map_data[date_key].append({
                "latitude": data["latitude"],
                "longitude": data["longitude"],
                "intensity": round(numI),
                "state": data["state"],
                "numS": round(numS),
                "numE": round(numE),
                "numR": round(numR)
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


@app.route('/policies', methods=['GET'])
def select_policy():
    state = request.args.get('state')
    policy_start = request.args.get('startDate')
    policy_end = request.args.get('endDate')
    policy = request.args.get('policy')
    containerId = request.args.get('containerId')

    start_date_obj = datetime.strptime(policy_start, "%Y-%m-%d")
    end_date_obj = datetime.strptime(policy_end, "%Y-%m-%d")

    reference_date = datetime.strptime('2024-4-30', '%Y-%m-%d')
    start_date_days = (start_date_obj - reference_date).days
    end_date_days = (end_date_obj - reference_date).days

    policy_information = {
        "start_date": start_date_days,
        "end_date": end_date_days,
        "policy": policy
    }

    global selected_policies

    selected_policies[containerId][state] = policy_information
    return jsonify(selected_policies)

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

    containerId = request.args.get('containerId')
    selected_strains_dict = selected_strains[containerId]
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


def run_server():
    app.run(debug=True)

# if __name__ == '__main__':
#     run_server()

data_loaded = False

@app.before_request
def before_request():
    global data_loaded
    if not data_loaded:
        load_data()
        data_loaded = True

if __name__ == '__main__':
#     # Start the Flask server in a separate thread
#     server_thread = threading.Thread(target=run_server)
#     server_thread.start()

#     # Now call load_data() without blocking the main thread
    #load_data()
    
    # ONLY IF RUNNING BACKEND IN TERMINAL
    with app.app_context():
        app.run(debug=True, host='0.0.0.0', port=8963)




