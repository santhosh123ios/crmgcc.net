import React, { useState, useEffect } from 'react'
import DashboardBox from '../../componants/Main/DashboardBox'
import InputText from '../../componants/Main/InputText'
import CommonButton from '../../componants/Main/CommonButton'
import SimplePopup from '../../componants/Main/SimplePopup'
import apiClient from '../../utils/ApiClient'

function SettingsTransaction() {
  const [formData, setFormData] = useState({
    dailyLimit: '',
    minimumRedeemLimit: '',
    maximumRedeemLimit: '',
    transactionCharges: '',
    transactionExpiryTime: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState('success'); // 'success' or 'error'

  // Fetch transaction settings on component mount
  useEffect(() => {
    fetchTransactionSettings();
  }, []);

  const fetchTransactionSettings = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/admin/get_transaction_settings');
      
      if (response && response.result.data) {
        setFormData({
          dailyLimit: response.result.data.daily_limit?.toString() || '',
          minimumRedeemLimit: response.result.data.minimum_redeem_limit?.toString() || '',
          maximumRedeemLimit: response.result.data.maximum_redeem_limit?.toString() || '',
          transactionCharges: response.result.data.transaction_charges?.toString() || '',
          transactionExpiryTime: response.result.data.transaction_expiry_time?.toString() || ''
        });
      }
    } catch (error) {
      console.error('Error fetching transaction settings:', error);
      setPopupMessage('Error loading settings');
      setPopupType('error');
      setShowPopup(true);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      const payload = {
        daily_limit: parseFloat(formData.dailyLimit) || 0,
        minimum_redeem_limit: parseFloat(formData.minimumRedeemLimit) || 0,
        maximum_redeem_limit: parseFloat(formData.maximumRedeemLimit) || 0,
        transaction_charges: parseFloat(formData.transactionCharges) || 0,
        transaction_expiry_time: parseFloat(formData.transactionExpiryTime) || 0
      };

      const response = await apiClient.post('/admin/update_transaction_settings', payload);
      
      if (response.result.status) {
        setPopupMessage('Settings updated successfully!');
        setPopupType('success');
      } else {
        setPopupMessage('Error updating settings');
        setPopupType('error');
      }
      setShowPopup(true);
    } catch (error) {
      console.error('Error updating transaction settings:', error);
      setPopupMessage('Error updating settings');
      setPopupType('error');
      setShowPopup(true);
    } finally {
      setLoading(false);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setPopupMessage('');
  };

  // Auto-dismiss popup after 3 seconds
  useEffect(() => {
    let timer;
    if (showPopup) {
      timer = setTimeout(() => {
        handleClosePopup();
      }, 1000); // 3 seconds
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [showPopup]);



  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      padding: '0px',
      boxSizing: 'border-box'
    }}>
      <DashboardBox>
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          paddingLeft: '20px',
          paddingTop: '10px',
          boxSizing: 'border-box',
          overflowY: 'auto'
        }}>
          <div style={{
            fontSize: '20px',
            fontWeight: 'bold',
            marginBottom: '10px',
            color: '#333'
          }}>
            Transaction Settings
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            maxWidth: '400px'
          }}>
            {/* Daily Limit */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '5px'
            }}>
              <label style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#333'
              }}>
                Daily Limit
              </label>
              <InputText
                placeholder="Enter daily transaction limit"
                value={formData.dailyLimit}
                onChange={handleInputChange('dailyLimit')}
                type="number"
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '13px'
                }}
              />
              <span style={{
                fontSize: '11px',
                color: '#666',
                fontStyle: 'italic'
              }}>
                Maximum amount that can be transacted per day
              </span>
            </div>

            {/* Minimum Redeem Limit */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '5px'
            }}>
              <label style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#333'
              }}>
                Minimum Redeem Limit
              </label>
              <InputText
                placeholder="Enter minimum redeem limit"
                value={formData.minimumRedeemLimit}
                onChange={handleInputChange('minimumRedeemLimit')}
                type="number"
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '13px'
                }}
              />
              <span style={{
                fontSize: '11px',
                color: '#666',
                fontStyle: 'italic'
              }}>
                Minimum points required for redemption
              </span>
            </div>

            {/* Maximum Redeem Limit */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '5px'
            }}>
              <label style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#333'
              }}>
                Maximum Redeem Limit
              </label>
              <InputText
                placeholder="Enter maximum redeem limit"
                value={formData.maximumRedeemLimit}
                onChange={handleInputChange('maximumRedeemLimit')}
                type="number"
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '13px'
                }}
              />
              <span style={{
                fontSize: '11px',
                color: '#666',
                fontStyle: 'italic'
              }}>
                Maximum points that can be redeemed at once
              </span>
            </div>

            {/* Transaction Charges */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '5px'
            }}>
              <label style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#333'
              }}>
                Transaction Charges
              </label>
              <InputText
                placeholder="Enter transaction charges percentage"
                value={formData.transactionCharges}
                onChange={handleInputChange('transactionCharges')}
                type="number"
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '13px'
                }}
              />
              <span style={{
                fontSize: '11px',
                color: '#666',
                fontStyle: 'italic'
              }}>
                Percentage of charges applied on transactions
              </span>
            </div>

            {/* Transaction Expiry Time */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '5px'
            }}>
              <label style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#333'
              }}>
                Transaction Expiry Time
              </label>
              <InputText
                placeholder="Enter transaction expiry time in hours"
                value={formData.transactionExpiryTime}
                onChange={handleInputChange('transactionExpiryTime')}
                type="number"
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '13px'
                }}
              />
              <span style={{
                fontSize: '11px',
                color: '#666',
                fontStyle: 'italic'
              }}>
                Time in hours after which transactions expire
              </span>
            </div>

            {/* Save Button */}
            <div style={{
              marginTop: '0px',
              display: 'flex',
              gap: '10px'
            }}>
              <CommonButton
                text={loading ? "Saving..." : "Save"}
                onClick={handleSave}
                disabled={loading}
                style={{
                  backgroundColor: loading ? '#6c757d' : '#007bff',
                  color: 'white',
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.3s ease',
                  opacity: loading ? 0.7 : 1
                }}
              />
              <CommonButton
                text="Reset"
                onClick={fetchTransactionSettings}
                disabled={loading}
                style={{
                  backgroundColor: '#6c757d',
                  color: 'white',
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.3s ease',
                  opacity: loading ? 0.7 : 1
                }}
              />
            </div>
          </div>
        </div>
      </DashboardBox>

      {/* Popup for API responses */}
      {showPopup && (
        <SimplePopup onClose={handleClosePopup}>
          <div style={{
            textAlign: 'center',
            padding: '20px'
          }}>
            <div style={{
              fontSize: '18px',
              fontWeight: 'bold',
              marginBottom: '10px',
              color: popupType === 'success' ? '#28a745' : '#dc3545'
            }}>
              {popupType === 'success' ? 'Success' : 'Error'}
            </div>
            <div style={{
              fontSize: '14px',
              color: '#333',
              lineHeight: '1.5'
            }}>
              {popupMessage}
            </div>
          </div>
        </SimplePopup>
      )}
    </div>
  )
}

export default SettingsTransaction 