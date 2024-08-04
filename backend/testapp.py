from datetime import datetime
import time
from flask import Flask, redirect, request, jsonify, url_for
from flask_migrate import Migrate
from flask_cors import CORS
from dotenv import load_dotenv
from config import Config
from data_loader import load_into_db, load_policy
from db_manager import get_all_case_by_coordinate, get_all_time_case_pie_chart, get_case_by_coordinate, init_db, get_all_case_by_date
from model import db
from datetime import datetime, timedelta
from seirsplus.models import *
import threading
from seirsplus.networks import custom_exponential_graph
import networkx as nx
from network import create_graph, create_lockdown_graph, create_social_distancing_graph

app = Flask(__name__)
CORS(app)



# Route for the home page
@app.route('/')
def home():
    return "Welcome to COVID Compass!"

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