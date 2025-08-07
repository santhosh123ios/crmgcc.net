import React, { useState, useEffect } from 'react';
import TextView from './TextView';
import apiClient from '../../utils/ApiClient';

function PointPopup({ onClose, onSubmit, userType = 'vendor' }) {
    const [points, setPoints] = useState('');
    const [availablePoints, setAvailablePoints] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isValid, setIsValid] = useState(true);

    useEffect(() => {
        fetchAvailablePoints();
    }, [userType]);

    const fetchAvailablePoints = async () => {
        setLoading(true);
        try {
            const endpoint = userType === 'admin' ? '/admin/get_wallet' : '/vendor/get_wallet';
            const response = await apiClient.get(endpoint);
            if (response?.result?.status === 1) {
                setAvailablePoints(response.result.data?.balance_point || 0);
            } else {
                setError('Failed to fetch available points');
            }
        } catch (error) {
            console.error("Failed to fetch wallet data:", error);
            setError('Failed to fetch available points');
        } finally {
            setLoading(false);
        }
    };

    const handlePointsChange = (e) => {
        const value = e.target.value;
        setPoints(value);
        
        // Validate points
        const numPoints = parseInt(value) || 0;
        if (numPoints <= 0) {
            setError('Please enter a valid number of points');
            setIsValid(false);
        } else if (numPoints > availablePoints) {
            setError(`Insufficient balance. Available: ${availablePoints} points`);
            setIsValid(false);
        } else {
            setError('');
            setIsValid(true);
        }
    };

    const handleSubmit = () => {
        const numPoints = parseInt(points) || 0;
        if (numPoints <= 0) {
            setError('Please enter a valid number of points');
            return;
        }
        if (numPoints > availablePoints) {
            setError(`Insufficient balance. Available: ${availablePoints} points`);
            return;
        }
        onSubmit(points);
    };

    return (
        <div className="popup-overlay">
            <div className="popup-container">
                <TextView type="darkBold" text={"Enter Points"}/>
                
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        <div className="spinner" />
                        <TextView type="subDark" text="Loading available points..." />
                    </div>
                ) : (
                    <>
                        <div style={{ 
                            marginBottom: '10px', 
                            marginTop: '15px',
                            padding: '10px', 
                            backgroundColor: '#f5f5f5', 
                            borderRadius: '5px',
                            textAlign: 'center'
                        }}>
                            <TextView type="subDark" text="Available Balance" />
                            <TextView type="darkBold" text={`${availablePoints} Points`} style={{color: '#2e7d32'}} />
                        </div>
                        
                        <input
                            type="number"
                            value={points}
                            onChange={handlePointsChange}
                            placeholder="Enter points"
                            className="popup-input"
                            style={{ 
                                marginBottom: error ? '15px' : '10px',
                                padding: '12px 16px',
                                fontSize: '16px',
                                border: '2px solid #e0e0e0',
                                borderRadius: '8px',
                                width: '100%',
                                boxSizing: 'border-box',
                                transition: 'border-color 0.3s ease',
                                outline: 'none',
                                backgroundColor: '#ffffff'
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = '#0084ff';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = '#e0e0e0';
                            }}
                        />
                        
                        {error && (
                            <div style={{ 
                                color: '#d32f2f', 
                                fontSize: '12px', 
                                marginBottom: '0px',
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
                                disabled={!isValid || !points.trim()}
                                style={{ 
                                    opacity: (!isValid || !points.trim()) ? 0.6 : 1,
                                    cursor: (!isValid || !points.trim()) ? 'not-allowed' : 'pointer'
                                }}
                            >
                                Submit
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default PointPopup
