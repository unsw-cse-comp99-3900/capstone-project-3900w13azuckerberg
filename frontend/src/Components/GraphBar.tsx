import React, { useState } from "react";
import "./GraphBar.css";
import GraphButton from "./GraphButton";
import PieChart from "./PieChart";
import LineChart from "./LineChart";
import BarChart from "./barChart";
import { PieItem, LineItem, PolicyData } from "./types";
import PolicyGraph from "./policyGraph";
interface GraphProps {
  pieData: PieItem[],
  lineData: LineItem[],
  policies: PolicyData, 
  predict: boolean,
  setPolicies: (policies: PolicyData) => void;
}


const GraphBar: React.FC<GraphProps> = ({ pieData, lineData, policies, predict, setPolicies}) => {

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
            <PolicyGraph policies={policies} setPolicies={setPolicies}/>
          ) : (
            <PieChart pieData={pieData}/>
          )}
        </div>
        <div className="graphBox">
          <LineChart lineData={lineData}/>
        </div>
        <div className="graphBox">
          <BarChart />
        </div>
      </div>
    </div>
  );
}

export default GraphBar;
