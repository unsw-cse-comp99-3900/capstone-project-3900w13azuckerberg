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