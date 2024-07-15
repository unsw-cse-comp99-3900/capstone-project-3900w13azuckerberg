import React, { useState, useEffect } from "react";
import "./App.css";

import Main from "./Components/main";
import Slider from "./Components/slider";

import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "./Components/cover.css"

interface Point {
  latitude: number;
  longitude: number;
  intensity: number;
  state?: string;
}

type PointArray = [number, number, number];

function App() {
  const [date, setdate] = useState(new Date("2023-12-28"));
  const [currentState, setCurrentState] = useState("all");
  const [mapData, setMapData] = useState<[number, number, number][]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCompare, setShowCompare] = useState(false);

  // useEffect(() => {
  //   // Function to fetch heat map data from the backend
  //   const fetchData = async () => {
  //     setIsLoading(true);
  //     try {
  //       const response = await axios.get("http://127.0.0.1:5000/map", {});
  //       const rawData: { [date: string]: Point[] } = response.data;
  //       const formattedData: MapData = {};

  //       for (const [key, value] of Object.entries(rawData)) {
  //         formattedData[key] = value.map(point => [
  //           point.latitude,
  //           point.longitude,
  //           point.intensity
  //         ]);
  //       }

  //       setAllMapData(formattedData);

  //       console.log("Heatmap data updated.");

  //     } catch (error) {
  //       console.error("Error fetching heat map data:", error);
  //     }
  //     setIsLoading(false);
  //   };

  //   fetchData();
  // }, [refetch]);

  // useEffect(() => {
  //   const dateString = date.toISOString().split('T')[0];
  //   setMapData(allMapData[dateString] || []);
  //   console.log("Data for selected date:", allMapData[dateString] || []);

  // }, [date, allMapData]);
  const handleCompareToggle = () => {
    setShowCompare((prev) => !prev);
  };

  const handleDateChange = (date: Date) => {
    setdate(date);
  };

  return (
    <MantineProvider>
      <div className="App">
        {isLoading && (
          <div className="loading-overlay">
            <div className="spinner"></div> {/* Spinner added here */}
          </div>
        )}
        <Slider date={date} onDateChange={handleDateChange} />
        {showCompare ? (
          <div className="container">
            <div id="divider">
              </div>
            <div className="left">
              <Main containerId="left" setIsLoading={setIsLoading} date={date} showCompare={showCompare} setShowCompare={setShowCompare}/>
            </div>
            <div className="right">
              <Main containerId="right" setIsLoading={setIsLoading} date={date} showCompare={showCompare} setShowCompare={setShowCompare}/>
            </div>
          </div>
          ) : (
          <div>
            <Main containerId="M" setIsLoading={setIsLoading} date={date} showCompare={showCompare} setShowCompare={setShowCompare}/>
          </div>
        )}
      </div> 
    </MantineProvider>
  );
}

export default App;


