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
        search: "",
        cardNumber: "",
        offerCode: ""
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
  
  // Member Point Check states
  const [memberPointLoading, setMemberPointLoading] = useState(false);
  const [memberPointResult, setMemberPointResult] = useState(null);
  const [memberPointError, setMemberPointError] = useState('');
  
  // Point Redeem Popup states
  const [showPointRedeemPopup, setShowPointRedeemPopup] = useState(false);
  const [redeemAmount, setRedeemAmount] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [redeemLoading, setRedeemLoading] = useState(false);
  const [redeemError, setRedeemError] = useState('');
  const [redeemSuccess, setRedeemSuccess] = useState(false);

  // Helper function to format card number with 4-digit separation
  const formatCardNumber = (cardNumber) => {
    if (!cardNumber) return '';
    // Remove any existing spaces and format with 4-digit groups
    const cleanNumber = cardNumber.replace(/\s/g, '');
    return cleanNumber.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  // Helper function to validate card number format
  const validateCardNumber = (cardNumber) => {
    if (!cardNumber) return false;
    // Remove spaces and check if it's numeric and has reasonable length
    const cleanNumber = cardNumber.replace(/\s/g, '');
    return /^\d{8,19}$/.test(cleanNumber); // Most card numbers are 8-19 digits
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

  // Member Point Check API
  const handleMemberPointCheck = async () => {
      if (!formData.cardNumber) {
          setMemberPointError('Please enter a card number');
          return;
      }

      if (!validateCardNumber(formData.cardNumber)) {
          setMemberPointError('Please enter a valid card number (8-19 digits)');
          return;
      }

      setMemberPointLoading(true);
      setMemberPointError('');
      setMemberPointResult(null);

      try {
          const requestData = {
            card_no: formData.cardNumber
          };

          const response = await apiClient.post("/vendor/check_member_points", requestData);
          
          if (response?.result?.status === 1) {
              console.warn("Member point check successful");
              setMemberPointResult({
                  memberName: response.result.data.member_name,
                  cardStatus: response.result.data.card_status === 1 ? 'Active' : 'Deactivated',
                  availablePoints: response.result.data.available_points,
                  offerCode: formData.offerCode,
                  offerValid: response.result.data.offer_valid || false,
                  offerDiscount: response.result.data.offer_discount || null
              });
          } else {
              setMemberPointError(response?.result?.message || 'Failed to check member points');
          }
      } catch (error) {
          console.error("Failed to check member points:", error);
          setMemberPointError('Network error. Please try again.');
      } finally {
          setMemberPointLoading(false);
      }
  };

  // Point Redeem API
  const handlePointRedeem = async () => {
      if (!redeemAmount || redeemAmount <= 0) {
          setRedeemError('Please enter a valid redeem amount');
          return;
      }

      if (!verificationCode || verificationCode.length !== 4) {
          setRedeemError('Please enter a 4-digit verification code');
          return;
      }

      if (parseInt(redeemAmount) > parseInt(memberPointResult.availablePoints)) {
          setRedeemError('Redeem amount cannot exceed available points');
          return;
      }

      // Additional validation
      if (parseInt(redeemAmount) < 1) {
          setRedeemError('Redeem amount must be at least 1 point');
          return;
      }

      setRedeemLoading(true);
      setRedeemError('');

      try {
          const requestData = {
              card_number: formData.cardNumber,
              redeem_amount: parseInt(redeemAmount),
              verification_code: verificationCode
          };

          const response = await apiClient.post("/vendor/redeem_member_points", requestData);
          
          if (response?.result?.status === 1) {
              console.warn("Point redeem successful");
              setRedeemSuccess(true);
              // Update the member point result with new balance
              setMemberPointResult(prev => ({
                  ...prev,
                  availablePoints: prev.availablePoints - parseInt(redeemAmount)
              }));
              // Refresh transactions
              fetchTransaction();
          } else {
              setRedeemError(response?.result?.message || 'Failed to redeem points');
          }
      } catch (error) {
          console.error("Failed to redeem points:", error);
          setRedeemError('Network error. Please try again.');
      } finally {
          setRedeemLoading(false);
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
      
      // Clear member point results when card number changes
      if (name === 'cardNumber') {
          setMemberPointResult(null);
          setMemberPointError('');
      }
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

  // Point Redeem Popup handlers
  const openPointRedeemPopup = () => {
      if (memberPointResult && memberPointResult.availablePoints > 0) {
          setShowPointRedeemPopup(true);
          setRedeemAmount('');
          setVerificationCode('');
          setRedeemError('');
          setRedeemSuccess(false);
          
          // Generate demo verification code (in real app, this would be sent via SMS/email)
          const demoCode = Math.floor(1000 + Math.random() * 9000).toString();
          console.log('Demo verification code:', demoCode);
      }
  };

  const closePointRedeemPopup = () => {
      setShowPointRedeemPopup(false);
      setRedeemAmount('');
      setVerificationCode('');
      setRedeemError('');
      setRedeemSuccess(false);
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

                    {/* Member point redeem view */}
                    <div style={{
                        width: '100%',
                        height: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '5px'
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
                                    marginBottom: '0px',
                                }}>
                                    <TextView type="darkBold" text="Member Point Check" />
                                </div>

                                {/* Input Fields */}
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0px',
                                    borderRadius: '8px',
                                }}>
                                    {/* Card Number Input */}
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '0px',
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}>
                                            <TextView type="subDark" text="Card Number or Offer Code" />
                                            {formData.cardNumber && (
                                                <div style={{
                                                    fontSize: '11px',
                                                    color: validateCardNumber(formData.cardNumber) ? '#28a745' : '#dc3545'
                                                }}>
                                                    {validateCardNumber(formData.cardNumber) ? '✓ Valid' : '✗ Invalid'}
                                                </div>
                                            )}
                                        </div>

                                        <div style={{
                                            width: '100%',
                                            height: '50px',
                                            display: 'flex',
                                            flexDirection: 'row',
                                            padding: '0px',
                                            gap: '10px',
                                            borderBlock:'boxSizing',
                                            marginTop:'5px'
                                        }}>

                                            <div 
                                                style={{
                                                    width: '100%',
                                                    height: '50px',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    justifyContent:'center',
                                                    justifyItems: 'center',
                                                    paddingLeft:'0px',
                                                    paddingRight:'0px',
                                                    marginTop:'0px'
                                            }}> 

                                                <InputText
                                                type="text"
                                                placeholder="Enter card number or offer code"
                                                name="cardNumber"
                                                value={formData.cardNumber || ''}
                                                onChange={handleChange}/>

                                            </div>
                                            {/* Action Buttons */}
                                            <div style={{
                                                display: 'flex',
                                                gap: '10px',
                                                marginTop: '0px',
                                                padding:'0px',
                                                margin:'0px'
                                            }}>
                                                <button
                                                    onClick={handleMemberPointCheck}
                                                    disabled={!formData.cardNumber || memberPointLoading}
                                                    style={{
                                                        backgroundColor: formData.cardNumber ? 'var(--highlight-color)' : '#e0e0e0',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '20px',
                                                        padding: '12px 24px',
                                                        fontSize: '14px',
                                                        fontWeight: 'bold',
                                                        cursor: formData.cardNumber ? 'pointer' : 'not-allowed',
                                                        transition: 'all 0.3s ease',
                                                        flex: 1,
                                                        margin:'0px',
                                                        height:'40px',
                                                        marginTop:'5px'
                                                    }}
                                                >
                                                    {memberPointLoading ? 'Checking...' : 'Offer'}
                                                </button>
                                            </div>

                                            {/* Action Buttons */}
                                            <div style={{
                                                display: 'flex',
                                                gap: '10px',
                                                marginTop: '0px',
                                                padding:'0px',
                                                margin:'0px'
                                            }}>
                                                <button
                                                    onClick={handleMemberPointCheck}
                                                    disabled={!formData.cardNumber || memberPointLoading}
                                                    style={{
                                                        backgroundColor: formData.cardNumber ? 'var(--highlight-color)' : '#e0e0e0',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '20px',
                                                        padding: '12px 24px',
                                                        fontSize: '14px',
                                                        fontWeight: 'bold',
                                                        cursor: formData.cardNumber ? 'pointer' : 'not-allowed',
                                                        transition: 'all 0.3s ease',
                                                        flex: 1,
                                                        margin:'0px',
                                                        height:'40px',
                                                        marginTop:'5px'
                                                    }}
                                                >
                                                    {memberPointLoading ? 'Checking...' : 'Point'}
                                                </button>
                                            </div>

                                        </div>

                                        
                                    
                                    </div>

                                    

                                    
                                </div>

                                {/* Results Display */}
                                {memberPointLoading && (
                                    <div style={{
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: '12px',
                                        padding: '20px',
                                        border: '1px solid #e9ecef',
                                        textAlign: 'center'
                                    }}>
                                        <div className="spinner" style={{
                                            borderColor: 'var(--highlight-color)',
                                            borderTopColor: 'transparent',
                                            margin: '0 auto 10px auto'
                                        }}></div>
                                        <TextView type="subDark" text="Checking member points and offers..." />
                                    </div>
                                )}
                                
                                {memberPointResult && !memberPointLoading && (
                                    <div style={{
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: '12px',
                                        padding: '15px',
                                        border: '1px solid #e9ecef'
                                    }}>
                                        <TextView type="darkBold" text="Member Information" style={{marginBottom: '10px'}} />
                                        
                                        {/* Member Details */}
                                        <div style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '8px',
                                            marginBottom: '15px'
                                        }}>
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}>
                                                <TextView type="subDark" text="Member Name:" />
                                                <TextView type="dark" text={memberPointResult.memberName || 'N/A'} />
                                            </div>
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}>
                                                <TextView type="subDark" text="Card Status:" />
                                                <div style={{
                                                    padding: '4px 8px',
                                                    backgroundColor: memberPointResult.cardStatus === 'Active' ? '#d4edda' : '#f8d7da',
                                                    borderRadius: '12px',
                                                    fontSize: '11px',
                                                    color: memberPointResult.cardStatus === 'Active' ? '#155724' : '#721c24',
                                                    fontWeight: 'bold'
                                                }}>
                                                    {memberPointResult.cardStatus || 'N/A'}
                                                </div>
                                            </div>
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}>
                                                <TextView type="subDark" text="Available Points:" />
                                                <TextView type="darkBold" text={memberPointResult.availablePoints || '0'} style={{color: '#28a745'}} />
                                            </div>
                                        </div>

                                        {/* Redeem Points Button */}
                                        {memberPointResult.availablePoints > 0 && (
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                marginTop: '15px'
                                            }}>
                                                <button
                                                    onClick={openPointRedeemPopup}
                                                    style={{
                                                        backgroundColor: 'var(--highlight-color)',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '20px',
                                                        padding: '12px 24px',
                                                        fontSize: '14px',
                                                        fontWeight: 'bold',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.3s ease',
                                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                                                    }}
                                                >
                                                    Redeem Points
                                                </button>
                                            </div>
                                        )}

                                        {/* Offer Information */}
                                        {formData.offerCode && (
                                            <div style={{
                                                borderTop: '1px solid #dee2e6',
                                                paddingTop: '15px'
                                            }}>
                                                <TextView type="darkBold" text="Offer Information" style={{marginBottom: '10px'}} />
                                                <div style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: '8px'
                                                }}>
                                                    <div style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center'
                                                    }}>
                                                        <TextView type="subDark" text="Offer Code:" />
                                                        <TextView type="dark" text={memberPointResult.offerCode || 'N/A'} />
                                                    </div>
                                                    <div style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center'
                                                    }}>
                                                        <TextView type="subDark" text="Offer Status:" />
                                                        <div style={{
                                                            padding: '4px 8px',
                                                            backgroundColor: memberPointResult.offerValid ? '#d4edda' : '#f8d7da',
                                                            borderRadius: '12px',
                                                            fontSize: '11px',
                                                            color: memberPointResult.offerValid ? '#155724' : '#721c24',
                                                            fontWeight: 'bold'
                                                        }}>
                                                            {memberPointResult.offerValid ? 'Valid' : 'Invalid'}
                                                        </div>
                                                    </div>
                                                    {memberPointResult.offerValid && (
                                                        <div style={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center'
                                                        }}>
                                                            <TextView type="subDark" text="Discount:" />
                                                            <TextView type="darkBold" text={memberPointResult.offerDiscount || 'N/A'} style={{color: '#28a745'}} />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Error Message */}
                                {memberPointError && (
                                    <div style={{
                                        backgroundColor: '#f8d7da',
                                        color: '#721c24',
                                        borderRadius: '8px',
                                        padding: '12px',
                                        border: '1px solid #f5c6cb',
                                        fontSize: '14px'
                                    }}>
                                        {memberPointError}
                                    </div>
                                )}
                            </div>
                        </DashboardBox>
                    </div>
                    

                    {/* Wallet detail view */}
                    <div style={{
                        width: '100%',
                        height: '100%',
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
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '5px',
                  paddingBottom: '0px'
                }}>

                    {/* Member detail view */}
                    <div style={{
                        width: '100%',
                        height: '35%',
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
                                    marginBottom: '30px'
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

                    <div style={{
                      width: '100%',
                      height: '100%',
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
                    
                    </div>

                    
                    

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

        {/* Point Redeem Popup */}
        {showPointRedeemPopup && (
            <SimplePopup onClose={closePointRedeemPopup}>
                <div style={{
                    padding: '30px',
                    textAlign: 'center',
                }}>
                    {/* Header */}
                    <div style={{
                        marginBottom: '30px',
                        padding: '20px',
                        backgroundColor: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                        borderRadius: '20px',
                        background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                        color: 'white',
                        textAlign: 'center',
                        boxShadow: '0 4px 15px rgba(40, 167, 69, 0.3)'
                    }}>
                        <div style={{
                            width: '70px',
                            height: '70px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 20px',
                            color: 'white',
                            fontSize: '28px',
                            fontWeight: 'bold',
                            border: '3px solid rgba(255, 255, 255, 0.3)'
                        }}>
                            💰
                        </div>
                        <TextView 
                            type="darkBold" 
                            text="Redeem Member Points" 
                            style={{
                                fontSize: '20px',
                                marginBottom: '12px',
                                color: 'white'
                            }}
                        />
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                            marginBottom: '5px'
                        }}>
                            <TextView 
                                type="subDark" 
                                text={`Member: ${memberPointResult?.memberName || 'N/A'}`}
                                style={{
                                    fontSize: '14px',
                                    color: 'rgba(255, 255, 255, 0.9)'
                                }}
                            />
                            <TextView 
                                type="subDark" 
                                text={`Available Points: ${memberPointResult?.availablePoints || 0}`}
                                style={{
                                    fontSize: '16px',
                                    color: 'white',
                                    fontWeight: 'bold'
                                }}
                            />
                        </div>
                    </div>

                    {/* Success Message */}
                    {redeemSuccess && (
                        <div style={{
                            backgroundColor: 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)',
                            background: 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)',
                            color: '#155724',
                            borderRadius: '16px',
                            padding: '20px',
                            marginBottom: '25px',
                            border: '2px solid #c3e6cb',
                            textAlign: 'center',
                            boxShadow: '0 4px 15px rgba(40, 167, 69, 0.2)'
                        }}>
                            <div style={{
                                width: '50px',
                                height: '50px',
                                borderRadius: '50%',
                                backgroundColor: '#28a745',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 15px',
                                color: 'white',
                                fontSize: '20px',
                                fontWeight: 'bold'
                            }}>
                                ✓
                            </div>
                            <TextView type="darkBold" text="Points Redeemed Successfully!" style={{
                                fontSize: '16px',
                                marginBottom: '8px',
                                color: '#155724'
                            }} />
                            <TextView type="subDark" text={`New balance: ${memberPointResult?.availablePoints || 0} points`} style={{
                                fontSize: '14px',
                                color: '#155724'
                            }} />
                        </div>
                    )}

                    {/* Redeem Form */}
                    {!redeemSuccess && (
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '20px',
                            marginBottom: '20px',
                            padding: '20px',
                            backgroundColor: '#ffffff',
                            borderRadius: '16px',
                            border: '1px solid #e9ecef',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                        }}>
                            {/* Input Fields Row */}
                            <div style={{
                                display: 'flex',
                                gap: '20px',
                                flexWrap: 'wrap'
                            }}>
                                {/* Redeem Amount Input */}
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '8px',
                                    textAlign: 'left',
                                    flex: '1',
                                    minWidth: '200px'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}>
                                        <div style={{
                                            width: '20px',
                                            height: '20px',
                                            borderRadius: '50%',
                                            backgroundColor: '#28a745',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontSize: '12px',
                                            fontWeight: 'bold'
                                        }}>
                                            💰
                                        </div>
                                        <TextView type="subDark" text="Redeem Amount (Points)" style={{fontWeight: '600'}} />
                                    </div>
                                    <div style={{
                                        position: 'relative',
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: '12px',
                                        border: '2px solid #e9ecef',
                                        padding: '4px',
                                        transition: 'all 0.3s ease'
                                    }}>
                                        <InputText
                                            type="number"
                                            placeholder="0"
                                            name="redeemAmount"
                                            value={redeemAmount}
                                            onChange={(e) => setRedeemAmount(e.target.value)}
                                        />
                                    </div>
                                    <div style={{
                                        fontSize: '12px',
                                        color: '#6c757d',
                                        textAlign: 'center',
                                        padding: '8px',
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: '8px',
                                        border: '1px solid #e9ecef'
                                    }}>
                                        Max: {memberPointResult?.availablePoints || 0} points
                                    </div>
                                </div>

                                {/* Verification Code Input */}
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '8px',
                                    textAlign: 'left',
                                    flex: '1',
                                    minWidth: '200px'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}>
                                        <div style={{
                                            width: '20px',
                                            height: '20px',
                                            borderRadius: '50%',
                                            backgroundColor: '#007bff',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontSize: '12px',
                                            fontWeight: 'bold'
                                        }}>
                                            🔐
                                        </div>
                                        <TextView type="subDark" text="4-Digit Verification Code" style={{fontWeight: '600'}} />
                                    </div>
                                    <div style={{
                                        position: 'relative',
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: '12px',
                                        border: '2px solid #e9ecef',
                                        padding: '4px',
                                        transition: 'all 0.3s ease'
                                    }}>
                                        <InputText
                                            type="text"
                                            placeholder="0000"
                                            name="verificationCode"
                                            value={verificationCode}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                                                setVerificationCode(value);
                                            }}
                                        />
                                    </div>
                                    <div style={{
                                        fontSize: '12px',
                                        color: '#6c757d',
                                        textAlign: 'center',
                                        padding: '8px',
                                        backgroundColor: '#e3f2fd',
                                        borderRadius: '8px',
                                        border: '1px solid #bbdefb'
                                    }}>
                                        🔒 Enter the 4-digit code sent to the member
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {redeemError && (
                        <div style={{
                            backgroundColor: 'linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%)',
                            background: 'linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%)',
                            color: '#721c24',
                            borderRadius: '12px',
                            padding: '15px',
                            border: '2px solid #f5c6cb',
                            fontSize: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            boxShadow: '0 2px 8px rgba(220, 53, 69, 0.2)'
                        }}>
                            <div style={{
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                backgroundColor: '#dc3545',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '12px',
                                fontWeight: 'bold',
                                flexShrink: 0
                            }}>
                                ⚠️
                            </div>
                            <span style={{fontWeight: '500'}}>{redeemError}</span>
                        </div>
                    )}
                </div>
                    {/* )} */}

                    {/* Action Buttons */}
                    <div style={{
                        display: 'flex',
                        gap: '15px',
                        justifyContent: 'center'
                    }}>
                        {!redeemSuccess && (
                            <>
                                <button 
                                    onClick={closePointRedeemPopup}
                                    style={{
                                        padding: '14px 24px',
                                        backgroundColor: 'transparent',
                                        color: '#6c757d',
                                        border: '2px solid #dee2e6',
                                        borderRadius: '12px',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        transition: 'all 0.3s ease',
                                        minWidth: '100px'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.backgroundColor = '#f8f9fa';
                                        e.target.style.borderColor = '#adb5bd';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.backgroundColor = 'transparent';
                                        e.target.style.borderColor = '#dee2e6';
                                    }}
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handlePointRedeem}
                                    disabled={!redeemAmount || !verificationCode || redeemLoading}
                                    style={{
                                        padding: '14px 24px',
                                        backgroundColor: redeemAmount && verificationCode ? 'linear-gradient(135deg, #28a745 0%, #20c997 100%)' : '#e9ecef',
                                        background: redeemAmount && verificationCode ? 'linear-gradient(135deg, #28a745 0%, #20c997 100%)' : '#e9ecef',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '12px',
                                        cursor: redeemAmount && verificationCode ? 'pointer' : 'not-allowed',
                                        fontSize: '14px',
                                        fontWeight: 'bold',
                                        transition: 'all 0.3s ease',
                                        minWidth: '140px',
                                        boxShadow: redeemAmount && verificationCode ? '0 4px 15px rgba(40, 167, 69, 0.3)' : 'none'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (redeemAmount && verificationCode) {
                                            e.target.style.transform = 'translateY(-2px)';
                                            e.target.style.boxShadow = '0 6px 20px rgba(40, 167, 69, 0.4)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (redeemAmount && verificationCode) {
                                            e.target.style.transform = 'translateY(0)';
                                            e.target.style.boxShadow = '0 4px 15px rgba(40, 167, 69, 0.3)';
                                        }
                                    }}
                                >
                                    {redeemLoading ? 'Processing...' : 'Redeem Points'}
                                </button>
                            </>
                        )}
                        
                        {redeemSuccess && (
                            <button 
                                onClick={closePointRedeemPopup}
                                style={{
                                    padding: '14px 28px',
                                    backgroundColor: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                                    background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: 'bold',
                                    transition: 'all 0.3s ease',
                                    minWidth: '120px',
                                    boxShadow: '0 4px 15px rgba(40, 167, 69, 0.3)'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.transform = 'translateY(-2px)';
                                    e.target.style.boxShadow = '0 6px 20px rgba(40, 167, 69, 0.4)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = '0 4px 15px rgba(40, 167, 69, 0.3)';
                                }}
                            >
                                Close
                            </button>
                        )}
                    </div>
                
            </SimplePopup>
        )}
    </div>
    
)}

export default TransactionsVendor
