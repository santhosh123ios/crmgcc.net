import React, {useState,useEffect,useRef} from 'react'
import DashboardBox from '../../componants/Main/DashboardBox'
import apiClient from '../../utils/ApiClient';
import QRCode from 'qrcode';

import { faExchangeAlt, faWallet, faHistory, faGift, faPlus, faEye, faEyeSlash, faInbox, faSearch, faPhone, faLocationDot, faCreditCard, faCoins } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import InputText from '../../componants/Main/InputText';
import DateWithIcon from '../../componants/Main/DateWithIcon';
import TextView from '../../componants/Main/TextView';
import RoundButton from '../../componants/Main/RoundButton';
import RedeemPopup from '../../componants/Main/RedeemPopup';
import BankDetailsPopup from '../../componants/Main/BankDetailsPopup';
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
  const [showBankDetailsPopup, setShowBankDetailsPopup] = useState(false);
  const [bankInfo, setBankInfo] = useState(null);
  const [loadingBankInfo, setLoadingBankInfo] = useState(true);
  const [redeems, setredeems] = useState([]);
  const [selectedReadeem, setSelectedRedeem] = useState(null);
  const [selectedPosRedeem, setselectedPosReadeem] = useState(0);
  const [loadingRdm, setLoadingRdm] = useState(true);
  const [loadingWallet, setLoadingWallet] = useState(true);
  const [showCardNumber, setShowCardNumber] = useState(false);
  const [activeTab, setActiveTab] = useState('transactions'); // 'transactions' or 'redeems'
  const [formData, setFormData] = useState({
        search: ""
  });
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const qrCanvasRef = useRef(null);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [filteredRedeems, setFilteredRedeems] = useState([]);

  useEffect(() => {
    fetchTransaction();
    fetchRedeem();
    fetchWallet();
    fetchBankInfo();
  },[]);

  // Filter data when search term changes
  useEffect(() => {
    if (activeTab === 'transactions') {
      filterTransactions();
    } else {
      filterRedeems();
    }
  }, [formData.search, transactions, redeems, activeTab]);

  useEffect(() => {
    if (wallet?.card?.card_no) {
      generateQRCode();
    }
  }, [wallet?.card?.card_no]);

  const generateQRCode = async () => {
    try {
      const cardData = {
        cardNumber: wallet?.card?.card_no,
        cardType: wallet?.card?.card_type_name,
        memberId: baseId
      };
      
      const qrData = JSON.stringify(cardData);
      const qrUrl = await QRCode.toDataURL(qrData, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      setQrCodeUrl(qrUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  ///API CALLING
  const fetchTransaction = async () => {
      setLoading(true);
      try {
      const response = await apiClient.get("/member/get_transaction");
      if (response?.result?.status === 1) {
          console.warn("Get Transaction successfully");
          setTransactions(response.result.data);
          setFilteredTransactions(response.result.data);
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
      try {
          const payload = {
              redeem_point: point,
              redeem_notes: notes
          };
          
          const data = await apiClient.post("/member/add_redeem", payload);

          if (data?.result?.status === 1) {
                setShowRedeemPopup(false)
                fetchRedeem();
          }
      } catch (err) {
          console.error("Something went wrong fetching vendors", err);
      }
  };

  const fetchRedeem = async () => {
      setLoadingRdm(true);
      try {
      const responseRedeems = await apiClient.get("/member/get_redeem");
      if (responseRedeems?.result?.status === 1) {
          console.warn("Get Redeem successfully");
          setredeems(responseRedeems.result.data);
          setFilteredRedeems(responseRedeems.result.data);
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

  const fetchBankInfo = async () => {
      setLoadingBankInfo(true);
      try {
          const response = await apiClient.get("/member/bank_info_status");
          if (response?.result?.status === 1) {
              console.warn("Bank info status retrieved successfully");
              setBankInfo(response.result.data);
              return response; // Return response for callback usage
          } else {
              console.warn("Failed to get bank info status");
              return null;
          }
      } catch (error) {
          console.error("Failed to fetch bank info status:", error);
          return null;
      } finally {
          setLoadingBankInfo(false);
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

  // Filter transactions based on search term
  const filterTransactions = () => {
    if (!formData.search.trim()) {
      setFilteredTransactions(transactions);
      return;
    }

    const searchTerm = formData.search.toLowerCase();
    const filtered = transactions.filter(transaction => 
      transaction.transaction_title?.toLowerCase().includes(searchTerm) ||
      transaction.vendor_name?.toLowerCase().includes(searchTerm) ||
      transaction.transaction_id?.toString().includes(searchTerm) ||
      transaction.transaction_cr?.toString().includes(searchTerm) ||
      transaction.transaction_dr?.toString().includes(searchTerm) ||
      new Date(transaction.transaction_created_at).toLocaleDateString().includes(searchTerm)
    );
    setFilteredTransactions(filtered);
  };

  // Filter redeems based on search term
  const filterRedeems = () => {
    if (!formData.search.trim()) {
      setFilteredRedeems(redeems);
      return;
    }

    const searchTerm = formData.search.toLowerCase();
    const filtered = redeems.filter(redeem => 
      redeem.notes?.toLowerCase().includes(searchTerm) ||
      redeem.redeem_id?.toString().includes(searchTerm) ||
      redeem.point?.toString().includes(searchTerm) ||
      getStatusText(redeem.redeem_status)?.toLowerCase().includes(searchTerm) ||
      new Date(redeem.redeem_created_at).toLocaleDateString().includes(searchTerm)
    );
    setFilteredRedeems(filtered);
  };

  // Clear search function
  const clearSearch = () => {
    setFormData(prev => ({
      ...prev,
      search: ""
    }));
  };

  const handleLeadListClick = (index) => {
      const selectedTransaction = filteredTransactions[index];
      const originalIndex = transactions.findIndex(t => t.transaction_id === selectedTransaction.transaction_id);
      setselectedPosTr(originalIndex >= 0 ? originalIndex : index);
      console.log("Clicked index:", index);
      console.log("Clicked Sttaus:", selectedTransaction.lead_status);
      setSelectedTransaction(selectedTransaction)
  };

  const handleRedeemClick = () => {
      if (bankInfo?.has_bank_info) {
          setShowRedeemPopup(true);
      } else {
          setShowBankDetailsPopup(true);
      }
  };

  const handleBankDetailsSubmit = () => {
      setShowBankDetailsPopup(false);
      // Refresh bank info and then show redeem popup
      fetchBankInfo().then((response) => {
          if (response?.result?.data?.has_bank_info) {
              setShowRedeemPopup(true);
          }
      });
  };

  const handleRedeemPopupSubmit = (points,notes) => {
        console.log('Submitted Points:', points);
       addRedeem(points,notes)
  };

  const handleLeadListClickRedeem = (index) => {
      const selectedRedeem = filteredRedeems[index];
      const originalIndex = redeems.findIndex(r => r.redeem_id === selectedRedeem.redeem_id);
      setselectedPosReadeem(originalIndex >= 0 ? originalIndex : index);
      console.log("Clicked index:", index);
      console.log("Clicked Sttaus:", selectedRedeem.redeem_id);
      setSelectedRedeem(selectedRedeem)
  };

  const toggleCardNumber = () => {
      setShowCardNumber(!showCardNumber);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 0: return '#ff9800'; // Pending
      case 1: return '#4caf50'; // Approved
      case 2: return '#f44336'; // Rejected
      default: return '#9e9e9e'; // Default
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 0: return 'Pending';
      case 1: return 'Approved';
      case 2: return 'Rejected';
      default: return 'Unknown';
    }
  };

  return (
    <div className='content-view' style={{ 
      height: 'calc(100vh - 90px)', 
      //backgroundColor: '#f8f9fa', 
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      padding: '0'
    }}>
      
      {/* Main Content */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 2fr',
        gap: '20px',
        flex: 1,
        padding: '20px',
        overflow: 'hidden',
        width: 'calc(100% - 40px)',
        paddingTop: '0px'
      }}>

        {/* First Column - Wallet Card & Details */}
        <div style={{
          display: 'flex',
          height: '100%',
          flexDirection: 'column',
          gap: '10px',
          padding: '0px'
        }}>
          
          
          
          {/* Wallet Card */}
          <DashboardBox style={{ padding: '0', overflow: 'hidden' }}>

            <div style={{
              padding: '20px',
              backgroundColor: '#f8f9fa',
              borderRadius: '12px',
              height: '100%'
            }}>
                {/* Wallet Header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '10px'
                }}>
                    <div style={{
                        textAlign: 'left'
                    }}>
                        <TextView type="darkBold" text="My Reward Card" style={{ fontSize: '20px', marginBottom: '8px' }} />
                        <TextView type="subDark" text="Your digital wallet for managing points and rewards" style={{ fontSize: '13px', opacity: 0.8 }} />
                    </div>
                    <RoundButton 
                        icon={faPlus} 
                        onClick={handleRedeemClick}
                        style={{
                            backgroundColor: 'var(--highlight-color)',
                            color: '#333',
                            width: '40px',
                            height: '40px',
                            flexShrink: 0,
                        }}
                    />
                </div>
                
                {loadingWallet ? (
                <div style={{
                    background: 'linear-gradient(135deg, var(--highlight-color) 0%, #ffb300 100%)',
                    padding: '20px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '50%'
                }}>
                    <div className="spinner" style={{borderColor: 'white', borderTopColor: 'transparent'}}></div>
                </div>
                ) : wallet?.card ? (
                <div style={{
                    background: 'linear-gradient(135deg, var(--highlight-color) 0%, #ffb300 100%)',
                    padding: '20px',
                    color: '#333',
                    position: 'relative',
                    overflow: 'hidden',
                    height: '160px',
                    borderRadius: '12px'
                }}>
                    {/* Card Header */}
                    <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '10px'
                    }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                    }}>
                        <FontAwesomeIcon icon={faCreditCard} style={{ fontSize: '24px' }} />
                        <div>
                        <div style={{ fontSize: '14px', opacity: 0.8 }}>Reward Card</div>
                        <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
                            {wallet?.card?.card_type_name}
                        </div>
                        </div>
                    </div>
                    
                    <div style={{
                        padding: '6px 12px',
                        backgroundColor: 'rgba(255,255,255,0.3)',
                        borderRadius: '18px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                    }}>
                        {wallet?.card?.card_status === 1 ? 'Active' : 'Inactive'}
                    </div>
                    </div>

                    {/* Card Number */}
                    <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '0px',
                    gap: '15px',
                    }}>
                        <div style={{
                            fontSize: '20px',
                            letterSpacing: '3px',
                            fontFamily: 'monospace',
                            fontWeight: 'bold',
                            flex: 1,
                            lineHeight: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center'
                        }}>
                            {showCardNumber ? formatCardNumber(wallet?.card?.card_no) : '**** **** **** ' + formatCardNumber(wallet?.card?.card_no?.slice(-4))}
                        </div>
                        <button 
                            onClick={toggleCardNumber}
                            style={{
                            background: 'rgba(255,255,255,0.3)',
                            border: 'none',
                            color: '#333',
                            cursor: 'pointer',
                            padding: '0',
                            borderRadius: '50%',
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s',
                            flexShrink: 0,
                            marginBottom: '15px'
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.5)'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.3)'}
                        >
                            <FontAwesomeIcon icon={showCardNumber ? faEyeSlash : faEye} style={{ fontSize: '12px' }} />
                        </button>
                    </div>

                                    {/* Card Footer */}
                    <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end'
                    }}>
                    <div>
                        <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '4px' }}>
                        CARD HOLDER
                        </div>
                        <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
                        {selectedTransaction?.vendor_name || 'Member Name'}
                        </div>
                    </div>
                    <div>
                        <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '4px' }}>
                        BALANCE
                        </div>
                        <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                        {wallet?.available_point?.user_balance || 0} 
                        </div>
                    </div>
                    </div>

                    {/* Decorative Elements */}
                    <div style={{
                    position: 'absolute',
                    top: '-40px',
                    right: '-40px',
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255,255,255,0.1)'
                    }}></div>
                </div>
                ) : (
                <div style={{
                    background: 'linear-gradient(135deg, var(--highlight-color) 0%, #ffb300 100%)',
                    padding: '30px',
                    color: '#333',
                    textAlign: 'center',
                    minHeight: '200px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <FontAwesomeIcon icon={faCreditCard} style={{ fontSize: '48px', marginBottom: '20px', opacity: 0.7 }} />
                    <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>No Card Available</div>
                    <div style={{ fontSize: '14px', opacity: 0.8 }}>Contact support to get your reward card</div>
                </div>
                )}

            </div>
          </DashboardBox>

          {/* Redeem Request Button */}
          <DashboardBox style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{
              padding: '20px',
              backgroundColor: '#f8f9fa',
              borderRadius: '12px',
              height: '100%'
            }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '15px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <FontAwesomeIcon icon={faGift} style={{ fontSize: '20px', color: 'var(--highlight-color)' }} />
                  <TextView type="darkBold" text="Redeem Points" style={{ fontSize: '16px' }} />
                </div>
                <TextView type="subDark" text="Convert your points into rewards" style={{ fontSize: '13px', textAlign: 'center', opacity: 0.8 }} />
                
                {/* QR Code Display */}
                <div style={{
                  width: '120px',
                  height: '120px',
                  backgroundColor: '#ffffff',
                  border: '2px solid #e0e0e0',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  marginBottom: '10px'
                }}>
                  {wallet?.card && qrCodeUrl ? (
                    <img 
                      src={qrCodeUrl} 
                      alt="QR Code" 
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        padding: '8px'
                      }}
                    />
                  ) : wallet?.card ? (
                    <div style={{
                      fontSize: '10px',
                      color: '#666',
                      textAlign: 'center',
                      padding: '10px'
                    }}>
                      Generating<br/>QR Code...
                    </div>
                  ) : (
                    <div style={{
                      fontSize: '12px',
                      color: '#999',
                      textAlign: 'center',
                      padding: '10px'
                    }}>
                      No Card<br/>Available
                    </div>
                  )}
                </div>
                
                <TextView type="subDark" text="Show this QR code to vendors for point redemption" style={{ fontSize: '11px', textAlign: 'center', opacity: 0.7 }} />
                
              </div>
            </div>
          </DashboardBox>

        </div>

                {/* Second Column - Merged List & Details */}
        <DashboardBox style={{ overflow: 'hidden' }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            padding: '20px'
          }}>
            
            {/* Tab Navigation and Search Header - Combined */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              marginBottom: '5px',
              paddingBottom: '15px',
              borderBottom: '1px solid #eee',
              marginTop: '0',
              paddingTop: '0'
            }}>
              {/* Tab Navigation - Same as Vendor Page */}
              <div className="div-items-view" style={{
                minWidth: '220px',
                paddingRight: '5px'
              }}>
                <div 
                  className={activeTab === 'transactions' ? 'div-tab-selected' : 'div-tab'}
                  onClick={() => setActiveTab('transactions')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <FontAwesomeIcon icon={faHistory} style={{ fontSize: '14px' }} />
                  Transactions
                </div>
                <div 
                  className={activeTab === 'redeems' ? 'div-tab-selected' : 'div-tab'}
                  onClick={() => setActiveTab('redeems')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <FontAwesomeIcon icon={faGift} style={{ fontSize: '14px' }} />
                  Redeems
                </div>
              </div>

              {/* Search Input */}
              <div style={{
                position: 'relative',
                flex: 1
              }}>
                {/* <FontAwesomeIcon 
                  icon={faSearch} 
                  style={{ 
                    position: 'absolute', 
                    left: '12px', 
                    top: '50%', 
                    transform: 'translateY(-50%)', 
                    color: '#999', 
                    fontSize: '14px',
                    zIndex: 1
                  }} 
                /> */}
                <InputText 
                  type="text"
                  placeholder={`Search ${activeTab === 'transactions' ? 'transactions' : 'redeem requests'}...`}
                  name="search"
                  value={formData.search}
                  onChange={handleChange}
                  style={{
                    paddingLeft: '40px',
                    paddingRight: formData.search ? '40px' : '12px',
                    borderRadius: '12px',
                    border: '1px solid #eee',
                    backgroundColor: '#fafafa'
                  }}
                />
                {formData.search && (
                  <button
                    onClick={clearSearch}
                    style={{
                      position: 'absolute',
                      right: '8px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#999',
                      cursor: 'pointer',
                      padding: '4px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      zIndex: 1
                    }}
                    onMouseEnter={(e) => e.target.style.color = '#666'}
                    onMouseLeave={(e) => e.target.style.color = '#999'}
                  >
                    ✕
                  </button>
                )}
              </div>
              
              {activeTab === 'redeems' && (
                <RoundButton 
                  icon={faPlus} 
                  onClick={handleRedeemClick}
                  style={{
                    backgroundColor: 'var(--highlight-color)',
                    color: '#333',
                    width: '40px',
                    height: '40px'
                  }}
                />
              )}
            </div>

            {/* Content Area - Split into List and Details */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '20px', 
              flex: 1, 
              overflow: 'hidden' 
            }}>
              
              {/* List Section */}
              <div style={{ 
                overflow: 'auto',
                height: 'calc(100vh - 210px)',
                scrollbarWidth: 'none', /* Firefox */
                msOverflowStyle: 'none', /* IE and Edge */
                WebkitScrollbar: { display: 'none' } /* Chrome, Safari, Opera */
              }}>
              {activeTab === 'transactions' ? (
                loading ? (
                                <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                    height: '200px'
                  }}>
                    <div className="spinner" />
                  </div>
                ) : filteredTransactions.length > 0 ? (
                  filteredTransactions.map((trItems, index) => (
                    <div 
                      key={index}
                      onClick={() => handleLeadListClick(index)}
                      style={{
                        padding: '15px',
                        marginBottom: '10px',
                        backgroundColor: selectedTransaction?.transaction_id === trItems.transaction_id ? 'var(--highlight-color)' : '#ffffff',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        border: selectedTransaction?.transaction_id === trItems.transaction_id ? '2px solid var(--highlight-color)' : '1px solid #eee'
                      }}
                      onMouseEnter={(e) => {
                        if (selectedTransaction?.transaction_id !== trItems.transaction_id) {
                          e.target.style.backgroundColor = '#f0f0f0';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedTransaction?.transaction_id !== trItems.transaction_id) {
                          e.target.style.backgroundColor = '#ffffff';
                        }
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '8px'
                      }}>
                        <TextView 
                          type="darkBold" 
                          text={trItems.transaction_title}
                          style={{ 
                            fontSize: '14px',
                            backgroundColor: 'transparent'
                          }}
                        />
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          <div style={{
                            fontSize: '16px',
                            fontWeight: 'bold',
                            color: trItems.transaction_type === 1 ? '#4caf50' : '#f44336',
                            backgroundColor: 'transparent'
                          }}>
                            {trItems.transaction_type === 1 ? '+' : '-'}{trItems.transaction_type === 1 ? trItems.transaction_cr : trItems.transaction_dr}
                          </div>
                          <div style={{
                            fontSize: '12px',
                            color: trItems.transaction_type === 1 ? '#4caf50' : '#f44336',
                            fontWeight: 'bold',
                            backgroundColor: 'transparent'
                          }}>
                            {trItems.transaction_type === 1 ? 'CR' : 'DR'}
                          </div>
                                </div>  
                        </div>

                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <div style={{ flex: 1 }}>
                          <TextView 
                            type="subDark" 
                            text={trItems.vendor_name}
                            style={{ 
                              fontSize: '12px',
                              marginBottom: '4px',
                              backgroundColor: 'transparent'
                            }}
                          />
                          <TextView 
                            type="subDark" 
                            text={baseId+trItems.transaction_id}
                            style={{ 
                              fontSize: '11px',
                              backgroundColor: 'transparent'
                            }}
                          />
                        </div>
                        <div style={{
                          fontSize: '11px',
                          color: selectedTransaction?.transaction_id === trItems.transaction_id ? '#666' : '#999',
                        }}>
                          {new Date(trItems.transaction_created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '150px',
                    color: '#999',
                    textAlign: 'center'
                  }}>
                    <FontAwesomeIcon icon={faInbox} style={{ fontSize: '36px', marginBottom: '12px', opacity: 0.5 }} />
                    <div style={{ fontSize: '14px', marginBottom: '6px' }}>
                      {formData.search.trim() ? 'No Search Results' : 'No Transactions'}
                    </div>
                    <div style={{ fontSize: '12px', opacity: 0.8 }}>
                      {formData.search.trim() ? 'No transactions match your search criteria' : 'No transaction data available'}
                    </div>
                  </div>
                )
              ) : (
                // Redeems List
                loadingRdm ? (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '200px'
                  }}>
                                <div className="spinner" />
                            </div>
                ) : filteredRedeems.length > 0 ? (
                            filteredRedeems.map((rdmItems, index) => (
                    <div 
                      key={index}
                      onClick={() => handleLeadListClickRedeem(index)}
                      style={{
                        padding: '15px',
                        marginBottom: '10px',
                        backgroundColor: selectedReadeem?.redeem_id === rdmItems.redeem_id ? 'var(--highlight-color)' : '#ffffff',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        border: selectedReadeem?.redeem_id === rdmItems.redeem_id ? '2px solid var(--highlight-color)' : '1px solid #eee'
                      }}
                      onMouseEnter={(e) => {
                        if (selectedReadeem?.redeem_id !== rdmItems.redeem_id) {
                          e.target.style.backgroundColor = '#f0f0f0';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedReadeem?.redeem_id !== rdmItems.redeem_id) {
                          e.target.style.backgroundColor = '#ffffff';
                        }
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '8px'
                      }}>
                        <TextView 
                          type="darkBold" 
                          text={rdmItems.notes}
                          style={{ 
                            fontSize: '14px',
                          }}
                        />
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          <div style={{
                            fontSize: '16px',
                            fontWeight: 'bold',
                            color: selectedReadeem?.redeem_id === rdmItems.redeem_id ? '#333' : 'var(--highlight-color)',
                          }}>
                            {rdmItems.point}
                          </div>
                          <div style={{
                            fontSize: '12px',
                            color: getStatusColor(rdmItems.redeem_status),
                            fontWeight: 'bold',
                            backgroundColor: 'transparent'
                          }}>
                            {getStatusText(rdmItems.redeem_status)}
                          </div>
                        </div>
                                            </div> 

                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <div style={{ flex: 1 }}>
                          <TextView 
                            type="subDark" 
                            text={baseId+rdmItems.redeem_id}
                            style={{ 
                              fontSize: '11px',
                            }}
                          />
                        </div>
                                                <div style={{
                          fontSize: '11px',
                          color: selectedReadeem?.redeem_id === rdmItems.redeem_id ? '#666' : '#999',
                          backgroundColor: 'transparent'
                        }}>
                          {new Date(rdmItems.redeem_created_at).toLocaleDateString()}
                        </div>
                                      </div>
                              </div>
                            ))
                ) : (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '150px',
                    color: '#999',
                    textAlign: 'center'
                  }}>
                    <FontAwesomeIcon icon={faGift} style={{ fontSize: '36px', marginBottom: '12px', opacity: 0.5 }} />
                    <div style={{ fontSize: '14px', marginBottom: '6px' }}>
                      {formData.search.trim() ? 'No Search Results' : 'No Redeem Requests'}
                    </div>
                    <div style={{ fontSize: '12px', opacity: 0.8 }}>
                      {formData.search.trim() ? 'No redeem requests match your search criteria' : 'No redeem requests available'}
                    </div>
                  </div>
                )
              )}
              </div>

              {/* Details Section */}
              <div style={{ overflow: 'auto' }}>
                {/* Details Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '0px',
                  paddingBottom: '15px',
                  borderBottom: '1px solid #eee'
                }}>
                  <FontAwesomeIcon icon={activeTab === 'transactions' ? faHistory : faGift} style={{ fontSize: '18px', color: 'var(--highlight-color)' }} />
                  <TextView type="darkBold" text={`${activeTab === 'transactions' ? 'Transaction' : 'Redeem'} Details`} style={{ fontSize: '16px' }} />
                </div>

                {/* Details Content */}
                <div style={{ flex: 1 }}>
                  {activeTab === 'transactions' && selectedTransaction ? (
                    <div style={{ padding: '15px', backgroundColor: '#fafafa', borderRadius: '10px' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '15px',
                        paddingBottom: '12px',
                        borderBottom: '1px solid #eee',
                      }}>
                        <img 
                          src={selectedTransaction?.vendor_image ? baseUrl+selectedTransaction?.vendor_image : "/dummy.jpg"} 
                          alt="Vendor" 
                          style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '2px solid var(--highlight-color)'
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <TextView type="darkBold" text={selectedTransaction?.vendor_name || "Vendor Name"} style={{ marginBottom: '4px' }} />
                          <TextView type="subDark" text={selectedTransaction?.vendor_email || "vendor@email.com"} style={{ marginBottom: '8px' }} />
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '50%',
                              border: 'none',
                              backgroundColor: 'var(--highlight-color)',
                              color: '#333',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              <FontAwesomeIcon icon={faPhone} style={{ fontSize: '12px' }} />
                            </button>
                            <button style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '50%',
                              border: 'none',
                              backgroundColor: 'var(--highlight-color)',
                              color: '#333',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              <FontAwesomeIcon icon={faLocationDot} style={{ fontSize: '12px' }} />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div style={{ marginBottom: '15px' }}>
                        <TextView type="darkBold" text="Transaction Details" style={{ marginBottom: '10px' }} />
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: '15px'
                        }}>
                          <div>
                            <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Transaction ID</div>
                            <div style={{ fontSize: '14px', fontWeight: 'bold',color: '#666' }}>{baseId+selectedTransaction?.transaction_id}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Type</div>
                            <div style={{ 
                              fontSize: '14px', 
                              fontWeight: 'bold',
                              color: selectedTransaction?.transaction_type === 1 ? '#4caf50' : '#f44336'
                            }}>
                              {selectedTransaction?.transaction_type === 1 ? 'Credit' : 'Debit'}
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Points</div>
                            <div style={{ 
                              fontSize: '16px', 
                              fontWeight: 'bold',
                              color: selectedTransaction?.transaction_type === 1 ? '#4caf50' : '#f44336'
                            }}>
                              {selectedTransaction?.transaction_type === 1 ? selectedTransaction?.transaction_cr : selectedTransaction?.transaction_dr}
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Date</div>
                            <div style={{ fontSize: '14px' }}>
                              {new Date(selectedTransaction?.transaction_created_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <TextView type="darkBold" text="Description" style={{ marginBottom: '8px' }} />
                        <TextView type="subDark" text={selectedTransaction?.transaction_title || "No description available"} />
                      </div>
                    </div>
                  ) : activeTab === 'redeems' && selectedReadeem ? (
                    <div style={{ padding: '15px', backgroundColor: '#fafafa', borderRadius: '10px' }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '20px',
                        paddingBottom: '15px',
                        borderBottom: '1px solid #eee'
                      }}>
                        <div>
                          <TextView type="darkBold" text="Redeem Request" style={{ marginBottom: '4px' }} />
                          <TextView type="subDark" text={`ID: ${baseId}${selectedReadeem?.redeem_id}`} />
                        </div>
                        <div style={{
                          padding: '6px 12px',
                          backgroundColor: getStatusColor(selectedReadeem?.redeem_status),
                          color: 'white',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}>
                          {getStatusText(selectedReadeem?.redeem_status)}
                        </div>
                      </div>

                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '15px',
                        marginBottom: '20px'
                      }}>
                        <div>
                          <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Points Requested</div>
                          <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--highlight-color)' }}>
                            {selectedReadeem?.point} 
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Request Date</div>
                          <div style={{ fontSize: '14px' }}>
                            {new Date(selectedReadeem?.redeem_created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <div style={{ marginBottom: '15px' }}>
                        <TextView type="darkBold" text="Notes" style={{ marginBottom: '8px' }} />
                        <TextView type="subDark" text={selectedReadeem?.notes || "No notes provided"} />
                      </div>

                      {selectedReadeem?.redeem_comment && (
                        <div>
                          <TextView type="darkBold" text="Admin Comment" style={{ marginBottom: '8px' }} />
                          <TextView type="subDark" text={selectedReadeem?.redeem_comment} />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                      color: '#999',
                      textAlign: 'center'
                    }}>
                      <FontAwesomeIcon icon={activeTab === 'transactions' ? faHistory : faGift} style={{ fontSize: '36px', marginBottom: '12px', opacity: 0.5 }} />
                      <div style={{ fontSize: '14px', marginBottom: '6px' }}>
                        No {activeTab === 'transactions' ? 'Transaction' : 'Redeem Request'} Selected
                      </div>
                      <div style={{ fontSize: '12px', opacity: 0.8 }}>
                        Select an item from the list to view details
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </DashboardBox>


      </div>

        {showRedeemPopup && (
            <RedeemPopup
          point={wallet?.available_point?.user_balance}
            onClose={() => setShowRedeemPopup(false)}
            onSubmit={handleRedeemPopupSubmit}
            />
        )}

        {showBankDetailsPopup && (
            <BankDetailsPopup
                onClose={() => setShowBankDetailsPopup(false)}
                onSubmit={handleBankDetailsSubmit}
            />
        )}
    </div>
  )
}

export default WalletMember
