import { useState } from 'react';
import { Slider } from '@mantine/core';
import "./radiusSlider.css"

interface RSliderProps {
    setRadius: (token: number) => void;
  }
  
const RadiusSlider: React.FC<RSliderProps> = ({ setRadius }) => (
    <div id="container">
        <Slider id="small" color='#0275ff' thumbSize={17} defaultValue={0}/>
        <Slider id="slider" color='#0275ff'  thumbSize={20} defaultValue={20} onChange={setRadius} min={0} max={100} />
        <Slider id="big" color='#0275ff' thumbSize={25} defaultValue={100}/>
    </div>
)

export default RadiusSlider;