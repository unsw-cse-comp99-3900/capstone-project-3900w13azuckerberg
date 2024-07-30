import numpy as np
from scipy.optimize import minimize
from scipy.integrate import odeint
import pandas as pd

# converting csv to df and convert 'date' to datetime
df = pd.read_csv("raw_data/cleaned_data.csv")
df['date'] = pd.to_datetime(df['date'])

# Contact rate, incubation rate, recovery rate (1/days) for beta, sigma and gamma
initial_params = [25, 1/5.2, 1/10]

def get_parameters(state):
    state_cases = df[df['division'] == state]

    # group by date
    daily_cases = state_cases.groupby('date').size().reset_index(name='cases')

    # Initial conditions

    # initial population as at 2020-06-30 (ABS)
    if state == "South Australia":
        N = 1769300
    elif state == "Western Australia":
        N = 2661900 
    elif state == "Northern Territory":
        N = 233000
    elif state == "New South Wales":
        N = 8164100
    elif state == "Victoria":
        N = 6694900
    elif state == "Tasmania":
        N = 540600
    elif state == "Australian Capital Territory":
        N = 431100
    elif state == "Queensland":
        N = 5174400 

    E0 = 100
    R0 = 0
    I0 = daily_cases['cases'].iloc[0] 
    S0 = N - I0 - E0 - R0

    # Time points (number of days)
    t = np.linspace(0, len(daily_cases)-1, len(daily_cases))
    y0 = S0, E0, I0, R0

    # Observed data (number of infected individuals)
    observed_data = daily_cases['cases'].values

    return y0, N, t, observed_data

# SEIR model differential equations
def deriv(y, t, N, beta, sigma, gamma):
    S, E, I, R = y
    dSdt = -beta * S * I / N
    dEdt = beta * S * I / N - sigma * E
    dIdt = sigma * E - gamma * I
    dRdt = gamma * I
    return dSdt, dEdt, dIdt, dRdt

# Define the objective function for optimization
def objective(params, y0, N, t, data):
    beta, sigma, gamma = params
    solution = odeint(deriv, y0, t, args=(N, beta, sigma, gamma))
    I = solution[:, 2]
    return np.sum((I - data) ** 2)

def minimise(state):
    # Get parameters
    y0, N, t, observed_data = get_parameters(state)

    # Perform the optimization
    result = minimize(objective, initial_params, args=(y0, N, t, observed_data), method='L-BFGS-B', bounds=[(0, 1), (0, 1), (0, 1)])
    beta_opt, sigma_opt, gamma_opt = result.x
    return beta_opt, sigma_opt, gamma_opt