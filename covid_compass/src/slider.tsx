import React, { useState } from 'react';
import Button from './button';
import Icon from './icon';
import './slider.css'

interface TimelineSliderProps {
    // Optionally define props here if needed
}

const Slider: React.FC<TimelineSliderProps> = () => {
    const startDate = new Date('2020-01-01'); // Start date for the timeline
    const endDate = new Date(); // End date (current date)

    const [selectedDate, setSelectedDate] = useState<Date>(startDate);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const days = parseInt(event.target.value);
      const newDate = new Date(startDate);
      newDate.setDate(startDate.getDate() + days);
      setSelectedDate(newDate);
    };
  
    // Calculate number of days between start and end dates
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
  
    return (
      <div className="timeline">
        <Icon icon="fast_rewind" data={false} endpoint="/filter/new" onClick={() => null}/>
        <Button 
            label={"1.50x"} 
            endpoint="/date/speed" 
            selected={false}
            onSelect={(selected: boolean) => null}
        />
        <Icon icon="fast_forward" data={false} endpoint="/filter/new" onClick={() => null}/>
        <Icon icon="play_arrow" data={false} endpoint="/filter/new" onClick={() => null}/>

        <div className='slider'>
            <input
            type="range"
            id="timeline-slider"
            name="timeline-slider"
            min={0}
            max={totalDays}
            step={1}
            value={Math.ceil((selectedDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24))}
            onChange={handleChange}
            />
        </div>
        <Button 
            label={selectedDate.toDateString()} 
            endpoint="/date/new" 
            selected={false}
            onSelect={(selected: boolean) => null}
        />
      </div>
    );
  };
  

export default Slider;
