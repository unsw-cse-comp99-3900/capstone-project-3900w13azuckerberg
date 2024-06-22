import React, { useState } from 'react';
import Button from './button';
import Icon from './icon';
import './slider.css'
import Calendar from 'react-calendar'; // Import Calendar component
import 'react-calendar/dist/Calendar.css'; // Import Calendar CSS

interface TimelineSliderProps {
    // Optionally define props here if needed
}

const Slider: React.FC<TimelineSliderProps> = () => {
    const startDate = new Date('2020-01-01'); // Start date for the timeline
    const endDate = new Date(); // End date (current date)

    const [selectedDate, setSelectedDate] = useState<Date>(startDate);
    const [showCalendar, setShowCalendar] = useState<boolean>(false); // State to toggle calendar

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const days = parseInt(event.target.value);
      const newDate = new Date(startDate);
      newDate.setDate(startDate.getDate() + days);
      setSelectedDate(newDate);
    };

    const handleDateSelect = (date: Date | Date[]) => {
        if (Array.isArray(date)) {
            return;
        }
        setSelectedDate(date);
        setShowCalendar(false); // Close calendar after selecting date
    };

    // Calculate number of days between start and end dates
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));

    return (
        <div>
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
                onSelect={(selected: boolean) => setShowCalendar(true)}
                />
            </div>
            <div className="calendar-container">
                {showCalendar && (
                    <Calendar
                        // onChange={handleDateSelect}
                        value={selectedDate}
                        onClickDay={handleDateSelect} // Handle click on specific day
                    />
                )}
        </div>
    </div>
    );
  };


export default Slider;
