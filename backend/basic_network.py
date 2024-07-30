from seirsplus.models import *
from seirsplus.networks import custom_exponential_graph
import networkx as nx
import matplotlib.pyplot as plt

numNodes = 10000
baseGraph    = networkx.barabasi_albert_graph(n=numNodes, m=9)
G_normal     = custom_exponential_graph(baseGraph, scale=100)
# Social distancing interactions:
G_distancing = custom_exponential_graph(baseGraph, scale=10)
# Quarantine interactions:
G_quarantine = custom_exponential_graph(baseGraph, scale=5)

def plot_graph(G, title):
    plt.figure(figsize=(12, 8))
    pos = nx.spring_layout(G)  # Use spring layout for visualization
    nx.draw(G, pos, node_size=10, node_color='blue', edge_color='gray', alpha=0.5)
    plt.title(title)
    plt.show()

#plot_graph(baseGraph, 'Barabási-Albert Graph')

model = SEIRSNetworkModel(G=G_normal, beta=0.155, sigma=1/5.2, gamma=1/12.39, mu_I=0.0004, p=0.5,
                          theta_E=0.02, theta_I=0.02, phi_E=0.2, phi_I=0.2, psi_E=1.0, psi_I=1.0, q=0.5,
                          initI=10)

#checkpoints = {'t': [20, 100], 'G': [G_distancing, G_normal], 'p': [0.1, 0.5], 'theta_E': [0.02, 0.02], 'theta_I': [0.02, 0.02], 'phi_E':   [0.2, 0.2], 'phi_I':   [0.2, 0.2]}

model.run(T=10)
model.figure_infections(plot_percentages=False)

# SEIRS Model parameters (example values)
beta = 0.25
sigma = 1/5.2
gamma = 1/10
# beta = 0.9994680678176857
# sigma = 0.05893301173140339
# gamma = 0.9787453097779406
mu_I = 0.01
P = 0.5
Q = 0.1
BETA_Q = 0.3
SIGMA_Q = 0.1
GAMMA = 0.1

# Define the center of Sydney
# center_lat = -33.865143
# center_lon = 151.209900

# G_normal = create_graph(-33.865143, 151.209900)

# # Initialize SEIRS model
# model = SEIRSNetworkModel(G=G_normal, beta=beta, sigma=sigma, gamma=gamma, mu_I=0.0004, p=0.5,
#                           theta_E=0.02, theta_I=0.02, phi_E=0.2, phi_I=0.2, psi_E=1.0, psi_I=1.0, q=0.5,
#                           initI=1, initE=1, initR=1)



# # create dictionary to store the number of cases at each node
# cases_per_node = {node: 0 for node in model.G.nodes}

# # Function to print coordinates and number of cases at each node
# def print_cases_at_each_node(model, G):
    
#     print(f"cases per node is {cases_per_node}")
#     print(f"model.X is {model.X}")

#     for node in range(len(model.X)):
#         #print((G.nodes)[node])
#         if model.X[node] == model.I:  # If the node is infected
#             node_id = list(G.nodes)[node]
#             cases_per_node[node_id] += 1
#             print(f"the node id is {node_id} with cases {cases_per_node[node_id]}")
    
#     for node, count in cases_per_node.items():
#         pos = G.nodes[node]['pos']
#         pos = (float(pos[0]), float(pos[1]))
#         name = G.nodes[node]['name']
#         print(f"{name} at coordinates {pos} has {count} cases.")

# # Run the model and print cases at each node
# T = 200
# for t in range(T):
#     model.run_iteration()
#    # if t % 10 == 0:  # Print every 10 time steps for clarity
#     print(f"Time step {t}:")
#     print_cases_at_each_node(model, model.G)

# model.figure_infections(plot_percentages=False, plot_S='line', plot_E='line', plot_I='line', plot_R='line', plot_F='line',
#                        combine_D=False)