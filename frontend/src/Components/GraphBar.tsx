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

  // toggles the graphs open or closed
  const handleButtonClick = () => {
    setShowGraph(!showGraph);
  };

  return (
    <div className={`outer ${showGraph ? "open" : ""}`}>
      <div id="buttonBar">
        <GraphButton data-testid="graph-toggle" onClick={handleButtonClick} />
      </div>
      <div data-testid="wrapper" className={`wrapper ${showGraph ? "open" : ""}`}>
        <div className="graphBox">
          {predict ? (
            <PolicyGraph 
              policies={policies} 
              setPolicies={setPolicies} 
              token={token}
              onFilterChange={onFilterChange}
              containerId={containerId}
              data-testid="policy-graph"
            />
          ) : (
            <PieChart data-testid="pie-chart" pieData={pieData}/>
          )}
        </div>
        <div className="graphBox">
          <LineChart data-testid="line-chart" lineData={lineData}/>
        </div>
        <div className="graphBox">
          <BarChart data-testid="bar-chart" barData={barData} />
        </div>
      </div>
    </div>
  );
}

export default GraphBar;
