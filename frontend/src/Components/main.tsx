import React, { useState, useEffect } from "react";
import "./GraphBar.css";
import axios, { AxiosResponse } from "axios";
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
	predict: boolean;
	setPredict: (predict: boolean) => void;
}

interface MapData {
	[date: string]: PointArray[];
  }
  
interface Point {
	latitude: number;
	longitude: number;
	intensity: number;
}

type PointArray = [number, number, number];

const Main: React.FC<MainProps> = ({ setIsLoading, date, showCompare, setShowCompare, containerId, predict, setPredict }) => {

	const [refetch, triggerRefetch] = useState(false);
	const [allMapData, setAllMapData] = useState<MapData>({});
	const [location, setLocation] = useState("all");
	const [mapData, setMapData] = useState<[number, number, number][]>([]);
    
    useEffect(() => {
      // Function to fetch heat map data from the backend
		const fetchData = async () => {
			setIsLoading(true);
			try {
				let response: AxiosResponse;
				if (!predict) {
					response = await axios.get("http://127.0.0.1:5000/map", {});
				} else {
					response = await axios.get("http://127.0.0.1:5000/predictive_map", {})
					console.log("predicted called");
				}
				const rawData: { [date: string]: Point[] } = response.data;
				const formattedData: MapData = {};
				
				for (const [key, value] of Object.entries(rawData)) {
					formattedData[key] = value.map(point => [
						point.latitude,
						point.longitude,
						point.intensity
					]);
				}
			console.log(formattedData);
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
    }, [refetch, predict]);
  
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
			setShowCompare={setShowCompare}
			showCompare={showCompare} 
			predict={predict}
			setPredict={setPredict}
		/>
	</div>
  );
}

export default Main;
