import React, {useState,useEffect} from 'react'
import DashboardBox from '../../componants/Main/DashboardBox'
import apiClient from '../../utils/ApiClient';

import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons'
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faEye, faEyeSlash, faInbox } from '@fortawesome/free-solid-svg-icons';

import InputText from '../../componants/Main/InputText';
import DateWithIcon from '../../componants/Main/DateWithIcon';
import TextView from '../../componants/Main/TextView';
import RoundButton from '../../componants/Main/RoundButton';
import RedeemPopup from '../../componants/Main/RedeemPopup';
import StatusBadge from '../../componants/Main/StatusBadge';

const baseId = import.meta.env.VITE_ID_BASE;
const baseUrl = import.meta.env.VITE_API_BASE_IMG_URL;

// Helper function to format card number with 4-digit separation
const formatCardNumber = (cardNumber) => {
  if (!cardNumber) return '';
  // Remove any existing spaces and format with 4-digit groups
  const cleanNumber = cardNumber.replace(/\s/g, '');
  return cleanNumber.replace(/(\d{4})(?=\d)/g, '$1 ');
};

function WalletMember() {

  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [wallet, setWallet] = useState({});
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [selectedPosTr, setselectedPosTr] = useState(0);
  const [availablePoint, setAvailablePoint] = useState(1000);
  const [showRedeemPopup, setShowRedeemPopup] = useState(false);
  const [redeems, setredeems] = useState([]);
  const [selectedReadeem, setSelectedRedeem] = useState(null);
  const [selectedPosRedeem, setselectedPosReadeem] = useState(0);
  const [loadingRdm, setLoadingRdm] = useState(true);
  const [loadingWallet, setLoadingWallet] = useState(true);
  const [showCardNumber, setShowCardNumber] = useState(false);
  const [formData, setFormData] = useState({
        search: ""
  });


  useEffect(() => {
    fetchTransaction();
    fetchRedeem();
    fetchWallet();
  },[]);


  ///API CALLING
  const fetchTransaction = async () => {
      setLoading(true);
      try {
      const response = await apiClient.get("/member/get_transaction");
      if (response?.result?.status === 1) {
          console.warn("Get Transaction successfully");
          setTransactions(response.result.data);
          setSelectedTransaction(response.result.data[0])

      } else {
          console.warn("No Transaction found or status != 1");
      }
      } catch (error) {
      console.error("Failed to fetch Transaction:", error);
      } finally {
      setLoading(false);
      }
  };

  const addRedeem = async (point,notes) => {
      //(true); // Show loader
      try {

          const payload = {
              redeem_point: point,
              redeem_notes: notes
          };
          
          //console.log("SANTHOSH Vendor ID:", payload);
          const data = await apiClient.post("/member/add_redeem", payload);

          //if (data && data.result?.data.status === 1) {
          if (data?.result?.status === 1) {
                setShowRedeemPopup(false)
                fetchRedeem();
          }
      } catch (err) {
          console.error("Something went wrong fetching vendors", err);
      }
      finally {
          //setisLoading(false); // Hide loader
      }
  };

  const fetchRedeem = async () => {
      setLoadingRdm(true);
      try {
      const responseRedeems = await apiClient.get("/member/get_redeem");
      if (responseRedeems?.result?.status === 1) {
          console.warn("Get Redeem successfully");
          setredeems(responseRedeems.result.data);
          setSelectedRedeem(responseRedeems.result.data[0])

      } else {
          console.warn("No Transaction found or status != 1");
      }
      } catch (error) {
      console.error("Failed to fetch Transaction:", error);
      } finally {
      setLoadingRdm(false);
      }
  };

  const fetchWallet = async () => {
      setLoadingWallet(true);
      try {
      const response = await apiClient.get("/member/get_walletDetails");
      if (response?.result?.status === 1) {
          console.warn("Get Transaction successfully");
          setWallet(response.result);
          setLoadingWallet(false)

      } else {
          console.warn("No Transaction found or status != 1");
      }
      } catch (error) {
      console.error("Failed to fetch Transaction:", error);
      } finally {
      setLoadingWallet(false);
      }
  };

  ///CLICKS FUNCTION
  const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
      ...prev,
      [name]: value,
      }));
  };

  const handleLeadListClick = (index) => {
      setselectedPosTr(index)
      console.log("Clicked index:", index);
      console.log("Clicked Sttaus:", transactions[index].lead_status);
      setSelectedTransaction(transactions[index])
  };

  const handleRedeemPopupSubmit = (points,notes) => {
        console.log('Submitted Points:', points);
       addRedeem(points,notes)
  };

  const handleLeadListClickRedeem = (index) => {
      setselectedPosReadeem(index)
      console.log("Clicked index:", index);
      console.log("Clicked Sttaus:", redeems[index].redeem_id);
      setSelectedRedeem(redeems[index])
  };

  const toggleCardNumber = () => {
      setShowCardNumber(!showCardNumber);
  };


  return (
    <div  className='content-view'>

        <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'row'
            }}>

                <div style={{
                  width: '35%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '2px'
                }}>
                    <DashboardBox>
                        {/* Search bar and add button */}
                        <div style={{
                            width: '100%',
                            height: '60px',
                            display: 'flex',
                            flexDirection: 'row',
                            padding: '2px',
                            borderBlock:'boxSizing'}}>

                                <div style={{width: '100%',
                                height: '60px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent:'center',
                                justifyItems: 'center',
                                paddingLeft:'10px',
                                paddingRight:'10px'
                                }}> 

                                   <InputText 
                                        type="name"
                                        placeholder="Search Transaction"
                                        name="search"
                                        value={formData.search}
                                        onChange={handleChange}
                                    />

                                </div>
                        </div>


                        <div className="user-list-scroll-container">
                            {loading ? (
                            <div className="loader-container">
                                <div className="spinner" />
                            </div>
                                                         ) : transactions.length > 0 ? (
                             transactions.map((trItems, index) => (
                               <div className="user-list-item-tr" key={index}>
                                 <DashboardBox>
                                       <div className="user-list-item-tr-inside" onClick={() => handleLeadListClick(index)}>
                                         
                                             <div className="user-info-tr">
                                                 
                                                 <TextView type="subDarkBold" text={trItems.transaction_title}/>
                                                 <TextView type="subDark" text={baseId+trItems.transaction_id}/>
                                                 <TextView type="subDark" text={trItems.vendor_name}/>
                                                 <DateWithIcon text={new Date(trItems.transaction_created_at).toLocaleString("en-US", {
                                                     year: "numeric",
                                                     month: "long",
                                                     day: "numeric",
                                                     hour: "2-digit",
                                                     minute: "2-digit",
                                                     second: "2-digit"
                                                 })} >
                                                 </DateWithIcon>
                                             </div>

                                             <div style={{height: '100%',display: 'flex',justifyContent: 'center',alignItems: 'center',paddingLeft:'10px',paddingRight:'10px',gap:'2px'}}>
                                               <TextView type="darkBold" text={trItems.transaction_type === 1 ? trItems.transaction_cr : trItems.transaction_dr } style={{color: trItems.transaction_type === 1 ? '#2e7d32' : '#d32f2f'}}/>
                                               <TextView type="subDarkBold" text={trItems.transaction_type === 1 ? "Cr" : "Dr" } style={{color:trItems.transaction_type === 1 ? '#2e7d32' : '#d32f2f'}}/>
                                             </div>
                                             {selectedPosTr === index && (
                                                  <div className='tr-list-selection-div'/>
                                             )}
                                             
                                       </div>
                                 </DashboardBox>
                               </div>
                             ))
                           ) : (
                             <div style={{
                                 display: 'flex',
                                 flexDirection: 'column',
                                 alignItems: 'center',
                                 justifyContent: 'center',
                                 padding: '40px 20px',
                                 textAlign: 'center',
                                 height: 'calc(100vh - 200px)',
                                 minHeight: '300px'
                             }}>
                                 <div style={{
                                     fontSize: '48px',
                                     color: '#ccc',
                                     marginBottom: '16px',
                                     display: 'flex',
                                     justifyContent: 'center',
                                     alignItems: 'center'
                                 }}>
                                     <FontAwesomeIcon icon={faInbox} />
                                 </div>
                                 <TextView type="darkBold" text="No Transactions" style={{marginBottom: '8px'}} />
                                 <TextView type="subDark" text="No transaction data available at the moment" />
                             </div>
                           )}
                        </div>

                    </DashboardBox>

                </div>

                <div style={{
                  width: '30%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '2px'
                }}>
                    {/* Transaction detalil view */}
                    <div style={{
                        width: '100%',
                        height: '30%',
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '2px'
                        }}>
                        <DashboardBox>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                padding: '15px',
                                gap: '15px'
                            }}>
                                {/* Header */}
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '0px'
                                }}>
                                    <TextView type="darkBold" text="Member Details" />
                                    <div style={{
                                        padding: '4px 12px',
                                        backgroundColor: '#e8f5e8',
                                        borderRadius: '20px',
                                        fontSize: '11px',
                                        color: '#2e7d32',
                                        fontWeight: 'bold'
                                    }}>
                                        Active Member
                                    </div>
                                </div>

                                {/* Member Profile Section */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '15px',
                                    padding: '0px',
                                    borderRadius: '12px',
                                    marginTop: '0px'
                                }}>
                                    <div>
                                        <img 
                                            src={selectedTransaction?.vendor_image ? baseUrl+selectedTransaction?.vendor_image : "/dummy.jpg"} 
                                            alt="Member" 
                                            style={{
                                                width: '80px',
                                                height: '80px',
                                                borderRadius: '50%',
                                                objectFit: 'cover',
                                                border: '3px solid #fff',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                            }}
                                        />
                                    </div>
                                    
                                    <div style={{
                                        flex: 1
                                    }}>
                                        <TextView type="darkBold" text={selectedTransaction?.vendor_name ?? "No member name"} style={{marginBottom: '4px'}} />
                                        <TextView type="subDark" text={selectedTransaction?.vendor_email ?? "No member email"} style={{marginBottom: '8px'}} />
                                        <div className="button-row" style={{justifyContent: 'flex-start'}}>
                                            <button className="circle-btn-light">
                                                <FontAwesomeIcon icon={faPhone} />
                                            </button>
                                            <button className="circle-btn-light">
                                                <FontAwesomeIcon icon={faLocationDot} />
                                            </button>
                                            <button className="circle-btn-light">
                                                <FontAwesomeIcon icon={faExchangeAlt} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </DashboardBox>
                    </div>

                    <div style={{
                        width: '100%',
                        height: '40%',
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '2px'
                        }}>
                        <DashboardBox>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                padding: '15px',
                                gap: '10px'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '5px'
                                }}>
                                    <TextView type="darkBold" text="Wallet" />
                                    <div style={{
                                        padding: '4px 8px',
                                        backgroundColor: '#e3f2fd',
                                        borderRadius: '12px',
                                        fontSize: '11px',
                                        color: '#1976d2',
                                        fontWeight: 'bold'
                                    }}>
                                         {wallet?.card?.card_status === 1 ? 'Active' : 'Deactivated'}
                                    </div>
                                </div>

                                {/* Wallet Card */}
                                {loadingWallet ? (
                                    <div style={{
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        borderRadius: '12px',
                                        padding: '15px',
                                        color: 'white',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        height: '120px'
                                    }}>
                                        <div className="spinner" style={{borderColor: 'white', borderTopColor: 'transparent'}}></div>
                                    </div>
                                ) : wallet?.card ? (
                                    <div style={{
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        borderRadius: '12px',
                                        padding: '15px',
                                        color: 'white',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
                                    }}>
                                        {/* Card Chip */}
                                        <div style={{
                                            width: '40px',
                                            height: '30px',
                                            backgroundColor: '#ffd700',
                                            borderRadius: '4px',
                                            marginBottom: '40px'

                                        }}></div>

                                        {/* Card Number */}
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            marginBottom: '20px',
                                            gap: '10px'
                                        }}>
                                            <div style={{
                                                fontSize: '16px',
                                                letterSpacing: '2px',
                                                fontFamily: 'monospace',
                                                lineHeight: '1'
                                            }}>
                                                {showCardNumber ? formatCardNumber(wallet?.card?.card_no) : '**** **** **** ' + formatCardNumber(wallet?.card?.card_no?.slice(-4))}
                                            </div>
                                            <button 
                                                onClick={toggleCardNumber}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    color: 'white',
                                                    cursor: 'pointer',
                                                    padding: '4px',
                                                    borderRadius: '50%',
                                                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                                    transition: 'background-color 0.2s',
                                                    width: '24px',
                                                    height: '24px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    marginTop: '2px'
                                                }}
                                                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
                                                onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
                                            >
                                                <FontAwesomeIcon 
                                                    icon={showCardNumber ? faEyeSlash : faEye} 
                                                    style={{fontSize: '10px'}}
                                                />
                                            </button>
                                        </div>

                                        {/* Card Details */}
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'flex-end'
                                        }}>
                                            <div>
                                                <div style={{
                                                    fontSize: '10px',
                                                    opacity: '0.8',
                                                    marginBottom: '2px'
                                                }}>
                                                    CARD TYPE
                                                </div>
                                                <div style={{
                                                    fontSize: '12px',
                                                    fontWeight: 'bold'
                                                }}>
                                                    {wallet?.card?.card_type_name}
                                                </div>
                                            </div>
                                            <div>
                                                <div style={{
                                                    fontSize: '10px',
                                                    opacity: '0.8',
                                                    marginBottom: '2px'
                                                }}>
                                                    BALANCE
                                                </div>
                                                <div style={{
                                                    fontSize: '12px',
                                                    fontWeight: 'bold'
                                                }}>
                                                    {wallet?.available_point?.user_balance ? wallet?.available_point?.user_balance : 0}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Decorative Elements */}
                                        <div style={{
                                            position: 'absolute',
                                            top: '-20px',
                                            right: '-20px',
                                            width: '80px',
                                            height: '80px',
                                            borderRadius: '50%',
                                            backgroundColor: 'rgba(255, 255, 255, 0.1)'
                                        }}></div>
                                    </div>
                                ) : (
                                    <div style={{
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        borderRadius: '12px',
                                        padding: '15px',
                                        color: 'white',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        height: '120px'
                                    }}>
                                        <div style={{textAlign: 'center'}}>
                                            <div style={{fontSize: '14px', marginBottom: '5px'}}>No Card Available</div>
                                            <div style={{fontSize: '12px', opacity: '0.8'}}>Contact support to get a card</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </DashboardBox>
                    </div>

                    {/* Redeem detail view */}
                    <div style={{
                        width: '100%',
                        height: '30%',
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '2px'
                        }}>
                        <DashboardBox>

                          <div className="user-list-item-redeem-inside" >      
                              <div className="user-info-tr">
                                  <DateWithIcon text={new Date(selectedReadeem?.redeem_created_at).toLocaleString("en-US", {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      second: "2-digit"
                                  })} >
                                  </DateWithIcon>
                                  <TextView type="subDarkBold" text={selectedReadeem?.notes}/>
                                    <StatusBadge status={selectedReadeem?.redeem_status==0 ? 0 : selectedReadeem?.redeem_status==1 ? 3 : 4 } />
                                  <TextView type="subDark" text={baseId+selectedReadeem?.redeem_id}/>
                                  
                              </div> 

                              <div style={{height: '100%',display: 'flex',justifyContent: 'center',alignItems: 'center',paddingLeft:'10px',paddingRight:'10px',gap:'2px'}}>
                                <TextView type="darkBold" text={selectedReadeem?.point}/>
                              </div>
                          </div>
                          <div style={{paddingLeft:'10px',paddingRight:'10px',paddingBottom:'10px'}}>
                              <TextView type="subDarkBold" text="Notes :"/>   
                              <TextView type="subDark" text={selectedReadeem?.redeem_comment}/>                  
                          </div>
                          

                        </DashboardBox>
                    </div>

                    
                </div>

                <div style={{
                  width: '35%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '5px'
                }}>
                    <DashboardBox>
                        {/* Search bar and add button */}
                        <div style={{
                            width: '100%',
                            height: '60px',
                            display: 'flex',
                            flexDirection: 'row',
                            padding: '2px',
                            borderBlock:'boxSizing'}}>

                                <div style={{width: '100%',
                                height: '60px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent:'center',
                                justifyItems: 'center',
                                paddingLeft:'10px',
                                paddingRight:'10px'
                                }}> 

                                   <InputText 
                                        type="name"
                                        placeholder="Search Redeem Requests"
                                        name="search"
                                        value={formData.search}
                                        onChange={handleChange}
                                    />

                                </div>

                                <div style={{
                                width: '55px',
                                height: '60px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                paddingRight:'10px',
                                paddingLeft:'0px'}}> 
                                    <RoundButton icon={faPlus} onClick={() => setShowRedeemPopup(true)}/>
                                </div>  
                        </div>


                        <div className="user-list-scroll-container">
                            {loadingRdm ? (
                            <div className="loader-container">
                                <div className="spinner" />
                            </div>
                            ) : (
                            redeems.map((rdmItems, index) => (
                              <div className="user-list-item-rdm" key={index}>
                                <DashboardBox>
                                      <div className="user-list-item-tr-inside" onClick={() => handleLeadListClickRedeem(index)}>
                                        
                                            <div className="user-info-tr">
                                                <DateWithIcon text={new Date(rdmItems.redeem_created_at).toLocaleString("en-US", {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    second: "2-digit"
                                                })} >
                                                </DateWithIcon>
                                                <TextView type="subDarkBold" text={rdmItems.notes}/>
                                                 <StatusBadge status={rdmItems.redeem_status==0 ? 0 : rdmItems.redeem_status==1 ? 3 : 4 } />
                                                <TextView type="subDark" text={baseId+rdmItems.redeem_id}/>
                                               
                                            </div> 

                                            <div style={{height: '100%',display: 'flex',justifyContent: 'center',alignItems: 'center',paddingLeft:'10px',paddingRight:'10px',gap:'2px'}}>
                                              <TextView type="darkBold" text={rdmItems.point}/>
                                            </div>
                                            {selectedPosRedeem === index && (
                                                 <div className='tr-list-selection-div'/>
                                            )}
                                            
                                      </div>
                                </DashboardBox>
                              </div>
                            ))
                          )}
                        </div>

                    </DashboardBox>

                </div>


        </div>

        {showRedeemPopup && (
            <RedeemPopup
            point = {wallet?.available_point?.user_balance}
            onClose={() => setShowRedeemPopup(false)}
            onSubmit={handleRedeemPopupSubmit}
            />
        )}

    </div>
  )
}

export default WalletMember
