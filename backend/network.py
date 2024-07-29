import networkx as nx
import numpy as np
from seirsplus.models import SEIRSNetworkModel
import matplotlib.pyplot as plt

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
center_lat = -33.865143
center_lon = 151.209900

# Convert seconds to degrees (1 degree = 3600 seconds)
seconds_range = 100
degree_range = seconds_range / 3600.0

# Create latitude and longitude values within the defined range
latitudes = np.linspace(center_lat - degree_range / 2, center_lat + degree_range / 2, num=4)  
longitudes = np.linspace(center_lon - degree_range / 2, center_lon + degree_range / 2, num=4) 

# Create a grid of nodes
G_normal = nx.Graph()
node_counter = 0
for lat in latitudes:
    for lon in longitudes:
        G_normal.add_node(node_counter, pos=(lat, lon), name=f"Node {node_counter}")
        node_counter += 1

#Add edges based on proximity or some interaction criteria
# Note: For a small range like this, nodes will be very close to each other
threshold_distance = 0.1  # Example threshold
for node1 in G_normal.nodes:
    for node2 in G_normal.nodes:
        if node1 != node2:
            pos1 = np.array(G_normal.nodes[node1]['pos'])
            pos2 = np.array(G_normal.nodes[node2]['pos'])
            distance = np.linalg.norm(pos1 - pos2)
            if distance < threshold_distance:
                G_normal.add_edge(node1, node2)

# Draw the graph
pos = nx.get_node_attributes(G_normal, 'pos')  # Get positions
plt.figure(figsize=(10, 8))
nx.draw(G_normal, pos, node_size=50, with_labels=False, node_color='blue', edge_color='gray', alpha=0.7)
plt.title('Geographic Network')
plt.show()

# Initialize SEIRS model
model = SEIRSNetworkModel(G=G_normal, beta=beta, sigma=sigma, gamma=gamma, mu_I=0.0004, p=0.5,
                          theta_E=0.02, theta_I=0.02, phi_E=0.2, phi_I=0.2, psi_E=1.0, psi_I=1.0, q=0.5,
                          initI=1, initE=1, initR=1)

# Function to print coordinates and number of cases at each node

# create dictionary to store the number of cases at each node
cases_per_node = {node: 0 for node in model.G.nodes}

def print_cases_at_each_node(model, G):
    
    print(f"cases per node is {cases_per_node}")
    print(f"model.X is {model.X}")

    for node in range(len(model.X)):
        #print((G.nodes)[node])
        if model.X[node] == model.I:  # If the node is infected
            node_id = list(G.nodes)[node]
            cases_per_node[node_id] += 1
            print(f"the node id is {node_id} with cases {cases_per_node[node_id]}")
    
    for node, count in cases_per_node.items():
        pos = G.nodes[node]['pos']
        pos = (float(pos[0]), float(pos[1]))
        name = G.nodes[node]['name']
        print(f"{name} at coordinates {pos} has {count} cases.")

# Run the model and print cases at each node
T = 200
for t in range(T):
    model.run_iteration()
   # if t % 10 == 0:  # Print every 10 time steps for clarity
    print(f"Time step {t}:")
    print_cases_at_each_node(model, model.G)

model.figure_infections(plot_percentages=False, plot_S='line', plot_E='line', plot_I='line', plot_R='line', plot_F='line',
                        combine_D=False)