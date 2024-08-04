import React from 'react';
import { PolicyData } from './types';
import './policy.css'
import axios from 'axios';
import CustomTooltip from './customTooltip';

interface PolicySummaryProps {
  policies: PolicyData;
  setPolicies: (policies: PolicyData) => void;
  token: boolean;
  onFilterChange: (token: boolean) => void;
  containerId: string;
}

const PolicySummary: React.FC<PolicySummaryProps> = ({ policies, setPolicies, token, onFilterChange, containerId }) => {
  
  // query to remove policy from the prediction model
  const handleRemovePolicy = async (state: string) => {
    try {
      // forces map and graph to update
      onFilterChange(!token);
      const response = await axios.get("http://127.0.0.1:5001/delete_policy", {
        params: {
          state,
          containerId, // M left or right
        }
      });

      // update summary
      const newPolicies = { ...policies };
      delete newPolicies[state];
      setPolicies(newPolicies);
  
      console.log("Deleted Policy:", response.data);

    } catch (error) {
      console.error("Error:", error);
    }
  };
  
  
  return (
    <div className="policy-summary">
      <h2>Policy Summary</h2>
      {Object.entries(policies).map(([state, policy]) => (
        <div key={state} className="policy-item">
          <h3>{state}
            <CustomTooltip label="Remove Policy">
              <div>
                <i className="material-icons cross" onClick={() => handleRemovePolicy(state)}>
                    close
                </i>
              </div>
            </CustomTooltip>
          </h3>
          <p>{`${policy.policy}: ${policy.startDate} - ${policy.endDate}`}</p>
        </div>
      ))}
    </div>
  );
};

export default PolicySummary;