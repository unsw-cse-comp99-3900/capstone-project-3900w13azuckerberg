import React, { useState } from "react";
import "./GraphBar.css";
import GraphButton from "./GraphButton";
import PieChart from "./PieChart";
import LineChart from "./LineChart";
import BarChart from "./barChart";

interface GraphProps {
  pieData: PieItem[],
  lineData: LineItem[],
}

interface PieItem {
	id: string;
	label: string;
	value: number;
	color: string;
}

interface DataPoint {
	x: string;
	y: number;
}
  
interface LineItem {
	id: string;
	color: string;
	data: DataPoint[];
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
