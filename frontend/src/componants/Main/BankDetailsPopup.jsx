import React, { useState } from 'react';
import TextView from './TextView';
import './Main.css'
import apiClient from '../../utils/ApiClient';

function BankDetailsPopup({ onClose, onSubmit }) {
    const [formData, setFormData] = useState({
        ac_no: '',
        iban_no: '',
        bank_name: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError(''); // Clear error when user types
    };

    const validateForm = () => {
        if (!formData.ac_no.trim()) {
            return 'Please enter account number';
        }
        if (!formData.iban_no.trim()) {
            return 'Please enter IBAN number';
        }
        if (!formData.bank_name.trim()) {
            return 'Please enter bank name';
        }
        return null;
    };

    const handleSubmit = async () => {
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);
        try {
            const response = await apiClient.post('/member/update_bank_details', formData);
            
            if (response?.result?.status === 1) {
                onSubmit(); // Close popup and proceed with redeem
            } else {
                setError(response?.result?.message || 'Failed to save bank information');
            }
        } catch (error) {
            console.error('Error saving bank information:', error);
            setError('Failed to save bank information. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="popup-overlay">
            <div className="popup-container">
                <TextView type="darkBold" text="Bank Information Required" />
                <TextView type="subDarkBold" text="Please provide your bank details to proceed with point redemption" 
                    style={{ marginBottom: '20px', textAlign: 'center' }} />
                
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ 
                        display: 'block', 
                        marginBottom: '5px', 
                        fontSize: '14px', 
                        fontWeight: '500',
                        color: '#333',
                        textAlign: 'left'
                    }}>
                        Account Number *
                    </label>
                    <input
                        type="text"
                        name="ac_no"
                        value={formData.ac_no}
                        onChange={handleChange}
                        placeholder="Enter account number"
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
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ 
                        display: 'block', 
                        marginBottom: '5px', 
                        fontSize: '14px', 
                        fontWeight: '500',
                        color: '#333',
                        textAlign: 'left'
                    }}>
                        IBAN Number *
                    </label>
                    <input
                        type="text"
                        name="iban_no"
                        value={formData.iban_no}
                        onChange={handleChange}
                        placeholder="Enter IBAN number"
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
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ 
                        display: 'block', 
                        marginBottom: '5px', 
                        fontSize: '14px', 
                        fontWeight: '500',
                        color: '#333',
                        textAlign: 'left'
                    }}>
                        Bank Name *
                    </label>
                    <input
                        type="text"
                        name="bank_name"
                        value={formData.bank_name}
                        onChange={handleChange}
                        placeholder="Enter bank name"
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
                </div>

                {/* Error Message */}
                {error && (
                    <div style={{
                        color: '#dc3545',
                        fontSize: '12px',
                        marginBottom: '15px',
                        textAlign: 'center'
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
                        {loading ? 'Saving...' : 'Submit'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default BankDetailsPopup;
