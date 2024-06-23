import React from 'react';
import './App.css';
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
      </div>
    </MantineProvider>  
  );
}

export default App;
