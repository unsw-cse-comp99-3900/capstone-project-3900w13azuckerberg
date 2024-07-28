import networkx as nx
import numpy as np
from seirsplus.models import SEIRSNetworkModel
import matplotlib.pyplot as plt

# SEIRS Model parameters (example values)
beta = 0.25
sigma = 1/5.2
gamma = 1/10
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
latitudes = np.linspace(center_lat - degree_range / 2, center_lat + degree_range / 2, num=3)  # 3 points for clarity
longitudes = np.linspace(center_lon - degree_range / 2, center_lon + degree_range / 2, num=3)  # 3 points for clarity

# Create a grid of nodes
G_normal = nx.Graph()
for lat in latitudes:
    for lon in longitudes:
        node_id = f"{lat}_{lon}"
        G_normal.add_node(node_id, pos=(lat, lon))

# Add edges based on proximity or some interaction criteria
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
#plt.show()

# Initialize SEIRS model
model = SEIRSNetworkModel(G=G_normal, beta=beta, sigma=sigma, gamma=gamma, mu_I=0.0004, p=0.5,
                          theta_E=0.02, theta_I=0.02, phi_E=0.2, phi_I=0.2, psi_E=1.0, psi_I=1.0, q=0.5,
                          initI=1)

# Function to print coordinates and number of cases at each node
def print_cases_at_each_node(model, G):
    cases_per_node = {node: 0 for node in G.nodes}
    for node in range(len(model.X)):
        if model.X[node] == 1:  # If the node is infected
            node_id = list(G.nodes)[node]
            cases_per_node[node_id] += 1
    
    for node, count in cases_per_node.items():
        pos = G.nodes[node]['pos']
        pos = (float(pos[0]), float(pos[1]))
        print(f"Node {node} at coordinates {pos} has {count} cases.")

# Run the model and print cases at each node
T = 300
for t in range(T):
    model.run_iteration()
    if t % 10 == 0:  # Print every 10 time steps for clarity
        print(f"Time step {t}:")
        print_cases_at_each_node(model, model.G)

