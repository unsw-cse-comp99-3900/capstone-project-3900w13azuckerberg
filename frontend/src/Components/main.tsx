import React, { useState, useEffect } from "react";
import "./GraphBar.css";
import axios, { AxiosResponse } from "axios";
import GraphBar from "./GraphBar";
import HeatMap from "./map";
import Filters from "./filters";
import "./main.css"
import { MapData, GraphData, Point, PieItem, LineItem, PolicyData, SeirsData, BarItem } from "./types"
import RadiusSlider from "./radiusSlider";
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
		Alpha: "#4B0082",     // Indigo
		Beta: "#6A0DAD",      // Royal Purple
		Gamma: "#483D8B",     // Dark Slate Blue
		Delta: "#7B68EE",     // Medium Slate Blue
		Omicron: "#8A2BE2"    // Blue Violet
	};

	const defaultBarData = {
		statement: "Status",
		Infected: 0,	
		Recovered: 0,
		Exposed: 0,
	}
	
	const [refetch, triggerRefetch] = useState(false);
	const [allMapData, setAllMapData] = useState<MapData>({});
	const [location, setLocation] = useState("all");
	const [mapData, setMapData] = useState<[number, number, number][]>([]);
	const [graphData, setGraphData] = useState<GraphData>({});
	const [pGraphData, setPGraphData] = useState<SeirsData>({})
	const [pieData, setPieData] = useState<PieItem[]>([]);
	const [lineData, setLineData] = useState<LineItem[]>([]);
	const [barData, setBarData] = useState<BarItem>(defaultBarData);
	const [allBarData, setAllBarData] = useState<SeirsData>({});
	const [policies, setPolicies] = useState<PolicyData>({});
	const [radius, setRadius] = useState(20);
	// Map use effect
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
					response = await axios.get("http://127.0.0.1:5001/predictive_map", {
					params: {
						containerId, // <- this will be either "M", "left", "right"
						}
					})
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
        fetchData();
    }, [refetch, predict]);
	

	// Graph use effect
	useEffect(() => {
		// Function to fetch heat map data from the backend
		const fetchGraphData = async () => {
			console.log("getting graph data");
			// setIsLoading(true);
			try {
				let response: AxiosResponse;
				if (!predict) {
					response = await axios.get("http://127.0.0.1:5001/graphdata", {
						params: {
							containerId, // <- this will be either "M", "left", "right"
						}
					});
					const rawData: GraphData = response.data;
					setGraphData(rawData);
				}
				else {
					response = await axios.get("http://127.0.0.1:5001/predictive_graphdata", {
						params: {
							containerId, // <- this will be either "M", "left", "right"
						}
					});	
					const seirData: SeirsData = response.data;
					setPGraphData(seirData);
				}
				console.log("Graph data updated.");

			} catch (error) {
			console.error("Error fetching Graph map data:", error);
			}
			//   setIsLoading(false);
		  };
		  fetchGraphData();
	}, [refetch, predict]);

    useEffect(() => {
      const dateString = date.toISOString().split('T')[0];
      setMapData(allMapData[dateString] || []);
	  
    }, [date, allMapData]);

	useEffect(() => {
		if (graphData != null && Object.keys(graphData).length > 0 && predict === false) {
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
					"Tasmania": { Alpha: 0, Beta: 0, Delta: 0, Gamma: 0, Omicron: 0},
					"South Australia": { Alpha: 0, Beta: 0, Delta: 0, Gamma: 0, Omicron: 0},
					"Australian Capital Territory": { Alpha: 0, Beta: 0, Delta: 0, Gamma: 0, Omicron: 0},
				};
			}
	
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
		
			let l: LineItem[] = [];
			Object.keys(graphData[dateString]["Australia"]).forEach((name) => l.push({
				id: name,
				color: colors[name],
				data: [],
			})
			)
			sorted.forEach((d) => Object.keys(graphData[d][currLocation])
					.forEach((strain) => {
						let yValue = graphData[d][currLocation][strain];
							l.find(item => item.id == strain)?.data.push({
								x: d,
								y: yValue,
							});
					})
			);

			setLineData(l);
		}

	}, [date, graphData]);

	useEffect(() => {
		if (predict) {
			const dateString = date.toISOString().split('T')[0];
			const sorted = Object.keys(pGraphData)
								 .filter(d => d < dateString)
								 .sort((date1, date2) => date1.localeCompare(date2));	
			let l:LineItem[] = [{
				id: 'Total Predicted Cases',
				color: '#483D8B', 
				data: [],
			}];
			const data = {};
			sorted.forEach((d) => l[0].data.push({x: d, y: pGraphData[d]['Australia']['numI']}))
			setLineData(l);

			setAllBarData(pGraphData);

		}
	}, [date, pGraphData]);

	useEffect(() => {
		const fetchBarData = async () => {
			console.log("getting bar data");
			try {
				let response: AxiosResponse;
				response = await axios.get("http://127.0.0.1:5001/SEIRS_data", {});
				const rawData: SeirsData = response.data;
				setAllBarData(rawData);
				console.log("SEIRS data updated.");

			} catch (error) {
			console.error("Error fetching Bar data:", error);
			}
		};
		fetchBarData();
	}, []);
	
	useEffect(() => {
		const dateString = date.toISOString().split('T')[0];
		if (allBarData[dateString]) {
			const curr = allBarData[dateString]['Australia'];
			setBarData({
				statement: "Status:",
				Infected: curr.numI,
				Recovered: curr.numR,
				Exposed: curr.numE,
			});
		} else {
			setBarData(defaultBarData);
		}
	}, [date, allBarData]);
	
  return (
    <div id="body">
		<GraphBar 
			pieData={pieData} 
			lineData={lineData}
			barData={barData}
			policies={policies}
			predict={predict}
			setPolicies={setPolicies}
			token={refetch}
			onFilterChange={triggerRefetch}
			containerId={containerId}
		/>
		<HeatMap showCompare={showCompare} 
			containerId={containerId} 
			mapData={mapData} 
			updateState={setLocation} 
			graphData={graphData[date.toISOString().split('T')[0]]}
			radius={radius}
			predict={predict}
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
		<RadiusSlider setRadius={setRadius}/>
	</div>
  );
}

export default Main;
