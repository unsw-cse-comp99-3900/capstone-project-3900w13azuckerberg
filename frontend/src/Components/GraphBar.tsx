import React, { useState } from "react";
import "./GraphBar.css";
import GraphButton from "./GraphButton";
import PieChart from "./PieChart";
import LineChart from "./LineChart";
import BarChart from "./barChart";
import { BarItem, PieItem, LineItem, PolicyData } from "./types";
import PolicyGraph from "./policyGraph";
interface GraphProps {
  pieData: PieItem[],
  lineData: LineItem[],
  policies: PolicyData,
  barData: BarItem, 
  predict: boolean,
  setPolicies: (policies: PolicyData) => void;
  token: boolean;
  onFilterChange: (token: boolean) => void;
  containerId: string;
}


const GraphBar: React.FC<GraphProps> = ({ barData, pieData, lineData, policies, predict, setPolicies, token, onFilterChange, containerId}) => {

  const [showGraph, setShowGraph] = useState(false);

  const handleButtonClick = () => {
    setShowGraph(!showGraph);
  };

  return (
    <div className={`outer ${showGraph ? "open" : ""}`}>
      <div id="buttonBar">
        <GraphButton onClick={handleButtonClick} />
      </div>
      <div className={`wrapper ${showGraph ? "open" : ""}`}>
        <div className="graphBox">
          {predict ? (
            <PolicyGraph 
              policies={policies} 
              setPolicies={setPolicies} 
              token={token}
              onFilterChange={onFilterChange}
              containerId={containerId}
            />
          ) : (
            <PieChart pieData={pieData}/>
          )}
        </div>
        <div className="graphBox">
          <LineChart lineData={lineData}/>
        </div>
        <div className="graphBox">
          <BarChart barData={barData} />
        </div>
      </div>
    </div>
  );
}

export default GraphBar;
