import React, { useState } from "react";
import "./GraphBar.css";
import GraphButton from "./GraphButton";
import PieChart from "./PieChart";
import LineChart from "./LineChart";
import BarChart from "./barChart";
function GraphBar() {
  const [showGraph, setShowGraph] = useState(false);

  const handleButtonClick = () => {
    setShowGraph(!showGraph);
  };

  return (
    <div className={`outer ${showGraph ? "open" : ""}`}>
      <div id="buttonBar">
        <GraphButton onClick={handleButtonClick} />
      </div>
      <div className="wrapper">
        <div className="graphBox">
          <PieChart />
        </div>
        <div className="graphBox">
          <LineChart />
        </div>
        <div className="graphBox">
          <BarChart />
        </div>
      </div>
    </div>
  );
}

export default GraphBar;
