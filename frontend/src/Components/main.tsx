import React, { useState, useEffect } from "react";
import "./GraphBar.css";
import axios, { AxiosResponse } from "axios";
import GraphBar from "./GraphBar";
import HeatMap from "./map";
import Filters from "./filters";
import "./main.css"
import { MapData, GraphData, Point, PieItem, LineItem } from "./types"
interface MainProps {
	setIsLoading: (token: boolean) => void;
	date: Date;
	showCompare: boolean;
	setShowCompare: (token: boolean) => void;
	containerId: string;
	predict: boolean;
	setPredict: (predict: boolean) => void;
}



const Main: React.FC<MainProps> = ({ setIsLoading, date, showCompare, setShowCompare, containerId, predict, setPredict }) => {

	const colors: { [strain: string]: string } = {
		alpha: "#9B57D3",
		beta: "#665EB8",
		gamma: "#C39AE5",
		delta: "#92278F",
		omicron: "#6159AE"
	};

	const [refetch, triggerRefetch] = useState(false);
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
					response = await axios.get("http://127.0.0.1:5000/map", {
					params: {
						containerId, // <- this will be either "M", "left", "right"
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
	

	// Graph use effect
	useEffect(() => {
		// Function to fetch heat map data from the backend
		const fetchGraphData = async () => {
			console.log("getting graph data");
			setIsLoading(true);
			try {
				let response: AxiosResponse;
			//   if (!predict) {
				response = await axios.get("http://127.0.0.1:5000/graphdata", {
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
		  fetchGraphData();
	}, [refetch, predict]);

    useEffect(() => {
      const dateString = date.toISOString().split('T')[0];
      setMapData(allMapData[dateString] || []);
      console.log("Data for selected date:", allMapData[dateString] || []);
	  
    }, [date, allMapData]);

	useEffect(() => {
		if (graphData != null) {
			const dateString = date.toISOString().split('T')[0];
			const currLocation = (location == "all") ? "AUS" : location;
			let p: PieItem[] = [];
			const currData = graphData[dateString][currLocation];
			Object.keys(currData).forEach((name) => p.push({
				id: name,
				label: name,
				value: currData[name],
				color: colors[name],
			}))
			setPieData(p);

			const sorted = Object.keys(graphData)
								 .filter(([d]) => d < dateString)
								 .sort(([date1], [date2]) => date1.localeCompare(date2));
			let l: LineItem[] = [];
			Object.keys(graphData[dateString]["all"]).forEach((name) => l.push({
				id: name,
				color: colors[name],
				data: [],
			})
			)
			sorted.forEach((d) => Object.keys(graphData[d][currLocation])
				  .forEach((strain) => l.find(item => item.id == strain)?.data.push({
					x: dateString,
					y: graphData[d][currLocation][strain],
				  })
			));

			setLineData(l);
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
