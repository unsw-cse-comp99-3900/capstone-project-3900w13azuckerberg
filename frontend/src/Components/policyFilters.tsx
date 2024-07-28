import React, { useEffect, useRef, useState } from 'react';
import CustomTooltip from './customTooltip';
import "./filters.css";
import axios from 'axios';
import Calendar from 'react-calendar';
import "react-calendar/dist/Calendar.css";
import "./calendar.css";
import { PolicyData } from './types';

interface PolicyFiltersProps {
  token: boolean;
  onFilterChange: (token: boolean) => void;
  containerId: string;
  policies: PolicyData;
  setPolicies: (policies: PolicyData) => void;

}

const PolicyFilters: React.FC<PolicyFiltersProps> = ({token, onFilterChange, containerId, policies, setPolicies}) => {
  const none = "None Selected"
  const [startDate, setStartDate] = useState<string>(none);
  const [endDate, setEndDate] = useState<string>(none);
  const [state, setstate] = useState<string>(none);
  const [policy, setPolicy] = useState<string>(none);
  const [showStartDateCalendar, setShowStartDateCalendar] = useState(false);
  const [showEndDateCalendar, setShowEndDateCalendar] = useState(false);
  const startCalendarRef = useRef<HTMLDivElement>(null);
  const endCalendarRef = useRef<HTMLDivElement>(null);
  const [hoverMessage, setHoverMessage] = useState('Complete all fields');
  const [apply, setApply] = useState(false);

  const handleStartDate = (newDate: Date) => {
    const dateString = newDate.toISOString().slice(0, 10);
    setStartDate(dateString);

    // Close calendar after selecting date
    setShowStartDateCalendar(false); 
  };

  const handleEndDate = (newDate: Date) => {
    const dateString = newDate.toISOString().slice(0, 10);
    setEndDate(dateString);
    // Close calendar after selecting date
    setShowEndDateCalendar(false); 
  };
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (startCalendarRef.current && !startCalendarRef.current.contains(event.target as Node)) {
        setShowStartDateCalendar(false);
      }
      if (endCalendarRef.current && !endCalendarRef.current.contains(event.target as Node)) {
        setShowEndDateCalendar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleApply = async () => {
    try {
      onFilterChange(!token);
      const response = await axios.get("http://127.0.0.1:5001/policy", {
        params: {
          state,
          startDate,
          endDate,
          policy,
          containerId, // M left or right
        }
      });

      setPolicies({
        ...policies,
        [state]: { startDate, endDate, policy }
      });

      setStartDate(none);
      setEndDate(none);
      setstate(none);
      setPolicy(none);
      console.log("Success:", response.data);

    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleStateChange = (event: any) => {
    setstate(event.target.value);
  };

  const handlePolicyChange = (event: any) => {
    setPolicy(event.target.value);
  };

  useEffect(() => {
    const fields = [startDate, endDate, state, policy];
    if (fields.some(field => field === 'None Selected')) {
      setHoverMessage('Complete all fields');
      setApply(false);
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      setHoverMessage('Start date must be before end date');
      setApply(false);
      return;
    }

    if (policies[state] && policies[state].policy === policy) {
      setHoverMessage(`${state} already has ${policy}`);
      setApply(false);
      return;
    }

    setHoverMessage('Apply Policy');
    setApply(true);

  }, [startDate, endDate, state, policy]); 

  return (
    <div className="policy-container">
      <CustomTooltip label={startDate === none ? none : "Start Date"}>
        <button className={`button ${startDate === none ? "" : "selected"}`} onClick={() => setShowStartDateCalendar(true)}>
        {startDate === none ? "Start Date" : startDate}
        </button>
      </CustomTooltip>
      <CustomTooltip label={endDate === none ? none : "End Date"}>
        <button className={`button ${endDate === none ? "" : "selected"}`} onClick={() => setShowEndDateCalendar(true)}>
          {endDate === none ? "End Date" : endDate}
        </button>
      </CustomTooltip>
      <CustomTooltip label={state === none ? none : "State"}>
        <select className={`dropdown button ${state === none ? "" : "selected"}`} value={state} onChange={handleStateChange}>
          {state === none && <option value="">State</option>}
          <option value="Australia">Australia</option>
          <option value="New South Wales">New South Wales </option>
          <option value="Queensland">Queensland </option>
          <option value="Victoria">Victoria </option>
          <option value="Tasmania">Tasmania </option>
          <option value="South Australia">South Australia </option>
          <option value="Western Australia">Western Australia </option>
          <option value="Northern Northern Territory">Northern Territory </option>
          <option value="Australian National Territory">Australian National Territory </option>
        </select>
      </CustomTooltip>
      <CustomTooltip label={policy === none ? none : "Policy"}>
        <select className={`dropdown button ${state === none ? "" : "selected"}`} value={policy} onChange={handlePolicyChange}>
          {policy === none && <option value="">Policy</option>}
          <option value="Lockdown">Lockdown </option>
          <option value="Social Distancing">Social Distancing </option>
        </select>
      </CustomTooltip>
      <CustomTooltip label={hoverMessage}>
        <button className={`button`} disabled={!apply} onClick={handleApply}>
          Apply
        </button>
      </CustomTooltip>
      <div className="calendar-container" ref={startCalendarRef}>
        {showStartDateCalendar && (
          <Calendar
            className="react-calendar"
            onClickDay={handleStartDate}
          />
        )}
      </div>
      <div className="calendar-container" ref={endCalendarRef}>
        {showEndDateCalendar && (
          <Calendar
            className="react-calendar"
            onClickDay={handleEndDate}
          />
        )}
      </div>
    </div>
  );
};

export default PolicyFilters;