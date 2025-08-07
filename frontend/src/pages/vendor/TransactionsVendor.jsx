import React, {useState,useEffect} from 'react'
import DashboardBox from '../../componants/Main/DashboardBox'
import apiClient from '../../utils/ApiClient';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons'
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import InputText from '../../componants/Main/InputText';
import DateWithIcon from '../../componants/Main/DateWithIcon';
import TextView from '../../componants/Main/TextView';
import SimplePopup from '../../componants/Main/SimplePopup';

const baseId = import.meta.env.VITE_ID_BASE;
const baseUrl = import.meta.env.VITE_API_BASE_IMG_URL;


function TransactionsVendor() {

  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [selectedPosTr, setselectedPosTr] = useState(0);
  const [formData, setFormData] = useState({
        search: ""
  });
  const [showTopUpPopup, setShowTopUpPopup] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [transactionSettings, setTransactionSettings] = useState(null);
  const [showHistoryView, setShowHistoryView] = useState(false);
  const [showCardNumber, setShowCardNumber] = useState(false);
  const [walletData, setWalletData] = useState(null);
  const [walletLoading, setWalletLoading] = useState(true);
  const [showResponsePopup, setShowResponsePopup] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [responseType, setResponseType] = useState('success'); // 'success' or 'error'

  // Helper function to format card number with 4-digit separation
  const formatCardNumber = (cardNumber) => {
    if (!cardNumber) return '';
    // Remove any existing spaces and format with 4-digit groups
    const cleanNumber = cardNumber.replace(/\s/g, '');
    return cleanNumber.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  useEffect(() => {
    fetchTransaction();
    fetchTransactionSettings();
    fetchWalletData();
  },[]);


  ///API CALLING
  const fetchTransaction = async () => {
      setLoading(true);
      try {
      const response = await apiClient.get("/vendor/get_transaction");
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

  const fetchTransactionSettings = async () => {
      try {
          const response = await apiClient.get("/vendor/get_transaction_settings");
          if (response?.result?.status === 1) {
              console.warn("Get Transaction Settings successfully");
              setTransactionSettings(response.result.data);
          } else {
              console.warn("No Transaction Settings found or status != 1");
          }
      } catch (error) {
          console.error("Failed to fetch Transaction Settings:", error);
      }
  };

  const fetchWalletData = async () => {
      setWalletLoading(true);
      try {
          const response = await apiClient.get("/vendor/get_wallet");
          if (response?.result?.status === 1) {
              console.warn("Get wallet details successful");
              setWalletData(response.result.data);
          } else {
              console.warn("No wallet data found or status != 1");
          }
      } catch (error) {
          console.error("Failed to fetch wallet data:", error);
      } finally {
          setWalletLoading(false);
      }
  };

  // Calculate transaction charge based on API settings
  const calculateTransactionCharge = (amount) => {
      if (!amount || amount <= 0 || !transactionSettings) return 0;
      const chargeRate = transactionSettings.transaction_charges || 0;
      return parseFloat((parseFloat(amount) * chargeRate / 100).toFixed(2));
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

  const handleTopUpClick = () => {
      setShowTopUpPopup(true);
  };

  const handleTopUpSubmit = async () => {
      if (!topUpAmount || topUpAmount <= 0) {
          setResponseMessage("Please enter a valid amount");
          setResponseType('error');
          setShowResponsePopup(true);
          return;
      }

      try {
          const response = await apiClient.post("/vendor/add_vendor_topup", {
              transaction_point: parseInt(topUpAmount)
          });

          if (response?.result?.status === 1) {
              console.warn("Top up successful");
              setResponseMessage("Top up successful!");
              setResponseType('success');
              setShowResponsePopup(true);
              setShowTopUpPopup(false);
              setTopUpAmount('');
              // Refresh wallet data and transactions
              fetchWalletData();
              fetchTransaction();
          } else {
              console.warn("Top up failed:", response?.result?.message);
              setResponseMessage("Top up failed: " + (response?.result?.message || "Unknown error"));
              setResponseType('error');
              setShowResponsePopup(true);
          }
      } catch (error) {
          console.error("Failed to process top up:", error);
          setResponseMessage("Top up failed. Please try again.");
          setResponseType('error');
          setShowResponsePopup(true);
      }
  };

  const handleTopUpCancel = () => {
      setShowTopUpPopup(false);
      setTopUpAmount('');
  };

  const handleHistoryClick = () => {
      setShowHistoryView(true);
  };

  const handleCloseHistory = () => {
      setShowHistoryView(false);
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
                            ) : (
                            transactions.map((trItems, index) => (
                              <div className="user-list-item-tr" key={index}>
                                <DashboardBox>
                                      <div className="user-list-item-tr-inside" onClick={() => handleLeadListClick(index)}>
                                        
                                            <div className="user-info-tr">
                                                <DateWithIcon text={new Date(trItems.transaction_created_at).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                    })} >
                                                </DateWithIcon>
                                                <TextView type="subDarkBold" text={trItems.transaction_title}/>
                                                <TextView type="subDark" text={trItems.vendor_name}/>
                                            </div>

                                            <div style={{height: '100%',display: 'flex',justifyContent: 'center',alignItems: 'center',paddingLeft:'10px',paddingRight:'10px',gap:'2px'}}>
                                              <TextView type="darkBold" text={trItems.transaction_type === 1 ? trItems.transaction_cr : trItems.transaction_dr }/>
                                              <TextView type="subDarkBold" text={trItems.transaction_type === 1 ? "Cr" : "Dr" } style={{color:trItems.transaction_type === 1 ? 'green' : 'red'}}/>
                                            </div>
                                            {selectedPosTr === index && (
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

                <div style={{
                  width: '30%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '2px'
                }}>
                    {/* Member detail view */}
                    <div style={{
                        width: '100%',
                        height: '40%',
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '2px'
                        }}>
                        <DashboardBox>
                            <div style={{
                                height: '100%',
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
                                    marginBottom: '10px'
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
                                    marginTop: '15px'
                                }}>
                                    <div>
                                        <img 
                                            src={selectedTransaction?.member_image ? baseUrl+selectedTransaction?.member_image : "/dummy.jpg"} 
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
                                        <TextView type="darkBold" text={selectedTransaction?.member_name ?? "No member name"} style={{marginBottom: '4px'}} />
                                        <TextView type="subDark" text={selectedTransaction?.member_email ?? "No member email"} style={{marginBottom: '8px'}} />
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
                    

                    {/* Wallet detail view */}
                    <div style={{
                        width: '100%',
                        height: '60%',
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
                                         {walletData?.card?.card_status === 1 ? 'Active' : 'Deactivated'}
                                    </div>
                                </div>

                                {/* Wallet Card */}
                                {walletLoading ? (
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
                                ) : walletData?.card ? (
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
                                                {showCardNumber ? formatCardNumber(walletData?.card?.card_no) : '**** **** **** ' + formatCardNumber(walletData?.card?.card_no?.slice(-4))}
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
                                                    {walletData?.card?.card_type}
                                                </div>
                                            </div>
                                            <div>
                                            <div style={{
                                                fontSize: '10px',
                                                opacity: '0.8',
                                                marginBottom: '2px'
                                            }}>
                                                EXPIRES
                                            </div>
                                            <div style={{
                                                fontSize: '12px',
                                                fontWeight: 'bold'
                                            }}>
                                                12/25
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

                                {/* Balance and Top-up Section */}
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '8px'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '8px 0'
                                    }}>
                                        <TextView type="subDark" text="Available Balance" />
                                        <TextView type="darkBold" text={`${walletData?.balance_point || 0} Points`} style={{color: '#2e7d32'}} />
                                    </div>

                                    <div style={{
                                        display: 'flex',
                                        gap: '8px'
                                    }}>
                                        <button 
                                            onClick={handleTopUpClick}
                                            style={{
                                                flex: 1,
                                                padding: '8px 12px',
                                                backgroundColor: '#ffd700',
                                                color: 'black',
                                                border: 'none',
                                                borderRadius: '6px',
                                                fontSize: '12px',
                                                fontWeight: 'bold',
                                                cursor: 'pointer',
                                                transition: 'background-color 0.2s'
                                            }}
                                            onMouseEnter={(e) => e.target.style.backgroundColor = '#ffed4e'}
                                            onMouseLeave={(e) => e.target.style.backgroundColor = '#ffd700'}
                                        >
                                            Top Up
                                        </button>
                                        <button 
                                            onClick={handleHistoryClick}
                                            style={{
                                                flex: 1,
                                                padding: '8px 12px',
                                                backgroundColor: 'transparent',
                                                color: 'black',
                                                border: '1px solid #ffd700',
                                                borderRadius: '6px',
                                                fontSize: '12px',
                                                fontWeight: 'bold',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.backgroundColor = '#ffd700';
                                                e.target.style.color = 'black';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.backgroundColor = 'transparent';
                                                e.target.style.color = 'black';
                                            }}
                                        >
                                            History
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </DashboardBox>
                    </div>

                    
                </div>

                <div style={{
                  width: '35%',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '5px',
                  paddingBottom: '0px'
                }}>
                    <DashboardBox>
                        {/* Transaction Details Card */}
                        <div style={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '20px',
                            gap: '15px',
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                borderBottom: '1px solid #e0e0e0',
                                paddingBottom: '10px'
                            }}>
                                <TextView type="darkBold" text="Transaction Details" />
                                <div style={{
                                    padding: '6px 12px',
                                    borderRadius: '20px',
                                    backgroundColor: selectedTransaction?.transaction_type === 1 ? '#e8f5e8' : '#ffe8e8',
                                    color: selectedTransaction?.transaction_type === 1 ? '#2e7d32' : '#d32f2f',
                                    fontSize: '12px',
                                    fontWeight: 'bold'
                                }}>
                                    {selectedTransaction?.transaction_type === 1 ? 'Credit' : 'Debit'}
                                </div>
                            </div>

                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '12px'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <TextView type="subDark" text="Transaction ID" />
                                    <TextView type="darkBold" text={baseId + (selectedTransaction?.transaction_id || 'N/A')} />
                                </div>

                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <TextView type="subDark" text="Amount" />
                                    <TextView type="darkBold" text={`${selectedTransaction?.transaction_type === 1 ? selectedTransaction?.transaction_cr : selectedTransaction?.transaction_dr || '0'} Points`} />
                                </div>

                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <TextView type="subDark" text="Date" />
                                    <TextView type="darkBold" text={selectedTransaction?.transaction_created_at ? new Date(selectedTransaction.transaction_created_at).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit"
                                    }) : 'N/A'} />
                                </div>

                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <TextView type="subDark" text="Member" />
                                    <TextView type="darkBold" text={selectedTransaction?.member_name || 'N/A'} />
                                </div>

                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <TextView type="subDark" text="Vendor" />
                                    <TextView type="darkBold" text={selectedTransaction?.vendor_name || 'N/A'} />
                                </div>

                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <TextView type="subDark" text="Description" />
                                    <TextView type="darkBold" text={selectedTransaction?.transaction_title || 'N/A'} />
                                </div>

                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <TextView type="subDark" text="Transaction Charge" />
                                    <TextView type="darkBold" text={`${selectedTransaction?.transaction_charge || '0'} Points`} style={{color: '#f57c00'}} />
                                </div>
                            </div>

                            <div style={{
                                marginTop: '20px',
                                padding: '15px',
                                backgroundColor: '#f8f9fa',
                                borderRadius: '8px',
                                border: '1px solid #e9ecef'
                            }}>
                                <TextView type="subDarkBold" text="Transaction Summary" style={{marginBottom: '10px'}} />
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '8px'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between'
                                    }}>
                                        <TextView type="subDark" text="Type" />
                                        <TextView type="darkBold" text={selectedTransaction?.transaction_type === 1 ? 'Credit Transaction' : 'Debit Transaction'} />
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between'
                                    }}>
                                         <div style={{
                                                fontSize: '10px',
                                                opacity: '0.8',
                                                marginBottom: '2px'
                                            }}>
                                                EXPIRES
                                            </div>
                                            <div style={{
                                                fontSize: '12px',
                                                fontWeight: 'bold'
                                            }}>
                                                12/25
                                            </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </DashboardBox>

                    {/* History View */}
                    {showHistoryView && (
                        <div style={{
                            position: 'fixed',
                            top: 0,
                            right: 0,
                            width: '400px',
                            height: '100%',
                            backgroundColor: 'white',
                            boxShadow: '-5px 0 15px rgba(0,0,0,0.1)',
                            zIndex: 1000,
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            {/* Header */}
                            <div style={{
                                padding: '20px',
                                borderBottom: '1px solid #e0e0e0',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <TextView type="darkBold" text="Transaction History" />
                                <button 
                                    onClick={handleCloseHistory}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        fontSize: '20px',
                                        cursor: 'pointer',
                                        color: '#666'
                                    }}
                                >
                                    ×
                                </button>
                            </div>

                            {/* History Content */}
                            <div style={{
                                flex: 1,
                                padding: '20px',
                                overflowY: 'auto'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '15px'
                                }}>
                                    {/* Sample History Items */}
                                    <div style={{
                                        padding: '15px',
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: '8px',
                                        border: '1px solid #e9ecef'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            marginBottom: '8px'
                                        }}>
                                            <TextView type="darkBold" text="Top Up" style={{fontSize: '14px'}} />
                                            <TextView type="darkBold" text="+500 Points" style={{color: '#2e7d32', fontSize: '14px'}} />
                                        </div>
                                        <TextView type="subDark" text="2024-01-15 14:30" style={{fontSize: '12px'}} />
                                    </div>

                                    <div style={{
                                        padding: '15px',
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: '8px',
                                        border: '1px solid #e9ecef'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            marginBottom: '8px'
                                        }}>
                                            <TextView type="darkBold" text="Purchase" style={{fontSize: '14px'}} />
                                            <TextView type="darkBold" text="-200 Points" style={{color: '#d32f2f', fontSize: '14px'}} />
                                        </div>
                                        <TextView type="subDark" text="2024-01-14 10:15" style={{fontSize: '12px'}} />
                                    </div>

                                    <div style={{
                                        padding: '15px',
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: '8px',
                                        border: '1px solid #e9ecef'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            marginBottom: '8px'
                                        }}>
                                            <TextView type="darkBold" text="Top Up" style={{fontSize: '14px'}} />
                                            <TextView type="darkBold" text="+1000 Points" style={{color: '#2e7d32', fontSize: '14px'}} />
                                        </div>
                                        <TextView type="subDark" text="2024-01-10 09:45" style={{fontSize: '12px'}} />
                                    </div>

                                    <div style={{
                                        padding: '15px',
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: '8px',
                                        border: '1px solid #e9ecef'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            marginBottom: '8px'
                                        }}>
                                            <TextView type="darkBold" text="Reward" style={{fontSize: '14px'}} />
                                            <TextView type="darkBold" text="+150 Points" style={{color: '#2e7d32', fontSize: '14px'}} />
                                        </div>
                                        <TextView type="subDark" text="2024-01-08 16:20" style={{fontSize: '12px'}} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>


        </div>

        {/* Top Up Popup */}
        {showTopUpPopup && (
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000
            }}>
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '30px',
                    width: '400px',
                    maxWidth: '90%',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '30px',
                        padding: '15px 20px',
                        borderBottom: '1px solid #e0e0e0',
                        borderRadius: '8px 8px 0 0',
                        height: '10px'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            height: '100%'
                        }}>
                            <TextView type="darkBold" text="Top Up Wallet" style={{fontSize: '18px', margin: 0}} />
                        </div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            height: '100%'
                        }}>
                            <button 
                                onClick={handleTopUpCancel}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '24px',
                                    cursor: 'pointer',
                                    color: '#666',
                                    width: '30px',
                                    height: '30px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: '50%',
                                    transition: 'background-color 0.2s',
                                    margin: 0,
                                    padding: 0
                                }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                            >
                                ×
                            </button>
                        </div>
                    </div>

                    <div style={{
                        marginBottom: '20px'
                    }}>
                        <TextView type="subDark" text="Enter amount to top up:" style={{marginBottom: '8px'}} />
                        <input
                            type="number"
                            value={topUpAmount}
                            onChange={(e) => setTopUpAmount(e.target.value)}
                            placeholder="Enter points amount"
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #ddd',
                                borderRadius: '6px',
                                fontSize: '14px',
                                boxSizing: 'border-box'
                            }}
                        />
                        
                        {/* Transaction Charge Display */}
                        {topUpAmount && topUpAmount > 0 && (
                            <div style={{
                                marginTop: '15px',
                                padding: '12px',
                                backgroundColor: '#fff3e0',
                                borderRadius: '6px',
                                border: '1px solid #ffb74d'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '8px'
                                }}>
                                    <TextView type="subDark" text="Top-up Amount:" />
                                    <TextView type="darkBold" text={`${topUpAmount} Points`} />
                                </div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '8px'
                                }}>
                                    <TextView type="subDark" text="Transaction Charge:" />
                                    <TextView type="darkBold" text={`${calculateTransactionCharge(topUpAmount)} Points`} style={{color: '#f57c00'}} />
                                </div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    borderTop: '1px solid #ffb74d',
                                    paddingTop: '8px'
                                }}>
                                    <TextView type="subDarkBold" text="Total Amount:" />
                                    <TextView type="darkBold" text={`${parseInt(topUpAmount) + calculateTransactionCharge(topUpAmount)} Points`} style={{color: '#2e7d32'}} />
                                </div>
                            </div>
                        )}
                    </div>

                    <div style={{
                        display: 'flex',
                        gap: '10px',
                        justifyContent: 'flex-end'
                    }}>
                        <button 
                            onClick={handleTopUpCancel}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: 'transparent',
                                color: '#666',
                                border: '1px solid #ddd',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '14px'
                            }}
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleTopUpSubmit}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#ffd700',
                                color: 'black',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: 'bold'
                            }}
                        >
                            Top Up
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* Response Popup */}
        {showResponsePopup && (
            <SimplePopup onClose={() => setShowResponsePopup(false)}>
                <div style={{
                    padding: '30px',
                    textAlign: 'center',
                }}>
                    <div style={{
                        marginBottom: '20px'
                    }}>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            backgroundColor: responseType === 'success' ? '#4caf50' : '#f44336',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 15px',
                            color: 'white',
                            fontSize: '24px',
                            fontWeight: 'bold'
                        }}>
                            {responseType === 'success' ? '✓' : '✕'}
                        </div>
                        <TextView 
                            type="darkBold" 
                            text={responseType === 'success' ? 'Success' : 'Error'} 
                            style={{
                                fontSize: '18px',
                                marginBottom: '10px',
                                color: responseType === 'success' ? '#4caf50' : '#f44336'
                            }}
                        />
                        <TextView 
                            type="subDark" 
                            text={responseMessage}
                            style={{
                                fontSize: '14px',
                                lineHeight: '1.4'
                            }}
                        />
                    </div>
                    <button 
                        onClick={() => setShowResponsePopup(false)}
                        style={{
                            padding: '10px 25px',
                            backgroundColor: responseType === 'success' ? '#4caf50' : '#f44336',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            transition: 'opacity 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                        onMouseLeave={(e) => e.target.style.opacity = '1'}
                    >
                        OK
                    </button>
                </div>
            </SimplePopup>
        )}
    </div>
  )
}

export default TransactionsVendor
