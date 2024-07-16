import React, { useState } from "react";
import "./App.css";
import Main from "./Components/main";
import Slider from "./Components/slider";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "./Components/cover.css"
import Legend from "./Components/legend";

function App() {
  const [date, setdate] = useState(new Date("2023-12-28"));
  const [isLoading, setIsLoading] = useState(false);
  const [showCompare, setShowCompare] = useState(false);

  const handleDateChange = (date: Date) => {
    setdate(date);
  };

  return (
    <MantineProvider>
      <div className="App">
        {isLoading && (
          <div className="loading-overlay">
            <div className="spinner"></div>
          </div>
        )}
        <div className="logo-container">
            <img src="logo.png" alt="logo" className="logo" />
            <Legend />
        </div>
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


