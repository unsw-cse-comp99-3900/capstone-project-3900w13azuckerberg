import React from 'react';
import './App.css';
import HeatMap from './Components/map';
import Filters from './Components/filters';
import Slider from './Components/slider';
import Map from './Components/map'
import GraphBar from './Components/GraphBar';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import DataFetcher from './DataFetcher';

function App() {
  return (
    <MantineProvider>
      <div className="App">
          <GraphBar/>
          {/* <Map/> */}
          <HeatMap />
          <Slider/>
          <Filters/>
      </div>
    </MantineProvider>  
  );
}

export default App;