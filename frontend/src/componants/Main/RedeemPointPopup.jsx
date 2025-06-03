import React, { useState } from 'react';
import TextView from './TextView';

function RedeemPointPopup({ onClose, onSubmit }) {
  const [pointNote, setPointNote] = useState('');
  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <TextView type="darkBold" text={"Enter Points"}/>
        <input
          type="text"
          value={pointNote}
          onChange={(e) => setPointNote(e.target.value)}
          placeholder="Enter Notes"
          className="popup-input"
        />
        <div className="popup-actions">
          <button onClick={onClose} className="popup-button-cancel">Cancel</button>
          <button onClick={() => onSubmit(pointNote)} className="popup-button-submit">Submit</button>
        </div>
      </div>
    </div>
  )
}

export default RedeemPointPopup
