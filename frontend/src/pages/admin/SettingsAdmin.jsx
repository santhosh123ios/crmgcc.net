import React,{useState} from 'react'
import DashboardBox from '../../componants/Main/DashboardBox'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear,faStore,faCreditCard} from "@fortawesome/free-solid-svg-icons";
import SettingsGeneral from './SettingsGeneral';
import SettingsMember from './SettingsMember';
import SettingsBrand from './SettingsBrand';
import SettingsTransaction from './SettingsTransaction';

function SettingsAdmin() {

const [selected, setSelected] = useState("general");
const [tabStatus, setTabStatus] = useState(false);

const renderContent = () => {
    switch (selected) {
      case 'general':
        return <SettingsGeneral/>;
      case 'brand':
        return <SettingsBrand/>;
      case 'member':
        return <SettingsMember/>;
      case 'transaction':
        return <SettingsTransaction/>;

      default:
        return <SettingsGeneral />;
    }
  };

  return (
    <div  className='content-view'>

        <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'row',
            }}>
                {/* Memu bar */}
                <div style={{
                  width: tabStatus?'15%':'3.5%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '0px',
                  transition: 'width 0.3s ease, transform 0.3s ease',
                }}
                onMouseEnter={() => setTabStatus(true)}
                onMouseLeave={() => setTabStatus(false)}
                >
                    <DashboardBox>
                        {/* Search bar and add button */}
                        <div style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'row',
                            padding: '0px',
                            marginTop: '2px',
                            borderBlock:'boxSizing'}}>

                            <div className='side-view-inside'> 
                                <div className='div-items-view-menu'>

                                    <div className='div-tab-menu-new'>
                                        <div className={tabStatus? selected === 'general' ? 'div-tab-menu-selected' : 'div-tab-menu': selected === 'general' ? 'div-tab-menu-selected-icon' : 'div-tab-menu-icon'}
                                            onClick={() => setSelected('general')}>
                                            <FontAwesomeIcon icon={faGear} style={{ color: selected ==='general' ? "white": "black"  }} />
                                            {tabStatus && (
                                               <span className={selected === 'general' ? 'span-tab-menu-selected':'span-tab-menu'} >General</span>
                                            )}
                                            
                                        </div>
                                    </div>
                                    
                                    <div className='div-tab-menu-new'>
                                        <div className={selected === 'brand' ? 'div-tab-menu-selected' : 'div-tab-menu'}
                                        onClick={() => setSelected('brand')}>
                                            <FontAwesomeIcon icon={faStore} style={{ color: selected ==='brand' ? "white": "black" }} />
                                            {tabStatus && (
                                               <span className={selected === 'brand' ? 'span-tab-menu-selected':'span-tab-menu'}>Brand</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className='div-tab-menu-new'>
                                        <div className={tabStatus? selected === 'member' ? 'div-tab-menu-selected' : 'div-tab-menu': selected === 'member' ? 'div-tab-menu-selected-icon' : 'div-tab-menu-icon'}
                                            onClick={() => setSelected('member')}>
                                            <FontAwesomeIcon icon={faGear} style={{ color: selected ==='member' ? "white": "black"  }} />
                                            {tabStatus && (
                                               <span className={selected === 'member' ? 'span-tab-menu-selected':'span-tab-menu'} >Member</span>
                                            )}
                                            
                                        </div>
                                    </div>

                                    <div className='div-tab-menu-new'>
                                        <div className={tabStatus? selected === 'transaction' ? 'div-tab-menu-selected' : 'div-tab-menu': selected === 'transaction' ? 'div-tab-menu-selected-icon' : 'div-tab-menu-icon'}
                                            onClick={() => setSelected('transaction')}>
                                            <FontAwesomeIcon icon={faCreditCard} style={{ color: selected ==='transaction' ? "white": "black"  }} />
                                            {tabStatus && (
                                               <span className={selected === 'transaction' ? 'span-tab-menu-selected':'span-tab-menu'} >Transaction</span>
                                            )}
                                            
                                        </div>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                    </DashboardBox>
                </div>

                <div style={{
                  width: '1%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}></div>

                <div style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '0px',
                  boxSizing:'border-box'
                }}>
                   {renderContent()}
                </div>
            
            </div>
        </div>
  )
}

export default SettingsAdmin
