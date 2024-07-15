import React, { useState, useEffect } from "react";
import "./GraphBar.css";
import axios from "axios";
import GraphBar from "./GraphBar";
import HeatMap from "./map";
import Filters from "./filters";
import "./main.css"

interface MainProps {
	setIsLoading: (token: boolean) => void;
	date: Date;
	showCompare: boolean;
	setShowCompare: (token: boolean) => void;
	containerId: string;
}

interface MapData {
	[date: string]: PointArray[];
  }
  
interface Point {
latitude: number;
longitude: number;
intensity: number;
state?: string;
}

type PointArray = [number, number, number];

const Main: React.FC<MainProps> = ({ setIsLoading, date, showCompare, setShowCompare, containerId }) => {

	const [refetch, triggerRefetch] = useState(false);
	const [allMapData, setAllMapData] = useState<MapData>({});
	const [location, setLocation] = useState("all");
	const [mapData, setMapData] = useState<[number, number, number][]>([]);


	const handleCompareToggle = () => {
		setShowCompare(!showCompare);
	};
    
    useEffect(() => {
      // Function to fetch heat map data from the backend
		const fetchData = async () => {
			setIsLoading(true);
			try {
			const response = await axios.get("http://127.0.0.1:5001/map", {});
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
      if (Object.keys(allMapData).length === 0 || refetch) {
        fetchData();
      }
    }, [refetch]);
  
    useEffect(() => {
      const dateString = date.toISOString().split('T')[0];
      setMapData(allMapData[dateString] || []);
      console.log("Data for selected date:", allMapData[dateString] || []);
    }, [date, allMapData]);
  

  return (
    <div id="body">
		<GraphBar />
		<HeatMap showCompare={showCompare} containerId={containerId} mapData={mapData} updateState={setLocation} currentState={location}/>
		<Filters token={refetch} 
			onFilterChange={triggerRefetch}
			onCompareToggle={handleCompareToggle}
			showCompare={showCompare} 
		/>
	</div>
  );
}

export default Main;
