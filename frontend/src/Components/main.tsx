import React, { useState, useEffect } from "react";
import "./GraphBar.css";
import axios, { AxiosResponse } from "axios";
import GraphBar from "./GraphBar";
import HeatMap from "./map";
import Filters from "./filters";
import "./main.css"
import { MapData, GraphData, Point, PieItem, LineItem, PolicyData } from "./types"

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
		Alpha: "#9B57D3",
		Beta: "#665EB8",
		Gamma: "#C39AE5",
		Delta: "#92278F",
		Omicron: "#6159AE"
	};

	const [refetch, triggerRefetch] = useState(false);
	const [allMapData, setAllMapData] = useState<MapData>({});
	const [location, setLocation] = useState("Australia");
	const [mapData, setMapData] = useState<[number, number, number][]>([]);
	const [graphData, setGraphData] = useState<GraphData>({});
	const [pieData, setPieData] = useState<PieItem[]>([]);
	const [lineData, setLineData] = useState<LineItem[]>([]);
	const [policies, setPolicies] = useState<PolicyData>({});
	
	// Map useeffect when filters change
    useEffect(() => {
      // Function to fetch heat map data from the backend
		const fetchData = async () => {
			setIsLoading(true);
			console.log("Trying to get map");
			try {
				let response: AxiosResponse;
				if (!predict) {
					response = await axios.get("http://127.0.0.1:5001/map", {
					params: {
						containerId, // <- this will be either "M", "left", "right"
						}
					});
				} else {
					response = await axios.get("http://127.0.0.1:5001/predictive_map", {})
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
        fetchData();
    }, [refetch, predict]);
	

	// Graph use effect
	useEffect(() => {
		// Function to fetch heat map data from the backend
		const fetchGraphData = async () => {
			console.log("getting graph data");
			try {
				let response: AxiosResponse;
				response = await axios.get("http://127.0.0.1:5001/graphdata", {
				params: {
					containerId, // <- this will be either "M", "left", "right"
					}
				});

				const rawData: GraphData = response.data;
				setGraphData(rawData);
				console.log("Graph data updated.");
				console.log(rawData);
			} catch (error) {
			console.error("Error fetching Graph map data:", error);
			}
		  };
		  fetchGraphData();
	}, [refetch, predict]);

	// map useeffect when date changes
    useEffect(() => {
      const dateString = date.toISOString().split('T')[0];
      setMapData(allMapData[dateString] || []);
	//   console.log("New Date", dateString);
    //   console.log("Data for selected date:", allMapData[dateString] || []);
	  
    }, [date, allMapData]);

	useEffect(() => {
		if (graphData != null && Object.keys(graphData).length > 0) {
			const dateString = date.toISOString().split('T')[0];
			const currLocation = (location === "all") ? "Australia" : location;
			let p: PieItem[] = [];
			if (!graphData[dateString]) {
				graphData[dateString] = {
					"Australia": { Alpha: 0, Beta: 0, Delta: 0, Gamma: 0, Omicron: 0},
					"New South Wales": { Alpha: 0, Beta: 0, Delta: 0, Gamma: 0, Omicron: 0},
					"Queensland": { Alpha: 0, Beta: 0, Delta: 0, Gamma: 0, Omicron: 0},
					"Victoria": { Alpha: 0, Beta: 0, Delta: 0, Gamma: 0, Omicron: 0},
					"Northern Territory": { Alpha: 0, Beta: 0, Delta: 0, Gamma: 0, Omicron: 0},
					"Western Australia": { Alpha: 0, Beta: 0, Delta: 0, Gamma: 0, Omicron: 0},
					"South Australia": { Alpha: 0, Beta: 0, Delta: 0, Gamma: 0, Omicron: 0},
					"Australian Capital Territory": { Alpha: 0, Beta: 0, Delta: 0, Gamma: 0, Omicron: 0},
				};
			}
			console.log(dateString);
			const currData = graphData[dateString][currLocation];
			Object.keys(currData).forEach((name) => p.push({
				id: name,
				label: name,
				value: currData[name],
				color: colors[name],
			}))
			setPieData(p);

			const sorted = Object.keys(graphData)
								 .filter(d => d < dateString)
								 .sort((date1, date2) => date1.localeCompare(date2));
			console.log(sorted)
			let l: LineItem[] = [];
			Object.keys(graphData[dateString]["Australia"]).forEach((name) => l.push({
				id: name,
				color: colors[name],
				data: [],
			})
			)
			sorted.forEach((d) => Object.keys(graphData[d][currLocation])
				  .forEach((strain) => l.find(item => item.id === strain)?.data.push({
					x: d,
					y: graphData[d][currLocation][strain],
				  })
			));
			console.log(l);
			setLineData(l);
		}

	}, [date, graphData])
  return (
    <div id="body">
		<GraphBar 
			pieData={pieData} 
			lineData={lineData}
			policies={policies}
			predict={predict}
			setPolicies={setPolicies}
		/>
		<HeatMap showCompare={showCompare} 
			containerId={containerId} 
			mapData={mapData} 
			updateState={setLocation} 
			currentState={location}
			graphData={graphData[date.toISOString().split('T')[0]]}
		/>
		<Filters token={refetch} 
			onFilterChange={triggerRefetch}
			setShowCompare={setShowCompare}
			showCompare={showCompare} 
			predict={predict}
			setPredict={setPredict}
			containerId={containerId}
			allMapData={allMapData}
			policies={policies}
			setPolicies={setPolicies}
		/>
	</div>
  );
}

export default Main;
