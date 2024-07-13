import networkx as nx
import numpy as np
from seirsplus.models import SEIRSNetworkModel
import matplotlib.pyplot as plt
import pandas as pd

# Step 1: Define the Network Structure
num_nodes = 200
base_graph = nx.barabasi_albert_graph(n=num_nodes, m=3)

# Define node attributes
populations = np.random.randint(1000, 3000, num_nodes)
initial_infections = np.random.randint(1, 100, num_nodes)

print("InitI:", initial_infections)

for i in range(num_nodes):
    base_graph.nodes[i]['population'] = populations[i]
    base_graph.nodes[i]['I'] = initial_infections[i]
    base_graph.nodes[i]['E'] = 10
    base_graph.nodes[i]['R'] = 20

# Recalculate beta to ensure adequate transmission
R0 = 2.5  # Basic reproduction number
gamma = 1/10  # Recovery rate, days^-1
beta = R0 * gamma  # Transmission rate should align with R0

# Step 2: Initialize Model Parameters with updated beta
model_params = {
    'beta': beta,
    'sigma': 1/5.2,
    'gamma': gamma,
    'mu_I': 0.002,  # Adjusted mortality rate to a more realistic figure
    'store_Xseries': True,
    # 'initI': initial_infections
}

# Step 3: Initialize and run the SEIRS Model with verbose output
model = SEIRSNetworkModel(G=base_graph, **model_params)

# Check if the infections are properly assigned
for i in range(num_nodes):
    print(f"Node {i}: Infected = {base_graph.nodes[i]['I']}")

model.run(T=300, verbose=True)

# Check average degree of the network
avg_degree = sum(dict(base_graph.degree()).values()) / num_nodes
print(f"Average Degree: {avg_degree}")

# Step 4: Extract and plot infection data
infections_per_node = (model.Xseries == model.I).astype(int)

print("Infections_per_node", infections_per_node)

# node_id = 5
# plt.figure(figsize=(10, 5))
# plt.plot(model.tseries, infections_per_node[:, node_id], label=f'Infections in Suburb {node_id}')
# plt.title(f'Infection Spread Over Time in Suburb {node_id}')
# plt.xlabel('Time')
# plt.ylabel('Number of Infectious Individuals')
# plt.legend()
# plt.show()


# print("Initial infections:", initial_infections.sum())
# print("Initial susceptible:", (populations - initial_infections).sum())

# # After running the model
# print("Total infections over time:", model.numI)

# # Plotting more details
# plt.figure(figsize=(10, 5))
# plt.plot(model.tseries, model.numI, label='Infected')
# plt.plot(model.tseries, model.numS, label='Susceptible')
# plt.plot(model.tseries, model.numR, label='Recovered')
# plt.title('Detailed SEIRS Dynamics')
# plt.xlabel('Time')
# plt.ylabel('Number of Individuals')
# plt.legend()
# plt.show()

