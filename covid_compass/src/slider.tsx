import React, { useState } from 'react';
import { Range, getTrackBackground } from 'react-range';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';

const DateSlider = () => {
  const STEP = 86400000; // One day in milliseconds
  const MIN = dayjs('2020-01-01').valueOf();
  const MAX = dayjs('2024-12-31').valueOf();

  const [value, setValue] = useState(MIN);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const handleDateChange = (date: any) => {
    const timestamp = dayjs(date).valueOf();
    setValue(timestamp);
    setIsDatePickerOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Range
        values={[value]}
        step={STEP}
        min={MIN}
        max={MAX}
        onChange={(values) => setValue(values[0])}
        renderTrack={({ props, children }) => (
          <div
            {...props}
            style={{
              ...props.style,
              height: '6px',
              width: '100%',
              background: getTrackBackground({
                values: [value],
                colors: ['#ccc', '#548BF4', '#ccc'],
                min: MIN,
                max: MAX,
              }),
            }}
          >
            {children}
          </div>
        )}
        renderThumb={({ props }) => (
          <div
            {...props}
            style={{
              ...props.style,
              height: '24px',
              width: '24px',
              borderRadius: '12px',
              backgroundColor: '#548BF4',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div style={{ position: 'absolute', top: '-28px', color: '#fff', fontWeight: 'bold', fontSize: '14px', fontFamily: 'Arial,Helvetica,sans-serif' }}>
              {dayjs(value).format('YYYY-MM-DD')}
            </div>
          </div>
        )}
      />
      <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center' }}>
        <span style={{ marginRight: '10px' }}>Selected date: </span>
        <span
          onClick={() => setIsDatePickerOpen(true)}
          style={{ cursor: 'pointer', color: '#548BF4', textDecoration: 'underline' }}
        >
          {dayjs(value).format('YYYY-MM-DD')}
        </span>
      </div>
      {isDatePickerOpen && (
        <DatePicker
          selected={new Date(value)}
          onChange={handleDateChange}
          inline
          minDate={new Date(MIN)}
          maxDate={new Date(MAX)}
        />
      )}
    </div>
  );
};

export default DateSlider;
