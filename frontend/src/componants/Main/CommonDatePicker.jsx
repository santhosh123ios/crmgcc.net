import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function CommonDatePicker({ label = 'Date', value, onChange, placeholder, style }) {
  return (
    <div className='circle-btns-date' style={style}>
      <label style={{ display: 'block', marginBottom: '8px', fontSize:'14px', marginLeft:'0px', color: '#333', fontWeight: '500' }}>{label}</label>
      <DatePicker
        selected={value ? new Date(value) : null}
        onChange={onChange}
        dateFormat="yyyy-MM-dd"
        className="date-picker-input"
        placeholderText={placeholder}
      />
    </div>
  );
};

export default CommonDatePicker