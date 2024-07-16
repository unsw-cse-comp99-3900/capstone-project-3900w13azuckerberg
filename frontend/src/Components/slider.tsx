import React, { useState, useEffect, useRef } from "react";
import Icon from "./timelineButton";
import CustomTooltip from './customTooltip';
import Calendar from "react-calendar"; // Import Calendar component
import "react-calendar/dist/Calendar.css"; // Import Calendar CSS
import "./calendar.css";
import "./button.css";
import "./slider.css";


interface TimelineSliderProps {
  onDateChange: (date: Date) => void;
  date: Date;
  predict: boolean;
}

const Slider: React.FC<TimelineSliderProps> = ({ date, onDateChange, predict }) => {
  let startDate: Date;
  let endDate: Date;
  if (predict) {
    startDate = new Date("2024-01-01");
    endDate = new Date("2025-04-30");
  } else {
    startDate = new Date("2020-01-01");
    endDate = new Date("2023-12-31");
  }

  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);
  const [playback, setPlayback] = useState<boolean>(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  const [playbackIcon, setPlaybackIcon] = useState<string>("play_arrow");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const days = parseInt(event.target.value);
    const newDate = new Date(startDate);
    newDate.setDate(startDate.getDate() + days);
    onDateChange(newDate);
  };

  const handleCalendar = (newDate: Date) => {
    onDateChange(newDate);
    setPlayback(false);
    // Close calendar after selecting date
    setShowCalendar(false); 
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setShowCalendar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
  
    const updateDay = () => {
      const newDay = new Date(date);
      newDay.setDate(newDay.getDate() + 1);
  
      if (newDay <= new Date(endDate)) {
        onDateChange(newDay);
        if (playback) {
          timer = setTimeout(updateDay,250 / speed);
        }
      } else {
        onDateChange(startDate);
      }
    };
  
    if (playback) {
      timer = setTimeout(updateDay, 1000 / speed);
    }
  
    return () => clearTimeout(timer);
  }, [playback, speed, date, onDateChange]);

  function handlePlayback(): void {
    setPlayback(current => {
      setPlaybackIcon(current ? "play_arrow" : "pause");
      return !current;
    });
  }

  // Calculate number of days between start and end dates
  const totalDays = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24),
  );

  const handleDecreaseSpeed = () => {
    if (speed > 0.25) {
        setSpeed(speed - 0.25);
    }
  };

  const handleIncreaseSpeed = () => {
    if (speed < 8) {
        setSpeed(speed + 0.25);
    }
  };


  return (
    <div>
      <div className="timeline">
        <CustomTooltip label="Decrease Speed">
          <div>
            <Icon
              icon="fast_rewind"
              onClick={() => handleDecreaseSpeed()}
            />
          </div>
        </CustomTooltip>
        <div style={{ padding: '5px' }}> {speed.toFixed(2)}x </div>
        <CustomTooltip label="Increase Speed">
          <div>
            <Icon
              icon="fast_forward"
              onClick={() => handleIncreaseSpeed()}
            />
          </div>
        </CustomTooltip>
        <CustomTooltip label={playback ? "Pause" : "Play"}>
          <div>
            <Icon
              icon={playbackIcon}
              onClick={() => handlePlayback()}
            />
          </div>
        </CustomTooltip>
        <CustomTooltip label="Select Date">
          <div>
            <button
              className="button"
              onClick={() => setShowCalendar(true)}
              style={{ minWidth: '150px' }}
            >
              {date.toDateString()}
            </button>
          </div>
        </CustomTooltip>
        <div className="slider">
          <input
            type="range"
            id="timeline-slider"
            name="timeline-slider"
            min={0}
            max={totalDays}
            step={1}
            value={Math.ceil(
              (date.getTime() - startDate.getTime()) / (1000 * 3600 * 24),
            )}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="calendar-container" ref={calendarRef}>
        {showCalendar && (
          <Calendar
            className="react-calendar"
            value={date}
            onClickDay={handleCalendar}
          />
        )}
      </div>
    </div>
  );
};

export default Slider;
