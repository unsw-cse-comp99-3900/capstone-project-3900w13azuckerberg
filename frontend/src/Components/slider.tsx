import React, { useState, useEffect, useRef, useMemo } from "react";
import Icon from "./timelineButton";
import CustomTooltip from './customTooltip';
import Calendar from "react-calendar"; // Import Calendar component
import "react-calendar/dist/Calendar.css"; // Import Calendar CSS
import "./calendar.css";
import "./filters.css";
import "./slider.css";
import axios, { AxiosResponse } from "axios";
import PolicyTooltip from "./policyToolTip";

interface TimelineSliderProps {
  onDateChange: (date: Date) => void;
  date: Date;
  predict: boolean;
}
interface Mark {
  date: Date;
  description: string;
}

const Slider: React.FC<TimelineSliderProps> = ({ date, onDateChange, predict }) => {
  let startDate: Date;
  let endDate: Date;
  if (predict) {
    startDate = new Date("2024-05-30");
    endDate = new Date("2025-05-30");
  } else {
    startDate = new Date("2020-01-01");
    endDate = new Date("2024-05-29");
  }

  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);
  const [playback, setPlayback] = useState<boolean>(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  const [playbackIcon, setPlaybackIcon] = useState<string>("play_arrow");
  const [policies, setPolicies] = useState<Record<string, { Date: string, Description: string, Entities?: string }[]> | null>(null);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const days = parseInt(event.target.value);
    const newDate = new Date(startDate);
    newDate.setDate(startDate.getDate() + days);
    onDateChange(newDate);
  };

  // change date using calendar pop up
  const handleCalendar = (newDate: Date) => {
    setPlayback(false);
    setPlaybackIcon("play_arrow");
    const adjustedDate = new Date(newDate);
    adjustedDate.setDate(newDate.getDate() + 1);
    const dateString = adjustedDate.toISOString().slice(0, 10);
    console.log("selected date", dateString);
    onDateChange(new Date(dateString));
    // Close calendar after selecting date
    setShowCalendar(false); 
  };

  // close the calendar if click outside of calendar popup
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
  });

  // toggle playback and increment date to simulate autoplay
  useEffect(() => {
    let timer: NodeJS.Timeout;
  
    const updateDay = () => {
      const newDay = new Date(date);
      newDay.setDate(newDay.getDate() + 1);
  
      if (newDay <= new Date(endDate)) {
        onDateChange(newDay);
        if (playback) {
          timer = setTimeout(updateDay, 250 / speed);
        }
      } else {
        onDateChange(startDate);
      }
    };
  
    if (playback) {
      timer = setTimeout(updateDay, 250 / speed);
    }
  
    return () => clearTimeout(timer);
  }, [playback, speed, date, onDateChange]);

  // update play/pause icon on button click
  const handlePlayback = (): void => {
    setPlayback(current => {
      setPlaybackIcon(current ? "play_arrow" : "pause");
      return !current;
    });
  };

  // Calculate number of days between start and end dates
  const totalDays = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24),
  );

  // decrease playback speed
  const handleDecreaseSpeed = () => {
    if (speed > 0.25) {
        setSpeed(speed - 0.25);
    }
  };

  // increase playback speed
  const handleIncreaseSpeed = () => {
    if (speed < 8) {
        setSpeed(speed + 0.25);
    }
  };

  // pull historical policy data
  useEffect(() => {
    if (!predict) {
      getPolicy().then(data => {
        setPolicies(data);
      });
    }
  }, [predict]);

  const getPolicy = async () => {
    try {
      let response: AxiosResponse;
      response = await axios.get("http://127.0.0.1:5001/policy", {});
      console.log("Policy data updated.");
      return response.data
      
    } catch (error) {
      console.error("Error fetching heat map data:", error);
    }
  };

  // Parse dates and descriptions from dict_result
  const marks: Mark[] = useMemo(() => {
    if (!policies) return [];
  
    // Create a map to aggregate descriptions by month and year
    const monthMap: Record<string, string[]> = {};
  
    Object.keys(policies).forEach(dateStr => {
      const [day, month, year] = dateStr.split('/').map(Number);
      const date = new Date(year, month - 1, day);
      const monthYearKey = `${year}-${month.toString().padStart(2, '0')}`;
  
      if (!monthMap[monthYearKey]) {
        monthMap[monthYearKey] = [];
      }
  
      const descriptions = policies[dateStr].map(item => item.Description).join('\n');
      monthMap[monthYearKey].push(descriptions);
    });
  
    // Convert monthMap to an array of marks
    return Object.keys(monthMap).map(monthYearKey => {
      const [year, month] = monthYearKey.split('-').map(Number);
      const date = new Date(year, month - 1, 1); // Use the 1st day of the month for the mark
      const description = monthMap[monthYearKey].join(' \n ');
      
      return {
        date,
        description,
      };
    });
  }, [policies]);

  return (
    <div>
      <div className="timeline">
        <CustomTooltip label="Decrease Speed">
          <div>
            <Icon
              icon="fast_rewind"
              onClick={handleDecreaseSpeed}
            />
          </div>
        </CustomTooltip>
        <div style={{ padding: '5px' }}> {speed.toFixed(2)}x </div>
        <CustomTooltip label="Increase Speed">
          <div>
            <Icon
              icon="fast_forward"
              onClick={handleIncreaseSpeed}
            />
          </div>
        </CustomTooltip>
        <CustomTooltip label={playback ? "Pause" : "Play"}>
          <div>
            <Icon
              icon={playbackIcon}
              onClick={handlePlayback}
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
          <div style={{ position: 'relative', height: 10 }}>
          {marks.map((mark) => {
              const leftPosition = ((mark.date.getTime() - startDate.getTime()) / (1000 * 3600 * 24 * totalDays)) * 100;
              return (
                <div key={mark.date.toISOString()}
                  style={{
                    position: 'absolute',
                    left: `${leftPosition}%`,
                    transform: 'translateX(-50%)',
                  }}
                >
                  <PolicyTooltip label={mark.description}>
                    <div style={{
                      width: 0,
                      height: 0,
                      borderLeft: '6px solid transparent',
                      borderRight: '6px solid transparent',
                      borderTop: '10px solid white',
                      borderRadius: '3px',
                    }} />
                  </PolicyTooltip>
                </div>
              );
            })}
          </div>
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
            data-testid="date-slider"
          />
          
        </div>
      </div>
      <div className="calendar-container" ref={calendarRef}>
        {showCalendar && (
          <Calendar
            className="react-calendar"
            // value={date}
            onClickDay={handleCalendar}
          />
        )}
      </div>
    </div>
  );
};

export default Slider;
