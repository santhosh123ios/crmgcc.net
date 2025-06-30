import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function CommonDatePicker({ label = 'Date', selectedDate, onChange }) {
  return (
    <div className='circle-btns-date'>
      
      <label style={{ display: 'block', marginBottom: '0px', fontSize:'14px',marginLeft:'10px' }}>{label}</label>
      <DatePicker

        selected={selectedDate}
        onChange={onChange}
        dateFormat="yyyy-MM-dd"
        className="date-picker-input"
      />
    </div>
  );
};

export default CommonDatePicker

{/* <DatePickerComponent
        label="Start Date"
        selectedDate={startDate}
        onChange={date => setStartDate(date)}
      /> */}