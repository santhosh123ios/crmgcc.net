import React from 'react'
import './Main.css'

const statusStyles = {
  0: { color: 'orange' },
  1: { color: 'yellow' },
  2: { color: 'paleturquoise' },
  3: { color: 'green' },
  4: { color: 'red' },
  6: { color: '#9A9993' },
  // Add more statuses here
};


function DotBadge({ status = 0 }) {
    const { color } = statusStyles[status] || { color: 'gray', text: status };
  return (
   <div className="status-badge">
      <span className="status-dot" style={{ backgroundColor: color }}></span>
    </div>
  )
}

export default DotBadge
