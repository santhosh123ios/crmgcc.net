import React, {useState,useEffect} from 'react'
import DashboardBox from '../../componants/Main/DashboardBox'
import apiClient from '../../utils/ApiClient';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons'
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { faPhone } from '@fortawesome/free-solid-svg-icons';

import InputText from '../../componants/Main/InputText';
import DateWithIcon from '../../componants/Main/DateWithIcon';
import TextView from '../../componants/Main/TextView';

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


  useEffect(() => {
    fetchTransaction();
    fetchTransactionSettings();
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

  const handleTopUpSubmit = () => {
      // Handle top up submission here
      console.log("Top up amount:", topUpAmount);
      setShowTopUpPopup(false);
      setTopUpAmount('');
  };

  const handleTopUpCancel = () => {
      setShowTopUpPopup(false);
      setTopUpAmount('');
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
                    {/* Transaction detalil view */}
                    <div style={{
                        width: '100%',
                        height: '40%',
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '2px'
                        }}>
                        <DashboardBox >
                          <div className='user-list-item-inside'>
                              <img className="user-avatar" src={selectedTransaction?.member_image ? baseUrl+selectedTransaction?.member_image : "/dummy.jpg"} alt={"selectedLead.vendor_name"} /> 
                                {/* <img className="user-avatar" src="http://localhost:8000/uploads/1747778079775.jpg"alt={"uploads"} /> */}
                              <div className="user-info">
                                  <p className="title-text-dark">{selectedTransaction?.member_name ?? "No member name"}</p>
                                  <p className="sub-title-text-dark">{selectedTransaction?.member_email ?? "No member email"}</p>

                                  <div className="button-row">
                                      {/* Translation */}
                                      <button className="circle-btn-light">
                                              <FontAwesomeIcon icon={faPhone} />
                                      </button>

                                      {/* Translation */}
                                      <button className="circle-btn-light">
                                              <FontAwesomeIcon icon={faLocationDot} />
                                      </button>

                                      {/* Translation */}
                                      <button className="circle-btn-light">
                                              <FontAwesomeIcon icon={faExchangeAlt} />
                                      </button>
                                  </div>
                              </div>
                          </div>

                          <div style={{boxSizing:'border-box',display: 'flex',alignItems: 'start',justifyItems:'start'}}>
                            <div className="tr-view-item">
                                  <div className="user-info-tr">
                                      <DateWithIcon text={new Date(selectedTransaction?.transaction_created_at).toLocaleDateString("en-US", {
                                          year: "numeric",
                                          month: "long",
                                          day: "numeric",
                                          })} >
                                      </DateWithIcon>
                                      <TextView type="subDarkBold" text={selectedTransaction?.transaction_title}/>
                                      <TextView type="subDark" text={selectedTransaction?.vendor_name}/>
                                      <TextView type="subDark" text={baseId+selectedTransaction?.transaction_id}/>
                                  </div>

                                  <div style={{height: '100%',display: 'flex',justifyContent: 'center',alignItems: 'center',paddingLeft:'10px',paddingRight:'10px',gap:'2px'}}>
                                    <TextView type="darkBold" text={selectedTransaction?.transaction_type === 1 ? selectedTransaction?.transaction_cr : selectedTransaction?.transaction_dr }/>
                                    <TextView type="subDarkBold" text={selectedTransaction?.transaction_type === 1 ? "Cr" : "Dr" } style={{color:selectedTransaction?.transaction_type === 1 ? 'green' : 'red'}}/>
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
                                        Active
                                    </div>
                                </div>

                                {/* Wallet Card */}
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
                                        fontSize: '16px',
                                        letterSpacing: '2px',
                                        marginBottom: '20px',
                                        fontFamily: 'monospace'
                                    }}>
                                        **** **** **** 1234
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
                                                CARD HOLDER
                                            </div>
                                            <div style={{
                                                fontSize: '12px',
                                                fontWeight: 'bold'
                                            }}>
                                                {selectedTransaction?.vendor_name || 'Vendor Name'}
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
                                        <TextView type="darkBold" text="25,000 Points" style={{color: '#2e7d32'}} />
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
                                        <button style={{
                                            flex: 1,
                                            padding: '8px 12px',
                                            backgroundColor: 'transparent',
                                            color: '#ffd700',
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
                                            e.target.style.color = '#ffd700';
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
                                        <TextView type="subDark" text="Status" />
                                        <TextView type="darkBold" text="Completed" style={{color: '#28a745'}} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </DashboardBox>
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
                        marginBottom: '20px'
                    }}>
                        <TextView type="darkBold" text="Top Up Wallet" />
                        <button 
                            onClick={handleTopUpCancel}
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
    </div>
  )
}

export default TransactionsVendor
