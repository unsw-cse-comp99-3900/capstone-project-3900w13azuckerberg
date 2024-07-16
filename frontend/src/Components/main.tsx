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

interface RegionData {
	[Strain:string]: number;
}
interface DateData {
	[State: string]: RegionData;
}

interface GraphData {
	[Date: string]: DateData; 
}
interface Point {
	latitude: number;
	longitude: number;
	intensity: number;
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
  

type PointArray = [number, number, number];

const Main: React.FC<MainProps> = ({ setIsLoading, date, showCompare, setShowCompare, containerId, predict, setPredict }) => {

	const colors: { [strain: string]: string } = {
		alpha: "#9B57D3",
		beta: "#665EB8",
		gamma: "#C39AE5",
		delta: "#92278F",
		omicron: "#6159AE"
	  };

	const [refetch, triggerRefetch] = useState("M");
	const [allMapData, setAllMapData] = useState<MapData>({});
	const [location, setLocation] = useState("all");
	const [mapData, setMapData] = useState<[number, number, number][]>([]);
	const [graphData, setGraphData] = useState<GraphData>();
	const [pieData, setPieData] = useState<PieItem[]>([]);
	const [lineData, setLineData] = useState<LineItem[]>([]);
	
	// Map use effect
    useEffect(() => {
      // Function to fetch heat map data from the backend
		const fetchData = async () => {
			setIsLoading(true);
			try {
				let response: AxiosResponse;
				if (!predict) {
					response = await axios.get("http://127.0.0.1:5000/map/", {
					params: {
						param1: refetch, // <- this will be either "M", "left", "right"
						}
					});
				} else {
					response = await axios.get("http://127.0.0.1:5000/predictive_map", {})
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
	

	// Graph use effect
	useEffect(() => {
		// Function to fetch heat map data from the backend
		const fetchData = async () => {
			setIsLoading(true);
			try {
				let response: AxiosResponse;
			//   if (!predict) {
				response = await axios.get("http://127.0.0.1:5000/graphdata/", {
				params: {
					param1: refetch, // <- this will be either "M", "left", "right"
					}
				});
			//   } else {
			// 	  response = await axios.get("http://127.0.0.1:5000/predictive_map", {})
				const rawData: GraphData = response.data;
				setGraphData(rawData);
				console.log("Graph data updated.");
	  
			} catch (error) {
			console.error("Error fetching Graph map data:", error);
			}
			  setIsLoading(false);
		  };
	  }, [refetch, predict]);

    useEffect(() => {
      const dateString = date.toISOString().split('T')[0];
      setMapData(allMapData[dateString] || []);
      console.log("Data for selected date:", allMapData[dateString] || []);
	  
    }, [date, allMapData]);

	useEffect(() => {
		if (graphData != null) {
			const dateString = date.toISOString().split('T')[0];
			let p: PieItem[] = [];
			const currData = graphData[dateString][(location == "all") ? "AUS" : location];
			Object.keys(currData).forEach((name) => p.push({
				id: name,
				label: name,
				value: currData[name],
				color: colors[name],
			}))
			setPieData(p);
		}

	}, [date, graphData])
  return (
    <div id="body">
		<GraphBar pieData={pieData} lineData={lineData} />
		<HeatMap showCompare={showCompare} containerId={containerId} mapData={mapData} updateState={setLocation} currentState={location}/>
		<Filters token={refetch} 
			onFilterChange={triggerRefetch}
			setShowCompare={setShowCompare}
			showCompare={showCompare} 
			predict={predict}
			setPredict={setPredict}
			containerId={containerId}
		/>
	</div>
  );
}

export default Main;
