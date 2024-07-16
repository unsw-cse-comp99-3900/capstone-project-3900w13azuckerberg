import React, { useState } from "react";
import "./GraphBar.css";
import GraphButton from "./GraphButton";
import PieChart from "./PieChart";
import LineChart from "./LineChart";
import BarChart from "./barChart";
import { PieItem, LineItem } from "./types";
interface GraphProps {
  pieData: PieItem[],
  lineData: LineItem[],
}


const GraphBar: React.FC<GraphProps> = ({ pieData, lineData}) => {

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
          <PieChart pieData={pieData}/>
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
