import networkx as nx
import numpy as np
from seirsplus.models import SEIRSNetworkModel
import matplotlib.pyplot as plt
import pandas as pd

# Step 1: Define the Network Structure
# Create a network with 200 nodes, each representing a suburb
num_nodes = 200
base_graph = nx.barabasi_albert_graph(n=num_nodes, m=3)

# Define initial conditions for each node
initial_infections = np.random.randint(1, 10, num_nodes)  # Random initial infections for demonstration

# Step 2: Initialize Model Parameters
model_params = {
    'beta': 0.147,          # Infectious rate
    'sigma': 1/5.2,         # Incubation rate
    'gamma': 1/12.39,       # Recovery rate
    'mu_I': 0.0004,         # Mortality rate
    'initI': initial_infections,
    'initE': np.zeros(num_nodes),   # Initially, no one is exposed
    'initR': np.zeros(num_nodes),   # Initially, no one is recovered
    'initN': np.random.randint(1000, 3000, num_nodes),  # Random population for each suburb
    'store_Xseries': True
}

# Step 3: Initialize and run the SEIRS Model
model = SEIRSNetworkModel(G=base_graph, **model_params)
model.run(T=300)  # Simulate for 300 time units

# Step 4: Extract Infection Data Per Node
infections_per_node = (model.Xseries == model.I).astype(int)

# Step 5: Plotting example for the first node
node_id = 0  # Change node_id to see different suburbs
plt.figure(figsize=(10, 5))
plt.plot(model.tseries, infections_per_node[:, node_id], label=f'Infections in Suburb {node_id}')
plt.title(f'Infection Spread Over Time in Suburb {node_id}')
plt.xlabel('Time')
plt.ylabel('Number of Infectious Individuals')
plt.legend()
plt.show()

# # Step 6: Save the data to CSV for further analysis
# # Convert infection data to DataFrame
# df_infections = pd.DataFrame(infections_per_node, columns=[f'Suburb_{i}' for i in range(num_nodes)])
# df_infections['Time'] = model.tseries
# df_infections.to_csv('infections_over_time.csv', index=False)

# print("Simulation complete. Data saved to 'infections_over_time.csv'.")
