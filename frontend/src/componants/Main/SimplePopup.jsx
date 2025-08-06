import React from 'react';
import TextView from './TextView';
import './Main.css'

function SimplePopup({ onClose, children }) {

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-container" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}

export default SimplePopup 