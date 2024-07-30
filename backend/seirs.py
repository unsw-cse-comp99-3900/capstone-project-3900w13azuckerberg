from seirsplus.models import *
import networkx as nx

#SIGMA = 1/5.2
#GAMMA = 1/10
MU_I  = 0.002

R0    = 2.5
#BETA  = 1/(1/GAMMA) * R0 

BETA = 0.9994680678176857
SIGMA = 0.05893301173140339
GAMMA = 0.9787453097779406
graph = nx.Graph()

model = SEIRSModel(initN   = 28997000,
                   G       = graph,
                   beta    = BETA, 
                   sigma   = SIGMA, 
                   gamma   = GAMMA, 
                   mu_I    = MU_I,
                   mu_0    = 0, 
                   nu      = 0, 
                   xi      = 0,
                   beta_Q  = 0.5*(BETA), 
                   sigma_Q = SIGMA, 
                   gamma_Q = GAMMA, 
                   mu_Q    = MU_I,
                   theta_E = 0, 
                   theta_I = 0, 
                   psi_E   = 1.0, 
                   psi_I   = 1.0,
                   initI   = 15309, 
                   initE   = 0, 
                   initQ_E = 0, 
                   initQ_I = 0, 
                   initR   = 0, 
                   initF   = 0)


model.run(T=1460)

for i in range(1,1460, 100):
    print("Total num infected at t=", i, "is", model.total_num_infected(t_idx=i))

model.figure_infections(plot_percentages=False)

# ref_model = SEIRSModel(beta=BETA, sigma=SIGMA, gamma=GAMMA, mu_I=MU_I, initI=100, initN=2700000) 
# ref_model.run(T=300)