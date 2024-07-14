from seirsplus.models import *
from seirsplus.networks import *
from seirsplus.sim_loops import *
from seirsplus.utilities import *
import networkx

SIGMA = 1/5.2
GAMMA = 1/10
MU_I  = 0.002

R0    = 2.5
BETA  = 1/(1/GAMMA) * R0 

model = SEIRSModel(initN   = 1000000,
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
                   initI   = 10000, 
                   initE   = 0, 
                   initQ_E = 0, 
                   initQ_I = 0, 
                   initR   = 0, 
                   initF   = 0)

checkpoints = {'t':       [30, 90], 
               'beta':    [BETA*0.5, BETA], 
               'theta_E': [0.02, 0.02], 
               'theta_I': [0.02, 0.02]
              }

model.run(T=300, checkpoints=checkpoints)

model.figure_infections(vlines=checkpoints['t'], ylim=0.25)