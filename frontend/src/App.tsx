import React, { useState, useEffect } from "react";
import "./App.css";
import HeatMap from "./Components/map";
import Filters from "./Components/filters";
import Slider from "./Components/slider";
import GraphBar from "./Components/GraphBar";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import axios from "axios";

function App() {
  const [refetch, triggerRefetch] = useState(false);
  const [heatMapData, setHeatMapData] = useState<[number, number, number][]>(
    [],
  );
  const [date, setdate] = useState(new Date("2020-01-01"));
  const [location, setLocation] = useState("all");

  useEffect(() => {
    // Function to fetch heat map data from the backend
    const fetchData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/map", {});
        const data = response.data.data;
        const match = data.find((day: any) => day.date.toString() === date);
        // Transform the data into heat map format
        const heatMapPoints: [number, number, number][] = match.cases.map(
          (point: any) => [point.latitude, point.longitude, point.intensity],
        );

        setHeatMapData(heatMapPoints); // Update state with fetched data
      } catch (error) {
        console.error("Error fetching heat map data:", error);
      }
    };

    fetchData();
  }, [refetch, date]);

  const handleDateChange = (date: Date) => {
    setdate(date);
  };

  return (
    <MantineProvider>
      <div className="App">
        <GraphBar />
        <HeatMap heatMapData={heatMapData} />
        <Slider date={date} onDateChange={handleDateChange} />
        <Filters token={refetch} onFilterChange={triggerRefetch} />
      </div>
    </MantineProvider>
  );
}

export default App;
