import React, { useState } from 'react';
import TextView from './TextView';

function PointPopup({ onClose, onSubmit }) {
    const [points, setPoints] = useState('');
  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <TextView type="darkBold" text={"Enter Points"}/>
        <input
          type="number"
          value={points}
          onChange={(e) => setPoints(e.target.value)}
          placeholder="Enter points"
          className="popup-input"
        />
        <div className="popup-actions">
          <button onClick={onClose} className="popup-button-cancel">Cancel</button>
          <button onClick={() => onSubmit(points)} className="popup-button-submit">Submit</button>
        </div>
      </div>
    </div>
  )
}

export default PointPopup
