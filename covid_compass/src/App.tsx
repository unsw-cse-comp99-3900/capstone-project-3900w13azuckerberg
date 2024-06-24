import React from 'react';
import './App.css';
import HeatMap from './map';
import Filters from './filters';
import Slider from './slider';
import Map from './Components/Map'
import GraphBar from './Components/GraphBar';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';

function App() {
  return (
    <MantineProvider>
      <div className="App">
          <GraphBar/>
          <Map/>
          <HeatMap />
          <Slider/>
          <Filters/>
      </div>
    </MantineProvider>  
  );
}

export default App;