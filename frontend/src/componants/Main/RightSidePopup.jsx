import React from 'react'
import './Main.css'

function RightSidePopup({ isOpen, onClose, onSubmit, children,isloading=false}) {
  return (
    <>
     
      <div className={`right-popup ${isOpen ? 'open' : ''}`}>

        {isloading ? (
            <div className="loader-container">
                <div className="spinner" />
            </div>
            ) : (

        <div className="popup-content">
          {children}
          <div className="popup-actions">
            <button className="btn cancel-btn" onClick={onClose}>Cancel</button>
            <button className="btn submit-btn" onClick={onSubmit}>Submit</button>
          </div>
        </div>

        )}
      </div>

      {isOpen && <div className="overlay" onClick={onClose}></div>}
                           
    </>
  )
}

export default RightSidePopup


// Example

{/* <RightSidePopup
  isOpen={showPopup}
  onClose={() => setShowPopup(false)}
  onSubmit={() => {
    console.log('Submit clicked');
    setShowPopup(false);
  }}
 > */}
//   <h3>Form Title</h3>
//   <input type="text" placeholder="Type something..." />
// </RightSidePopup>