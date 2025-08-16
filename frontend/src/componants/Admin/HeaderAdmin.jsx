import React from 'react'
import '/src/App.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { clearData } from '../../utils/clearData';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

function HeaderAdmin({ selected, setSelected }) {
  
  return (
    <div className='header-view'>
          <div className='header-view-inside'> 
    
            <div className='div-items-view'>
                <div className={selected === 'dashboard' ? 'div-tab-selected' : 'div-tab'}
          onClick={() => setSelected('dashboard')}>
                  Dashboard
                </div>

                
                <div className={selected === 'leads' ? 'div-tab-selected' : 'div-tab'}
          onClick={() => setSelected('leads')}>
                  Leads
                </div>

                {/* <div className={selected === 'transaction' ? 'div-tab-selected' : 'div-tab'}
          onClick={() => setSelected('transaction')}>
                  Transactions
                </div> */}

                <div className={selected === 'wallet' ? 'div-tab-selected' : 'div-tab'}
          onClick={() => setSelected('wallet')}>
                  Wallet
                </div>
  
                 <div className={selected === 'members' ? 'div-tab-selected' : 'div-tab'}
          onClick={() => setSelected('members')}>
                  Users
                </div>
    
                {/* <div className={selected === 'vendor' ? 'div-tab-selected' : 'div-tab'}
          onClick={() => setSelected('vendor')}>
                  Vendor
                </div> */}
    
                <div className={selected === 'complaints' ? 'div-tab-selected' : 'div-tab'}
          onClick={() => setSelected('complaints')}>
                  Complaints
                </div>

                <div className={selected === 'card' ? 'div-tab-selected' : 'div-tab'}
          onClick={() => setSelected('card')}>
                  Card
                </div>

                <div className={selected === 'offers' ? 'div-tab-selected' : 'div-tab'}
          onClick={() => setSelected('offers')}>
                  Products
                </div>
    
                <div className={selected === 'report' ? 'div-tab-selected' : 'div-tab'}
          onClick={() => setSelected('report')}>
                  Report
                </div>
    
            </div>
            
            <div className='div-setings'>
                <div className={selected === 'settings' ? 'div-setings-selected' : 'div-setings-non'}
                onClick={() => setSelected('settings')}>
                  <FontAwesomeIcon icon={faGear} style={{ color: "black" }} />
                  <span style={{ color: "black", marginLeft: 4, fontWeight: "bold" }} >Settings</span>
                </div>
            </div>

            <div className='div-profile'>
              <div className={selected === 'logout' ? 'div-profile-selected' : ''}
           
              onClick={() => clearData()}>
                <FontAwesomeIcon icon={faRightFromBracket} style={{ color: "black" }} />
              </div>
            </div>
    
            <div className='div-profile'>
            <div className={selected === 'notification' ? 'div-profile-selected' : ''}
              onClick={() => setSelected('notification')}>
              <FontAwesomeIcon icon={faBell} style={{ color: "black" }} />
              </div>
            </div>
    
            <div className='div-profile'>
            <div className={selected === 'profile' ? 'div-profile-selected' : ''}
          onClick={() => setSelected('profile')}>
              <FontAwesomeIcon icon={faUser} style={{ color: "black" }} />
              </div>
            </div>
    
            
    
          </div>
        </div>
  )
}

export default HeaderAdmin
