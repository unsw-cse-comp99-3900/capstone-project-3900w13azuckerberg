import React, { useState, useEffect } from "react";
import "./App.css";
import HeatMap from "./Components/map";
import Filters from "./Components/filters";
import Slider from "./Components/slider";
import GraphBar from "./Components/GraphBar";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import axios from "axios";
import "./Components/cover.css"

interface Point {
  latitude: number;
  longitude: number;
  intensity: number;
  state?: string;
}

type PointArray = [number, number, number];

interface MapData {
  [date: string]: PointArray[];
}

function App() {
  const [refetch, triggerRefetch] = useState(false);
  const [allMapData, setAllMapData] = useState<MapData>({});
  const [date, setdate] = useState(new Date("2023-12-28"));
  const [currentState, setCurrentState] = useState("all");
  const [mapData, setMapData] = useState<[number, number, number][]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Function to fetch heat map data from the backend
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("http://127.0.0.1:5000/map", {});
        const rawData: { [date: string]: Point[] } = response.data;
        const formattedData: MapData = {};

        for (const [key, value] of Object.entries(rawData)) {
          formattedData[key] = value.map(point => [
            point.latitude,
            point.longitude,
            point.intensity
          ]);
        }

        setAllMapData(formattedData);

        console.log("Heatmap data updated.");

      } catch (error) {
        console.error("Error fetching heat map data:", error);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [refetch]);

  useEffect(() => {
    const dateString = date.toISOString().split('T')[0];
    setMapData(allMapData[dateString] || []);
    console.log("Data for selected date:", allMapData[dateString] || []);

  }, [date, allMapData]);

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
        <GraphBar />
        <HeatMap mapData={mapData} updateState={setCurrentState} currentState={currentState} />
        <Slider date={date} onDateChange={handleDateChange} />
        <Filters token={refetch} onFilterChange={triggerRefetch} />
      </div>
    </MantineProvider>
  );
}

export default App;


