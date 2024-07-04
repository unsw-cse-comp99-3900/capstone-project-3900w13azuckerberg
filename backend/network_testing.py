import numpy as np
import matplotlib.pyplot as plt
from seirsplus.models import SEIRSNetworkModel
from seirsplus.networks import generate_demographic_contact_network


# Define the locations as nodes in a network
num_locations = 100
locations = range(num_locations)

# Create a demographic contact network
G, demographics = generate_demographic_contact_network(N=num_locations, network_type='random', demographic_data={'numNodes': num_locations, 'aveDegree': 10})


# Define initial conditions
initial_infected = np.zeros(num_locations)
initial_infected[:10] = 1  # Start with 10 infected locations

model = SEIRSNetworkModel(G=G, 
                          beta=0.155, sigma=1/5.2, gamma=1/12.39, 
                          initE=initial_infected)

# Run the simulation
model.run(T=200)

# Extract infection data
infection_data = model.numI
