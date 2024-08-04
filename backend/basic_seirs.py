from seirsplus.models import *
import networkx
from datetime import datetime, timedelta
from init_model_param import get_init_model_param
from app import app

def get_predictive_data():

    default_sigma = 1/5.2
    default_gamma = 1/10
    default_beta = 0.25
    default_population = 10000
    default_rdeath = 0.002

    predictive_length = 365 # one year of prediction

    predictive_data = {}

    curr_date = datetime.strptime('2024-6-30', '%Y-%m-%d').date()
    init_param = get_init_model_param()

    # print(init_param)


    for location, data in init_param.items():
        
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

        model.run(T = predictive_length)

        for i in range(1, predictive_length):
            date_key = curr_date + timedelta(days=i)
            
            # need to initalise if date is not alr in dictionary
            if date_key not in predictive_data:
                predictive_data[date_key] = [] 
            


            predictive_data[date_key].append({
                "lattitude": data["latitude"],
                "longtitude": data["longitude"],
                "state": data["state"],
                "numS": round(model.numS[i*10]),
                "numE": round(model.numE[i*10]),
                "numI": round(model.numI[i*10]),
                "numR": round(model.numR[i*10])
            })
    print(predictive_data)

    return predictive_data

# predictive_data = get_predictive_data()
# print(predictive_data)
    # model.figure_infections(vlines=checkpoints['t'], ylim=200000, plot_percentages=False)
