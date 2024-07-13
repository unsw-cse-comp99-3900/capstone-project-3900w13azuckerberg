
from datetime import datetime, timedelta
# from db_manager import db, get_case_by_loc
from model import VirusData



def get_init_model_param():
    
    # Initialise dictionary to store intial model parameters into
    init_data = {}

    # for each location in the db
    # set beta, sigma, gamma

    default_sigma = 1/5.2
    default_gamma = 1/10
    default_beta = 0.25
    default_population = 10000

    # current_date = datetime.strptime('2024-4-30', '%Y-%m-%d').date()

    # loc_cases = get_case_by_loc(VirusData, current_date)

    mock_loc_data = {
        "Location1": {
            "latitude": 1, 
            "longitude": 2, 
            "intensity": 1, 
            "state": "NSW"
        },
        "Location2": {
            "latitude": -1,
            "longitude": 2,
            "intensity": 5,
            "state": "VIC"
        }
    }


    for key, data in mock_loc_data.items():
        init_data[key] = {
            "latitude": data["latitude"],
            "longitude": data["longitude"],
            "beta": default_beta,
            "sigma": default_sigma,
            "gamma": default_gamma,
            "initN": default_population,
            "initI": data["intensity"]
        }

    # print(init_data)

    return init_data


result = get_init_model_param()
print(result)
    # initN - population of location
    # initI - get from db 
