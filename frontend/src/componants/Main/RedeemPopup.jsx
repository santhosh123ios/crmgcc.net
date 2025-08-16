import React, { useState, useEffect } from 'react';
import TextView from './TextView';
import './Main.css'
import apiClient from '../../utils/ApiClient';

function RedeemPopup({ onClose, onSubmit, point = 0 }) {
    const [points, setPoints] = useState('');
    const [notes, setNotes] = useState('');
    const [transactionSettings, setTransactionSettings] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Fetch transaction settings on component mount
    useEffect(() => {
        fetchTransactionSettings();
    }, []);

    const fetchTransactionSettings = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/member/get_transaction_settings');
            
            if (response && response.result && response.result.data) {
                setTransactionSettings(response.result.data);
                console.log('Transaction settings:', response.result.data); // For debugging
            }
        } catch (error) {
            console.error('Error fetching transaction settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const validateRedeemRequest = (redeemPoints) => {
        const pointsNum = parseFloat(redeemPoints);
        
        if (!redeemPoints || pointsNum <= 0) {
            return 'Please enter a valid number of points';
        }

        if (transactionSettings) {
            // Check minimum redeem limit
            if (pointsNum < transactionSettings.minimum_redeem_limit) {
                return `Minimum redeem limit is ${transactionSettings.minimum_redeem_limit} points`;
            }

            // Check maximum redeem limit
            if (pointsNum > transactionSettings.maximum_redeem_limit) {
                return `Maximum redeem limit is ${transactionSettings.maximum_redeem_limit} points`;
            }

            // Check daily limit (this would need to be tracked per user)
            // For now, we'll show the daily limit info
        }

        // Check if user has enough points
        if (pointsNum > point) {
            return `You only have ${point} points available`;
        }

        return null; // No error
    };

    const handleSubmit = () => {
        const validationError = validateRedeemRequest(points);
        if (validationError) {
            setError(validationError);
            return;
        }
        setError('');
        onSubmit(points, notes);
    };

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <TextView type="darkBold" text={"Create Redeem Request "}/>
        <TextView type="subDarkBold" text={"Available points: "+point}/>
        
        {/* Transaction Limits Info */}
        {transactionSettings && (
          <div style={{
            marginBottom: '15px',
            marginTop: '10px',
            padding: '10px',
            backgroundColor: '#f8f9fa',
            borderRadius: '6px',
            fontSize: '12px',
            color: '#666'
          }}>
            <div style={{ marginBottom: '5px' }}>
              <strong>Transaction Limits:</strong>
            </div>
            <div>Min: {transactionSettings.minimum_redeem_limit} points</div>
            <div>Max: {transactionSettings.maximum_redeem_limit} points</div>
            <div>Daily Limit: {transactionSettings.daily_limit} points</div>
            {transactionSettings.point_corresponding_amount && (
              <div style={{ marginTop: '5px', borderTop: '1px solid #ddd', paddingTop: '5px' }}>
                <strong>Point Value: {parseFloat(transactionSettings.point_corresponding_amount).toFixed(3)} BHD per point</strong>
                {/* {parseFloat(points) * transactionSettings.transaction_charges / 100)).toFixed(2)} */}
              </div>
            )}
            <div style={{ marginTop: '5px', borderTop: '1px solid #ddd', paddingTop: '5px' }}>
              <strong>Transaction Charges: {transactionSettings.transaction_charges}%</strong>
            </div>
          </div>
        )}

        <input
          type="text"
          value={notes}
          onChange={(f) => setNotes(f.target.value)}
          placeholder="Enter Note"
          className="popup-input"
          maxLength={30}
          style={{
            width: '100%',
            padding: '12px 15px',
            border: '2px solid #e0e0e0',
            borderRadius: '8px',
            fontSize: '14px',
            backgroundColor: '#ffffff',
            color: '#333',
            transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
            outline: 'none',
            boxSizing: 'border-box'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#007bff';
            e.target.style.boxShadow = '0 0 0 3px rgba(0, 123, 255, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#e0e0e0';
            e.target.style.boxShadow = 'none';
          }}
        />

        <input
          type="number"
          value={points}
          onChange={(e) => {
            setPoints(e.target.value);
            setError(''); // Clear error when user types
          }}
          placeholder="Enter points"
          className="popup-input"
          style={{
            width: '100%',
            padding: '12px 15px',
            border: '2px solid #e0e0e0',
            borderRadius: '8px',
            fontSize: '14px',
            backgroundColor: '#ffffff',
            color: '#333',
            transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
            outline: 'none',
            boxSizing: 'border-box',
            marginTop: '15px'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#007bff';
            e.target.style.boxShadow = '0 0 0 3px rgba(0, 123, 255, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#e0e0e0';
            e.target.style.boxShadow = 'none';
          }}
        />
        
        {/* Transaction Charges Calculation */}
        {points && transactionSettings && parseFloat(points) > 0 && (
          <div style={{
            marginTop: '10px',
            padding: '10px',
            backgroundColor: '#e3f2fd',
            borderRadius: '6px',
            fontSize: '12px',
            color: '#1976d2'
          }}>
            <div style={{ marginBottom: '5px' }}>
              <strong>Transaction Summary:</strong>
            </div>
            <div>Redeem Points: {points}</div>
            {transactionSettings.point_corresponding_amount && (
              <div>Point Value: {parseFloat(transactionSettings.point_corresponding_amount).toFixed(3)} BHD per point</div>
            )}
            <div>Transaction Charges ({transactionSettings.transaction_charges}%): {(parseFloat(points) * transactionSettings.transaction_charges / 100).toFixed(0)} point</div>
            <div style={{ 
              marginTop: '5px', 
              paddingTop: '5px', 
              borderTop: '1px solid #1976d2',
              fontWeight: 'bold',
              fontSize: '13px'
            }}>
              Net Redeem Points: {(parseFloat(points) - (parseFloat(points) * transactionSettings.transaction_charges / 100)).toFixed(2)}
            </div>
            {transactionSettings.point_corresponding_amount && (
              <div style={{ 
                marginTop: '5px', 
                paddingTop: '5px', 
                borderTop: '1px solid #1976d2',
                fontWeight: 'bold',
                fontSize: '13px',
                color: '#2e7d32'
              }}>
                Estimated Value: {((parseFloat(points) - (parseFloat(points) * transactionSettings.transaction_charges / 100)) * transactionSettings.point_corresponding_amount).toFixed(3)} {transactionSettings.currency || 'BHD'}
              </div>
            )}
          </div>
        )}
        
        {/* Error Message */}
        {error && (
          <div style={{
            color: '#dc3545',
            fontSize: '12px',
            marginTop: '5px',
            marginBottom: '10px'
          }}>
            {error}
          </div>
        )}

        
        
        <div className="popup-actions">
          <button onClick={onClose} className="popup-button-cancel">Cancel</button>
          <button 
            onClick={handleSubmit} 
            className="popup-button-submit"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default RedeemPopup
