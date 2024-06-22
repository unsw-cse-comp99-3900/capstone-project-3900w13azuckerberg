import React from 'react';
import './App.css';
import HeatMap from './heatMap';
import Filters from './filters';
// import Slider from './slider'

function App(){
    return (
        <div className="App">
          <header className="App-header">   
          <HeatMap />
          </header>
          <Filters/>
          {/* <Slider/> */}
        </div>
    );
};

export default App;