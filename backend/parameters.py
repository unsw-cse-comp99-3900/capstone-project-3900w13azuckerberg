import numpy as np
from scipy.optimize import minimize
from scipy.integrate import odeint
import pandas as pd
from sklearn.metrics import mean_squared_error, mean_absolute_error
import matplotlib.pyplot as plt


# converting csv to df
df = pd.read_csv("cleaned_data.csv")

# Convert 'date' to datetime
df['date'] = pd.to_datetime(df['date'])
WA_cases = df[df['division'] == 'Western Australia']

# Group by date and calculate cumulative cases
daily_cases = WA_cases.groupby('date').size().reset_index(name='cases')
daily_cases['cumulative_cases'] = daily_cases['cases'].cumsum()

print(daily_cases)

# SEIR model differential equations
def deriv(y, t, N, beta, sigma, gamma):
    S, E, I, R = y
    dSdt = -beta * S * I / N
    dEdt = beta * S * I / N - sigma * E
    dIdt = sigma * E - gamma * I
    dRdt = gamma * I
    return dSdt, dEdt, dIdt, dRdt

# Initial conditions
N = 2700000  # put the total number of people in a particular state at the state of this data (2020)
I0 = daily_cases['cases'].iloc[0] # initial cases
E0 = 100       # Initial number of exposed individuals - will need to estimate either through using the network or making assumption
R0 = 0       # Initial number of recovered individuals
S0 = N - I0 - E0 - R0  # Initial number of susceptible individuals

# Contact rate, incubation rate, recovery rate (1/days) for beta, sigma and gamma
# used the initial values that they used in the package - should represent approximate numbers as observed during COVID
initial_params = [25, 1/5.2, 1/10]

# Time points (number of days)
t = np.linspace(0, len(daily_cases)-1, len(daily_cases))
y0 = S0, E0, I0, R0

# Define the objective function for optimization
def objective(params, *args):
    beta, sigma, gamma = params
    t, data = args
    solution = odeint(deriv, y0, t, args=(N, beta, sigma, gamma))
    I = solution[:, 2]
    return np.sum((I - data)**2)

# Observed data (number of infected individuals)
observed_data = daily_cases['cases'].values

# Perform the optimization
result = minimize(objective, initial_params, args=(t, observed_data), method='L-BFGS-B', bounds=[(0, 1), (0, 1), (0, 1)])
beta_opt, sigma_opt, gamma_opt = result.x

print(f'Estimated beta: {beta_opt}')
print(f'Estimated sigma: {sigma_opt}')
print(f'Estimated gamma: {gamma_opt}')

# run model using optimised parameters for validation purposes
ret = odeint(deriv, y0, t, args=(N, beta_opt, sigma_opt, gamma_opt))
S, E, I, R = ret.T

# Compute daily new infections and cumulative infections
new_infections = np.diff(I, prepend=0)
cumulative_infections = np.cumsum(new_infections)

# Plot observed data and model predictions
plt.figure(figsize=(10, 6))
plt.plot(daily_cases['date'], daily_cases['cumulative_cases'], label='Observed Cumulative Cases')
plt.plot(daily_cases['date'], cumulative_infections, label='Model Predicted Cumulative Infections')
plt.xlabel('Date')
plt.ylabel('Number of Infected Individuals')
plt.title('SEIR Model Validation')
plt.legend()
plt.grid(True)
plt.show()

# rmse = np.sqrt(mean_squared_error(daily_cases['cases'], I))
# mae = mean_absolute_error(daily_cases['cases'], I)
# print(f'RMSE: {rmse}')
# print(f'MAE: {mae}')

# Calculate RMSE and MAE for cumulative infections
rmse = np.sqrt(mean_squared_error(daily_cases['cumulative_cases'], cumulative_infections))
mae = mean_absolute_error(daily_cases['cumulative_cases'], cumulative_infections)
print(f'RMSE: {rmse}')
print(f'MAE: {mae}')
