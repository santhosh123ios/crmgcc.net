import React from 'react'
import './Main.css'

const statusStyles = {
  0: { color: 'orange', text: 'PENDING' },
  1: { color: 'yellow', text: 'REVIEW' },
  2: { color: 'green', text: 'PROCESSING' },
  3: { color: 'green', text: 'DONE' },
  4: { color: 'red', text: 'REJECTED' },
  // Add more statuses here
};

const leadStatusStyles = {
  0: { color: 'orange', text: 'PENDING' },
  1: { color: 'green', text: 'APPROVED' },
  2: { color: 'red', text: 'REJECTED' },
};

const redeemStatusStyles = {
  0: { color: 'orange', text: 'PENDING' },
  1: { color: 'green', text: 'APPROVED' },
  2: { color: 'red', text: 'REJECTED' },
};

function StatusBadge({ status = 0, type = 'default' }) {
  let statusConfig;
  
  switch (type) {
    case 'leads':
      statusConfig = leadStatusStyles[status] || { color: 'gray', text: 'UNKNOWN' };
      break;
    case 'redeems':
      statusConfig = redeemStatusStyles[status] || { color: 'gray', text: 'UNKNOWN' };
      break;
    default:
      statusConfig = statusStyles[status] || { color: 'gray', text: status };
  }
  
  const { color, text } = statusConfig;
  
  return (
   <div className="status-badge">
      <span className="status-text" >{text}</span>
      <span className="status-dot" style={{ backgroundColor: color }}></span>
    </div>
  )
}

export default StatusBadge
