import React from 'react';
import TextView from './TextView';
import './Main.css'

function ImportantPopup({children}) {

  return (
    <div className="popup-overlay">
      <div className="popup-container">

        {children}

        {/* <div className="popup-actions">
          <button onClick={onClose} className="popup-button-cancel">Cancel</button>
          <button onClick={() => onSubmit()} className="popup-button-submit">Submit</button>
        </div> */}
        
      </div>
    </div>
  )
}

export default ImportantPopup