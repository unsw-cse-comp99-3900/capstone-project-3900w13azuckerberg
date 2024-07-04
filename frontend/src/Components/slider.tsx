import React, { useState, useEffect, useRef } from "react";
import Button from "./button";
import Icon from "./icon";
import "./slider.css";
import Calendar from "react-calendar"; // Import Calendar component
import "react-calendar/dist/Calendar.css"; // Import Calendar CSS
import "./calendar.css";

interface TimelineSliderProps {
  onDateChange: (date: Date) => void;
  date: Date;
}

const Slider: React.FC<TimelineSliderProps> = ({ date, onDateChange }) => {
  const startDate = new Date("2020-01-01"); // Start date for the timeline
  const endDate = new Date("2023-12-31"); // End date (current date)

  const [showCalendar, setShowCalendar] = useState<boolean>(false); // State to toggle calendar

  const calendarRef = useRef<HTMLDivElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const days = parseInt(event.target.value);
    const newDate = new Date(startDate);
    newDate.setDate(startDate.getDate() + days);
    onDateChange(newDate);
  };

  const handleCalendar = (date: Date) => {
    onDateChange(date);

    setShowCalendar(false); // Close calendar after selecting date
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

  // Calculate number of days between start and end dates
  const totalDays = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24),
  );

  return (
    <div>
      <div className="timeline">
        <Icon
          icon="fast_rewind"
          data={"reduce"}
          endpoint="/filter/new"
          onClick={() => null}
        />
        <Button
          label={"1.50x"}
          endpoint="/date/speed"
          selected={false}
          onSelect={(selected: boolean) => null}
        />
        <Icon
          icon="fast_forward"
          data={"increase"}
          endpoint="/filter/new"
          onClick={() => null}
        />
        <Icon
          icon="play_arrow"
          data={"play"}
          endpoint="/filter/new"
          onClick={() => null}
        />
        <Button
          label={date.toDateString()}
          endpoint="/date/new"
          selected={false}
          onSelect={(selected: boolean) => setShowCalendar(true)}
        />
        <div className="slider">
          <input
            type="range"
            id="timeline-slider"
            name="timeline-slider"
            min={0}
            max={totalDays}
            step={7}
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
            onClickDay={handleCalendar} // Handle click on specific day
          />
        )}
      </div>
    </div>
  );
};

export default Slider;
