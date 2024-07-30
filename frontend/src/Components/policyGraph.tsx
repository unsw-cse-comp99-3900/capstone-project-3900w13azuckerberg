import React from 'react';
import { PolicyData } from './types';
import './policy.css'
import axios from 'axios';

interface PolicySummaryProps {
  policies: PolicyData;
  setPolicies: (policies: PolicyData) => void;
  token: boolean;
  onFilterChange: (token: boolean) => void;
  containerId: string;
}

const PolicySummary: React.FC<PolicySummaryProps> = ({ policies, setPolicies, token, onFilterChange, containerId }) => {
  const handleRemovePolicy = async (state: string) => {
    try {
      onFilterChange(!token);
      const response = await axios.get("http://127.0.0.1:5001/delete_policy", {
        params: {
          state,
          containerId, // M left or right
        }
      });
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
            <i className="material-icons cross" onClick={() => handleRemovePolicy(state)}>
                close
            </i>
          </h3>
          <p>{`${policy.policy}: ${policy.startDate} - ${policy.endDate}`}</p>
        </div>
      ))}
    </div>
  );
};

export default PolicySummary;