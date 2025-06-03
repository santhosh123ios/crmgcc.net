import React, { useState } from 'react';
import TextView from './TextView';
import './Main.css'

function RedeemPopup({ onClose, onSubmit, point = 0 }) {
    const [points, setPoints] = useState('');
    const [notes, setNotes] = useState('');
  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <TextView type="darkBold" text={"Create Redeem Request "}/>
        <TextView type="subDarkBold" text={"Available point : "+point}/>
        <input
          type="number"
          value={points}
          onChange={(e) => setPoints(e.target.value)}
          placeholder="Enter points"
          className="popup-input"
        />
        <input
          type="text"
          value={notes}
          onChange={(f) => setNotes(f.target.value)}
          placeholder="Enter Note"
          className="popup-input"
        />
        <div className="popup-actions">
          <button onClick={onClose} className="popup-button-cancel">Cancel</button>
          <button onClick={() => onSubmit(points,notes)} className="popup-button-submit">Submit</button>
        </div>
      </div>
    </div>
  )
}

export default RedeemPopup
