import React, { useState, useEffect } from 'react';
import TextView from './TextView';
import apiClient from '../../utils/ApiClient';

function PointPopup({ onClose, onSubmit, userType = 'vendor' }) {
    const [points, setPoints] = useState('');
    const [availablePoints, setAvailablePoints] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isValid, setIsValid] = useState(true);
    const [apiResponse, setApiResponse] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [autoCloseTimer, setAutoCloseTimer] = useState(null);

    useEffect(() => {
        fetchAvailablePoints();
    }, [userType]);

    // Auto-close timer for successful responses
    useEffect(() => {
        if (apiResponse?.result?.status === 1) {
            // Clear any existing timer
            if (autoCloseTimer) {
                clearTimeout(autoCloseTimer);
            }
            
            // Set new timer to auto-close after 3 seconds
            const timer = setTimeout(() => {
                handleClose();
            }, 3000);
            
            setAutoCloseTimer(timer);
            
            // Cleanup timer on unmount
            return () => {
                if (timer) {
                    clearTimeout(timer);
                }
            };
        }
    }, [apiResponse]);

    // Cleanup timer on component unmount
    useEffect(() => {
        return () => {
            if (autoCloseTimer) {
                clearTimeout(autoCloseTimer);
            }
        };
    }, []);

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

    const handleSubmit = async () => {
        const numPoints = parseInt(points) || 0;
        if (numPoints <= 0) {
            setError('Please enter a valid number of points');
            return;
        }
        if (numPoints > availablePoints) {
            setError(`Insufficient balance. Available: ${availablePoints} points`);
            return;
        }

        setIsSubmitting(true);
        setApiResponse(null);
        
        try {
            console.log('PointPopup: Calling onSubmit with points:', points);
            // Call the onSubmit function passed from parent
            const response = await onSubmit(points);
            console.log('PointPopup: Received response:', response);
            
            // Set the API response
            setApiResponse(response);
            console.log('PointPopup: Set apiResponse to:', response);
            
            // If successful, you might want to refresh available points
            if (response?.result?.status === 1) {
                await fetchAvailablePoints();
            }
        } catch (error) {
            console.error("PointPopup: Submission error:", error);
            setApiResponse({
                result: {
                    status: 0,
                    message: error.message || 'An error occurred during submission'
                }
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        // Clear auto-close timer
        if (autoCloseTimer) {
            clearTimeout(autoCloseTimer);
            setAutoCloseTimer(null);
        }
        setApiResponse(null);
        onClose();
    };

    const handleNewSubmission = () => {
        // Clear auto-close timer
        if (autoCloseTimer) {
            clearTimeout(autoCloseTimer);
            setAutoCloseTimer(null);
        }
        setApiResponse(null);
        setPoints('');
        setError('');
        setIsValid(true);
    };

    // Show API response if available
    if (apiResponse) {
        const isSuccess = apiResponse?.result?.status === 1;
        return (
            <div className="popup-overlay">
                <div className="popup-container">
                    <TextView 
                        type="darkBold" 
                        text={isSuccess ? "Success!" : "Response"}
                        style={{ color: isSuccess ? '#2e7d32' : '#d32f2f' }}
                    />
                    
                    {isSuccess && (
                        <TextView 
                            type="subDark" 
                            text="This popup will close automatically in a few seconds..."
                            style={{ 
                                color: '#666',
                                fontSize: '12px',
                                textAlign: 'center',
                                marginTop: '5px',
                                fontStyle: 'italic'
                            }}
                        />
                    )}
                    
                    <div style={{ 
                        marginTop: '20px',
                        padding: '15px', 
                        backgroundColor: isSuccess ? '#f1f8e9' : '#ffebee', 
                        borderRadius: '8px',
                        border: `2px solid ${isSuccess ? '#4caf50' : '#f44336'}`
                    }}>
                        <TextView 
                            type="subDark" 
                            text={apiResponse?.result?.message || 'No message available'}
                            style={{ 
                                color: isSuccess ? '#2e7d32' : '#d32f2f',
                                textAlign: 'center',
                                marginBottom: '10px'
                            }}
                        />
                        
                        {apiResponse?.result?.data && (
                            <div style={{ 
                                marginTop: '10px',
                                padding: '10px',
                                backgroundColor: '#ffffff',
                                borderRadius: '5px',
                                border: '1px solid #e0e0e0'
                            }}>
                                <TextView 
                                    type="subDark" 
                                    text="Response Data:"
                                    style={{ fontWeight: 'bold', marginBottom: '5px' }}
                                />
                                <pre style={{ 
                                    fontSize: '12px', 
                                    overflow: 'auto',
                                    margin: 0,
                                    color: '#666'
                                }}>
                                    {JSON.stringify(apiResponse.result.data, null, 2)}
                                </pre>
                            </div>
                        )}
                    </div>
                    
                    <div className="popup-actions" style={{ marginTop: '20px' }}>
                        {isSuccess ? (
                            <>
                                <button onClick={handleNewSubmission} className="popup-button-submit">
                                    Another
                                </button>
                                <button onClick={handleClose} className="popup-button-cancel">
                                    Close
                                </button>
                            </>
                        ) : (
                            <>
                                <button onClick={handleNewSubmission} className="popup-button-submit">
                                    Try Again
                                </button>
                                <button onClick={handleClose} className="popup-button-cancel">
                                    Close
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="popup-overlay">
            <div className="popup-container">
                <TextView type="darkBold" text={"Enter d Points"}/>
                
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
                                disabled={!isValid || !points.trim() || isSubmitting}
                                style={{ 
                                    opacity: (!isValid || !points.trim() || isSubmitting) ? 0.6 : 1,
                                    cursor: (!isValid || !points.trim() || isSubmitting) ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default PointPopup
