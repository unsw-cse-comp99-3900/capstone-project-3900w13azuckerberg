import React, { useState, useEffect, useRef, useMemo } from "react";
import Icon from "./timelineButton";
import CustomTooltip from './customTooltip';
import Calendar from "react-calendar"; // Import Calendar component
import "react-calendar/dist/Calendar.css"; // Import Calendar CSS
import "./calendar.css";
import "./filters.css";
import "./slider.css";

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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const days = parseInt(event.target.value);
    const newDate = new Date(startDate);
    newDate.setDate(startDate.getDate() + days);
    onDateChange(newDate);
  };

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

  const dict_result: Record<string, { Date: string, Description: string, Entities?: string }[]> = {
    '1/02/2020': [
      {
        'Date': '1/02/2020',
        'Description': 'International travel restrictions are implemented for foreign nationals entering Australia from China.',
        'Entities': 'Home Affairs; Health'
      },
      {
        'Date': '1/02/2020',
        'Description': 'Travel advice for mainland China is raised to ‘Level 4 – Do not travel’.',
        'Entities': 'DFAT'
      }
    ],
    '1/03/2020': [
      {
        'Date': '1/03/2020',
        'Description': 'Inward travel restrictions on foreign nationals entering Australia from Iran implemented.',
        'Entities': 'Home Affairs'
      }
    ],
    '1/11/2021': [
      {
        'Date': '1/11/2021',
        'Description': 'Fully vaccinated Australians permitted to travel overseas.',
        'Entities': 'Health; Home Affairs'
      }
    ],
    '1/12/2021': [
      {
        'Date': '1/12/2021',
        'Description': 'Australian international borders reopened to fully vaccinated eligible visa holders.',
        'Entities': 'Health; Home Affairs'
      }
    ],
    '10/07/2020': [
      {
        'Date': '10/07/2020',
        'Description': 'National Cabinet agrees on incoming passenger caps at major international airports.',
        'Entities': 'DITRDC'
      }
    ],
    '13/03/2020': [
      {
        'Date': '13/03/2020',
        'Description': 'Travel advice for all countries raised to ‘Level 3 – Reconsider your need to travel’.',
        'Entities': 'DFAT'
      }
    ],
    '11/03/2020': [
      {
        'Date': '11/03/2020',
        'Description': 'Inward travel restrictions on foreign nationals entering Australia from Italy implemented.',
        'Entities': 'Home Affairs'
      }
    ],
  };

  // Parse dates and descriptions from dict_result
  const marks: Mark[] = useMemo(() => {
    return Object.keys(dict_result).map(dateStr => {
      const [day, month, year] = dateStr.split('/').map(Number);
      const date = new Date(year, month - 1, day); // month - 1 because months are 0-based
      const descriptions = dict_result[dateStr].map(item => item.Description).join('\n');
      return {
        date,
        description: descriptions,
      };
    });
  }, [dict_result]);

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
                  <CustomTooltip label={mark.description}>
                    <div style={{ width: 2, height: 16, backgroundColor: 'white', borderRadius: '50%' }} />
                  </CustomTooltip>
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
