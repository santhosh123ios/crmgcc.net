import React from 'react'
import '/src/App.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { faGear } from "@fortawesome/free-solid-svg-icons";

const Header = () => {
  return (
    <div className='header-view'>
      <div className='header-view-inside'> 

        <div className='div-items-view'>
            <div className='div-tab-selected'>
              Dashboard
            </div>

            <div className='div-tab'>
              Members
            </div>

            <div className='div-tab'>
              Vendor
            </div>

            <div className='div-tab'>
              Transactions
            </div>

            <div className='div-tab'>
              Requests
            </div>

            <div className='div-tab'>
              Card
            </div>

            <div className='div-tab'>
              Complaints
            </div>

            <div className='div-tab'>
              Complaints
            </div>

        </div>
        
        <div className='div-setings'>
          <FontAwesomeIcon icon={faGear} style={{ color: "black" }} />
          <span style={{ color: "black", marginLeft: 4, fontWeight: "bold" }} >Settings</span>
        </div>

        <div className='div-profile'>
          <FontAwesomeIcon icon={faBell} style={{ color: "black" }} />
        </div>

        <div className='div-profile'>
          <FontAwesomeIcon icon={faUser} style={{ color: "black" }} />
        </div>

        

      </div>
    </div>
  )
}

export default Header
