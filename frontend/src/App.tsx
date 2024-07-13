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
  const [isLoading, setIsLoading] = useState(false);
  const [showCompare, setShowCompare] = useState(false);

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
            <div className="left">
              <Main setIsLoading={setIsLoading} date={date} showCompare={showCompare} setShowCompare={setShowCompare}/>
            </div>
            <div className="right">
              <Main setIsLoading={setIsLoading} date={date} showCompare={showCompare} setShowCompare={setShowCompare}/>
            </div>
          </div>
          ) : (
          <div>
            <Main setIsLoading={setIsLoading} date={date} showCompare={showCompare} setShowCompare={setShowCompare}/>
          </div>
        )}
      </div> 
    </MantineProvider>
  );
}

export default App;


