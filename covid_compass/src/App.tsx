import React, { useState, useEffect } from 'react';
import './App.css';
import HeatMap from './Components/map';
import Filters from './Components/filters';
import Slider from './Components/slider';
import Map from './Components/map'
import GraphBar from './Components/GraphBar';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import HomeMessage from './HomeMessage';
import axios from 'axios';

function App() {
  const [filters, setFilters] = useState(0);
  const [heatMapData, setHeatMapData] = useState<[number, number, number][]>([]);

  useEffect(() => {
    // Function to fetch heat map data from the backend
    const fetchData = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5000/map', {
                // params: { filters: filters.join(',') }
            });
            const data = response.data;
            console.log(data)
            // Transform the data into heat map format
            const heatMapPoints: [number, number, number][] = data.flatMap((day: any) => 
                day.cases.map((caseItem: any) => [
                    caseItem.latitude, 
                    caseItem.longitude, 
                    caseItem.intensity
                ])
            );

            setHeatMapData(heatMapPoints); // Update state with fetched data
        } catch (error) {
            console.error('Error fetching heat map data:', error);
        }
    };

    fetchData(); // Fetch data on component mount and whenever filters change
  }, [filters]); // Add filters as a dependency


  // const handleFilterChange = (selectedFilters: string[]) => {
  //   setFilters(selectedFilters);
  // };
    return (
      <MantineProvider>
        <div className="App">
            {/* <HomeMessage /> */}
            <GraphBar/>
            {/* <Map/> */}
            <HeatMap heatMapData={heatMapData} />
            <Slider/>
            <Filters onFilterChange={setFilters} />
        </div>
      </MantineProvider>  
    );
  }

export default App;