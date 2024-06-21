import React from 'react';
import './App.css';
import HeatMap from './heatMap';
import Filters from './filters';

function App(){
    return (
        <div className="App">
          <header className="App-header">   
          <HeatMap />
          </header>
          <Filters/>
        </div>
    );
};

export default App;