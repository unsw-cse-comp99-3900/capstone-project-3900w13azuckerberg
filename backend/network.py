import networkx as nx
import numpy as np
from seirsplus.models import SEIRSNetworkModel
import matplotlib.pyplot as plt

# convert seconds to degrees (1 degree = 3600 seconds)
def create_graph(center_lat, center_lon):
    seconds_range = 100
    degree_range = seconds_range / 3600.0

    # 4x4 graph
    latitudes = np.linspace(center_lat - degree_range / 2, center_lat + degree_range / 2, num=8)  
    longitudes = np.linspace(center_lon - degree_range / 2, center_lon + degree_range / 2, num=8) 

    # Create a grid of nodes
    G_normal = nx.Graph()
    node_counter = 0
    for lat in latitudes:
        for lon in longitudes:
            G_normal.add_node(node_counter, pos=(lat, lon), name=f"Node {node_counter}")
            node_counter += 1

    # add edges based on proximity
    threshold_distance = 0.1  # can change the threshold
    for node1 in G_normal.nodes:
        for node2 in G_normal.nodes:
            if node1 != node2:
                pos1 = np.array(G_normal.nodes[node1]['pos'])
                pos2 = np.array(G_normal.nodes[node2]['pos'])
                distance = np.linalg.norm(pos1 - pos2)
                if distance < threshold_distance:
                    G_normal.add_edge(node1, node2)

    return G_normal