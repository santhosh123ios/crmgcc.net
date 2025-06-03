import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons'; // date icon
import './Main.css';

const DateWithIcon = ({ text = faCalendarAlt }) => {
  return (
    <div className="date-with-icon">
        <FontAwesomeIcon className="date-icon" icon={faCalendarAlt} />
        <span className="date-text">{text}</span>
    </div>
  );
};

export default DateWithIcon;