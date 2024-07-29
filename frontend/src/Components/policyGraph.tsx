import React from 'react';
import { PolicyData } from './types';
import './policy.css'

interface PolicySummaryProps {
  policies: PolicyData;
  setPolicies: (policies: PolicyData) => void;
}

const PolicySummary: React.FC<PolicySummaryProps> = ({ policies, setPolicies }) => {
  const handleRemovePolicy = (state: string) => {
    const newPolicies = { ...policies };
    delete newPolicies[state];
    setPolicies(newPolicies);
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