import React from 'react'
import './Main.css'

const statusStyles = {
  0: { color: 'orange', text: 'PENDING' },
  1: { color: 'yellow', text: 'REVIEW' },
  2: { color: 'paleturquoise', text: 'Processing' },
  3: { color: 'green', text: 'DONE' },
  4: { color: 'red', text: 'REJECTED' },
  // Add more statuses here
};

function StatusBadge({ status = 0 }) {
    const { color, text } = statusStyles[status] || { color: 'gray', text: status };
  return (
   <div className="status-badge">
      <span className="status-text" >{text}</span>
      <span className="status-dot" style={{ backgroundColor: color }}></span>
    </div>
  )
}

export default StatusBadge
