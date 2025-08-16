import React, { useState, useEffect } from 'react'
import DashboardBox from '../../componants/Main/DashboardBox'
import apiClient from '../../utils/ApiClient';
import QRCode from 'qrcode';

import { faExchangeAlt, faWallet, faHistory, faGift, faPlus, faEye, faEyeSlash, faInbox, faSearch, faPhone, faLocationDot, faCreditCard, faCoins } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import InputText from '../../componants/Main/InputText';
import DateWithIcon from '../../componants/Main/DateWithIcon';
import TextView from '../../componants/Main/TextView';
import SimplePopup from '../../componants/Main/SimplePopup';
import RoundButton from '../../componants/Main/RoundButton';
import Dropdown from '../../componants/Main/Dropdown';

const baseId = import.meta.env.VITE_ID_BASE;
const baseUrl = import.meta.env.VITE_API_BASE_IMG_URL;


function WalletAdmin() {

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
    const [showResponsePopup, setShowResponsePopup] = useState(false);
    const [responseMessage, setResponseMessage] = useState('');
    const [responseType, setResponseType] = useState('success'); // 'success' or 'error'
    const [walletData, setWalletData] = useState(null);
    const [walletLoading, setWalletLoading] = useState(true);


    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [redeems, setredeems] = useState([]);
    const [wallet, setWallet] = useState({});
    const [loadingRdm, setLoadingRdm] = useState(true);
    const [filteredRedeems, setFilteredRedeems] = useState([]);
    const [selectedReadeem, setSelectedRedeem] = useState(null);
    const [selectedPosReadeem, setselectedPosReadeem] = useState(0);
    const [loadingWallet, setLoadingWallet] = useState(true);
    const [showRedeemPopup, setShowRedeemPopup] = useState(false);
    const [pointNote, setPointNote] = useState('');
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [isCompletingRedeem, setIsCompletingRedeem] = useState(false);
    const [bankInfo, setBankInfo] = useState(null);
    const [loadingBankInfo, setLoadingBankInfo] = useState(false);


    const [activeTab, setActiveTab] = useState('transactions'); // 'transactions' or 'redeems'

    // Helper function to format card number with 4-digit separation
    const formatCardNumber = (cardNumber) => {
        if (!cardNumber) return '';
        // Remove any existing spaces and format with 4-digit groups
        const cleanNumber = cardNumber.replace(/\s/g, '');
        return cleanNumber.replace(/(\d{4})(?=\d)/g, '$1 ');
    };

    // Helper function to format date and time in a custom format
    const formatDateTime = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid Date';

        // Format: "Dec 25, 2024 at 2:30 PM"
        const options = {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        };

        return date.toLocaleDateString('en-US', options);
    };


    useEffect(() => {
        fetchTransaction();
        fetchTransactionSettings();
        fetchWalletData();
    }, []);


    ///API CALLING
    const fetchTransaction = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get("/admin/get_all_transaction");
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

    const fetchTransactionSettings = async () => {
        try {
            const response = await apiClient.get("/admin/get_transaction_settings");
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
            const response = await apiClient.get("/admin/get_wallet");
            if (response?.result?.status === 1) {
                console.warn("Get wallet details successfully");
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

    const fetchBankInfo = async (memberId) => {
        setLoadingBankInfo(true);
        try {
            const response = await apiClient.post(`/admin/user_bank_info`, { user_id: memberId });
            if (response?.result?.status === 1) {
                console.warn("Bank info retrieved successfully");
                setBankInfo(response.result.data);
            } else {
                console.warn("Failed to get bank info");
                setBankInfo(null);
            }
        } catch (error) {
            console.error("Failed to fetch bank info:", error);
            setBankInfo(null);
        } finally {
            setLoadingBankInfo(false);
        }
    };



    ///CLICKS FUNCTION
    //   const handleChange = (e) => {
    //       const { name, value } = e.target;
    //       setFormData(prev => ({
    //       ...prev,
    //       [name]: value,
    //       }));
    //   };

    //   const handleLeadListClick = (index) => {
    //       setselectedPosTr(index)
    //       console.log("Clicked index:", index);
    //       console.log("Clicked Sttaus:", transactions[index].lead_status);
    //       setSelectedTransaction(transactions[index])

    //   };

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
            const response = await apiClient.post("/admin/add_admin_topup", {
                transaction_point: parseInt(topUpAmount)
            });

            if (response?.result?.status === 1) {
                console.log("Top up successful:", response.result);
                setResponseMessage("Top up successful!");
                setResponseType('success');
                setShowResponsePopup(true);
                setShowTopUpPopup(false);
                setTopUpAmount('');
                // Refresh transaction data
                fetchTransaction();
            } else {
                console.error("Top up failed:", response?.result?.message);
                setResponseMessage("Top up failed: " + (response?.result?.message || "Unknown error"));
                setResponseType('error');
                setShowResponsePopup(true);
            }
        } catch (error) {
            console.error("Failed to process top up:", error);
            setResponseMessage("Failed to process top up. Please try again.");
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



    useEffect(() => {
        fetchTransaction();
        fetchRedeem();
        fetchWallet();
    }, []);

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



    const addRedeem = async (point, notes) => {
        try {
            const payload = {
                redeem_point: point,
                redeem_notes: notes
            };

            const data = await apiClient.post("/admin/add_redeem", payload);

            if (data?.result?.status === 1) {
                setShowRedeemPopup(false)
                setBankInfo(null);
                fetchRedeem();
            }
        } catch (err) {
            console.error("Something went wrong fetching vendors", err);
        }
    };

    const fetchRedeem = async (preserveSelectedId = null) => {
        setLoadingRdm(true);
        try {
            const responseRedeems = await apiClient.get("/admin/get_all_redeem");
            if (responseRedeems?.result?.status === 1) {
                console.warn("Get Redeem successfully");
                setredeems(responseRedeems.result.data);
                setFilteredRedeems(responseRedeems.result.data);

                // If preserveSelectedId is provided, try to reselect the same item
                if (preserveSelectedId && responseRedeems.result.data.length > 0) {
                    const preservedItem = responseRedeems.result.data.find(r => r.redeem_id === preserveSelectedId);
                    if (preservedItem) {
                        setSelectedRedeem(preservedItem);
                    } else {
                        setSelectedRedeem(responseRedeems.result.data[0]);
                    }
                } else {
                    setSelectedRedeem(responseRedeems.result.data[0]);
                }

            } else {
                console.warn("No Transaction found or status != 1");
            }
        } catch (error) {
            console.error("Failed to fetch Transaction:", error);
        } finally {
            setLoadingRdm(false);
        }
    };

    const updateRedeemStatus = async (id, status, redeemComment) => {
        try {
            const payload = {
                redeem_id: id,
                redeem_status: status,
                redeem_comment: redeemComment,
            };

            const response = await apiClient.post("/admin/redeem-status-update", payload);

            if (response?.result?.status === 1) {
                console.log("Redeem status updated successfully");
                // Refresh redeem data while preserving the selected item
                fetchRedeem(selectedReadeem?.redeem_id);
                // Show success message
                setResponseMessage("Redeem status updated successfully!");
                setResponseType('success');
                setShowResponsePopup(true);
            } else {
                console.warn("Failed to update redeem status:", response?.result?.message);
                setResponseMessage("Failed to update redeem status: " + (response?.result?.message || "Unknown error"));
                setResponseType('error');
                setShowResponsePopup(true);
            }
        } catch (error) {
            console.error("Failed to update redeem status:", error);
            setResponseMessage("Failed to update redeem status. Please try again.");
            setResponseType('error');
            setShowResponsePopup(true);
        }
    };

    const handleStatusChange = (e) => {
        const newStatus = parseInt(e.target.value);
        console.log("Selected Status:", newStatus);

        if (newStatus === 1) {
            // If status is Approved, show popup for point note
            // Fetch bank info for the member
            const memberId = selectedReadeem?.member_id || selectedReadeem?.user_id || selectedReadeem?.id || selectedReadeem?.redeem_id;
            if (memberId) {
                fetchBankInfo(memberId);
            }
            setShowRedeemPopup(true);
        } else {
            // For other statuses, update directly
            updateRedeemStatus(selectedReadeem.redeem_id, newStatus, "");
        }
    };

    const handleStatusUpdateSubmit = (note) => {
        console.log('Submitted Note:', note);
        updateRedeemStatus(selectedReadeem.redeem_id, 1, note);
        setShowRedeemPopup(false);
        setPointNote('');
        setBankInfo(null);
    };

    const handleCompleteRedeemRequest = async (note) => {
        try {
            // Check if redeem request is not being processed by another admin
            if (isCompletingRedeem) {
                setResponseMessage("Redeem request is already being processed. Please wait.");
                setResponseType('error');
                setShowResponsePopup(true);
                return;
            }

            // Set loading state
            setIsCompletingRedeem(true);

            // Log the selected redeem data to see available fields
            console.log('Selected redeem data:', selectedReadeem);

            // Check if we have the necessary data
            if (!selectedReadeem) {
                setResponseMessage("No redeem request selected. Please try again.");
                setResponseType('error');
                setShowResponsePopup(true);
                setIsCompletingRedeem(false);
                return;
            }

            // Get the member ID from the redeem data
            const memberId = selectedReadeem?.member_id || selectedReadeem?.user_id || selectedReadeem?.id || selectedReadeem?.redeem_id;

            if (!memberId) {
                setResponseMessage("Unable to identify member ID. Please check the redeem request data.");
                setResponseType('error');
                setShowResponsePopup(true);
                setIsCompletingRedeem(false);
                return;
            }

            // Validate member ID format (should be a number or valid string)
            if (typeof memberId === 'string' && memberId.trim() === '') {
                setResponseMessage("Invalid member ID format. Please check the redeem request data.");
                setResponseType('error');
                setShowResponsePopup(true);
                setIsCompletingRedeem(false);
                return;
            }

            // Validate notes length
            if (note && note.length > 500) {
                setResponseMessage("Notes are too long. Maximum 500 characters allowed.");
                setResponseType('error');
                setShowResponsePopup(true);
                setIsCompletingRedeem(false);
                return;
            }

            // Check if redeem request has valid notes
            if (!selectedReadeem?.notes || selectedReadeem.notes.trim() === '') {
                setResponseMessage("Redeem request must have valid notes.");
                setResponseType('error');
                setShowResponsePopup(true);
                setIsCompletingRedeem(false);
                return;
            }

            // Check if redeem request has valid date
            if (!selectedReadeem?.redeem_created_at || isNaN(new Date(selectedReadeem.redeem_created_at).getTime())) {
                setResponseMessage("Redeem request has invalid date.");
                setResponseType('error');
                setShowResponsePopup(true);
                setIsCompletingRedeem(false);
                return;
            }

            // Check if redeem request has valid ID
            if (!selectedReadeem?.redeem_id || selectedReadeem.redeem_id <= 0) {
                setResponseMessage("Redeem request has invalid ID.");
                setResponseType('error');
                setShowResponsePopup(true);
                setIsCompletingRedeem(false);
                return;
            }

            // Check if redeem request is already completed or rejected
            if (selectedReadeem?.redeem_status === 1) {
                setResponseMessage("This redeem request has already been completed.");
                setResponseType('error');
                setShowResponsePopup(true);
                setIsCompletingRedeem(false);
                return;
            }

            if (selectedReadeem?.redeem_status === 2) {
                setResponseMessage("This redeem request has been rejected and cannot be completed.");
                setResponseType('error');
                setShowResponsePopup(true);
                setIsCompletingRedeem(false);
                return;
            }

            // Check if redeem request is in pending status
            if (selectedReadeem?.redeem_status !== 0) {
                setResponseMessage("This redeem request is not in pending status and cannot be completed.");
                setResponseType('error');
                setShowResponsePopup(true);
                setIsCompletingRedeem(false);
                return;
            }

            // Check if redeem data is still valid (not stale)
            const currentRedeem = redeems.find(r => r.redeem_id === selectedReadeem.redeem_id);
            if (!currentRedeem || currentRedeem.redeem_status !== 0) {
                setResponseMessage("Redeem request data has changed. Please refresh and try again.");
                setResponseType('error');
                setShowResponsePopup(true);
                setIsCompletingRedeem(false);
                return;
            }

            // Check if redeem request is not too old (optional - 30 days)
            const redeemDate = new Date(selectedReadeem.redeem_created_at);
            const currentDate = new Date();
            const daysDiff = (currentDate - redeemDate) / (1000 * 60 * 60 * 24);
            if (daysDiff > 30) {
                setResponseMessage("This redeem request is over 30 days old. Please review before proceeding.");
                setResponseType('error');
                setShowResponsePopup(true);
                setIsCompletingRedeem(false);
                return;
            }

            // Check if points value is valid
            const requiredPoints = selectedReadeem?.point || 0;
            if (!requiredPoints || requiredPoints <= 0) {
                setResponseMessage("Invalid points value. Points must be greater than 0.");
                setResponseType('error');
                setShowResponsePopup(true);
                setIsCompletingRedeem(false);
                return;
            }

            // Check if points value is within reasonable range
            if (requiredPoints > 1000000) {
                setResponseMessage("Points value is too high. Maximum 1,000,000 points allowed.");
                setResponseType('error');
                setShowResponsePopup(true);
                setIsCompletingRedeem(false);
                return;
            }



            // First, call the admin/add_redeem_transaction API
            const transactionTitle = `Redeem Request - ${selectedReadeem?.notes || 'Points Redeem'}`;

            // Validate transaction title length
            if (transactionTitle.length > 100) {
                setResponseMessage("Transaction title is too long. Please shorten the redeem request notes.");
                setResponseType('error');
                setShowResponsePopup(true);
                setIsCompletingRedeem(false);
                return;
            }

            const transactionPayload = {
                transaction_title: transactionTitle,
                transaction_point: selectedReadeem?.point || 0,
                to_id: memberId
            };

            console.log('Calling add_redeem_transaction API with payload:', transactionPayload);

            const transactionResponse = await apiClient.post("/admin/add_redeem_transaction", transactionPayload);

            if (transactionResponse?.result?.status === 1) {
                console.log("Transaction added successfully:", transactionResponse.result);

                // After successful transaction, update the redeem status
                await updateRedeemStatus(selectedReadeem.redeem_id, 1, note);
                setShowRedeemPopup(false);
                setPointNote('');
                setBankInfo(null);

                // Refresh wallet data and transactions to show updated balance
                fetchWalletData();
                fetchTransaction();

                // Show success message
                setResponseMessage("Redeem request completed successfully! Transaction has been added.");
                setResponseType('success');
                setShowResponsePopup(true);

                // Reset loading state
                setIsCompletingRedeem(false);
            } else {
                // Handle error response format
                let errorMessage = "Unknown error occurred";

                if (transactionResponse?.error && transactionResponse.error.length > 0) {
                    // API returned error array
                    errorMessage = transactionResponse.error[0].message || errorMessage;
                } else if (transactionResponse?.result?.message) {
                    // API returned error in result.message
                    errorMessage = transactionResponse.result.message;
                } else if (transactionResponse?.message) {
                    // Fallback to direct message
                    errorMessage = transactionResponse.message;
                }

                console.error("Failed to add transaction:", errorMessage);
                setResponseMessage(errorMessage);
                setResponseType('error');
                setShowResponsePopup(true);
                setIsCompletingRedeem(false);
            }
        } catch (error) {
            console.error("Failed to complete redeem request:", error);
            setResponseMessage("Failed to complete redeem request. Please try again.");
            setResponseType('error');
            setShowResponsePopup(true);
            setIsCompletingRedeem(false);
        }
    };

    const handleRedeemPopupCancel = () => {
        setShowRedeemPopup(false);
        setPointNote('');
        setBankInfo(null);
    };

    const fetchWallet = async () => {
        setLoadingWallet(true);
        try {
            const response = await apiClient.get("/admin/get_walletDetails");
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
            formatDateTime(transaction.transaction_created_at).includes(searchTerm)
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
            formatDateTime(redeem.redeem_created_at).includes(searchTerm)
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

    const handleRedeemPopupSubmit = (points, notes) => {
        console.log('Submitted Points:', points);
        addRedeem(points, notes)
    };

    const handleLeadListClickRedeem = (index) => {
        const selectedRedeem = filteredRedeems[index];
        const originalIndex = redeems.findIndex(r => r.redeem_id === selectedRedeem.redeem_id);
        setselectedPosReadeem(originalIndex >= 0 ? originalIndex : index);
        console.log("Clicked index:", index);
        console.log("Clicked Sttaus:", selectedRedeem.redeem_id);
        setSelectedRedeem(selectedRedeem)
    };


    const getStatusColor = (status) => {
        switch (status) {
            case 0: return '#ff9800'; // Pending
            case 1: return '#4caf50'; // Approved
            case 2: return '#f44336'; // Rejected
            default: return '#9e9e9e'; // Default
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 0: return 'Pending';
            case 1: return 'Done';
            case 2: return 'Rejected';
            default: return 'Unknown';
        }
    };


    return (
        <div className='content-view'>

            <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'row'
            }}>

                <div style={{
                    width: '30%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '2px'
                }}>
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
                                paddingBottom: '0px',
                                paddingTop: '15px',
                                gap: '5px'
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
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        height: '120px'
                                    }}>
                                        <div className="spinner" style={{ borderColor: 'white', borderTopColor: 'transparent' }} />
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
                                        height: '160px'
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
                                                    style={{ fontSize: '10px' }}
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
                                                    {walletData?.card?.card_type || 'Silver'}
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
                                )}

                                {/* Card Details */}
                                {!walletLoading && walletData?.card && (
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '0px',
                                        marginTop: '10px',
                                        padding: '0px',
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: '8px',
                                        border: '1px solid #e9ecef'
                                    }}>
                                        {/* <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}>
                                            <TextView type="subDark" text="Card ID" />
                                            <TextView type="darkBold" text={walletData.card.card_id} />
                                        </div> */}



                                        {/* Balance Review Section */}
                                        <div style={{
                                            marginTop: '0px',
                                            padding: '12px',
                                            backgroundColor: '#f8f9fa',
                                            borderRadius: '8px',
                                            border: '1px solid #e9ecef'
                                        }}>
                                            <TextView type="darkBold" text="Balance Review" style={{ marginBottom: '10px', fontSize: '14px' }} />

                                            {/* Calculate differences */}
                                            {(() => {
                                                const adminTopup = walletData?.admin_topup_sum || 0;
                                                const totalPoints = walletData?.total_point_sum || 0;
                                                const balancePoints = walletData?.balance_point || 0;
                                                const missingPoints = Math.max(0, adminTopup - totalPoints);
                                                const unknownPoints = Math.max(0, totalPoints - adminTopup);
                                                const hasDiscrepancy = missingPoints > 0 || unknownPoints > 0;

                                                return (
                                                    <>
                                                        <div style={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center',
                                                            marginBottom: '8px'
                                                        }}>
                                                            <TextView type="subDark" text="Expected Total (Admin Top-up)" />
                                                            <TextView type="darkBold" text={`${adminTopup} Points`} style={{ color: '#1976d2' }} />
                                                        </div>
                                                        <div style={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center',
                                                            marginBottom: '8px'
                                                        }}>
                                                            <TextView type="subDark" text="Actual Total Points" />
                                                            <TextView type="darkBold" text={`${totalPoints} Points`} style={{ color: '#f57c00' }} />
                                                        </div>
                                                        <div style={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center',
                                                            marginBottom: '8px'
                                                        }}>
                                                            <TextView type="subDark" text="Available Balance" />
                                                            <TextView type="darkBold" text={`${balancePoints} Points`} style={{ color: '#2e7d32' }} />
                                                        </div>

                                                        {/* Discrepancy Alert */}
                                                        {hasDiscrepancy && (
                                                            <div style={{
                                                                marginTop: '12px',
                                                                padding: '10px',
                                                                backgroundColor: missingPoints > 0 ? '#fff3e0' : '#e8f5e8',
                                                                borderRadius: '6px',
                                                                border: `1px solid ${missingPoints > 0 ? '#ffb74d' : '#4caf50'}`
                                                            }}>
                                                                <div style={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: '8px',
                                                                    marginBottom: '8px'
                                                                }}>
                                                                    <div style={{
                                                                        width: '16px',
                                                                        height: '16px',
                                                                        borderRadius: '50%',
                                                                        backgroundColor: missingPoints > 0 ? '#ff9800' : '#4caf50',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        color: 'white',
                                                                        fontSize: '10px',
                                                                        fontWeight: 'bold'
                                                                    }}>
                                                                        {missingPoints > 0 ? '!' : '✓'}
                                                                    </div>
                                                                    <TextView type="darkBold" text={
                                                                        missingPoints > 0
                                                                            ? `Missing ${missingPoints} Points`
                                                                            : `Extra ${unknownPoints} Points Found`
                                                                    } style={{
                                                                        fontSize: '13px',
                                                                        color: missingPoints > 0 ? '#e65100' : '#2e7d32'
                                                                    }} />
                                                                </div>
                                                                <TextView type="subDark" text={
                                                                    missingPoints > 0
                                                                        ? `Admin has topped up ${adminTopup} points but only ${totalPoints} points are recorded. Check for transaction issues or pending approvals.`
                                                                        : `System shows ${unknownPoints} more points than admin top-ups. These may be from vendor transactions, rewards, or other sources.`
                                                                } style={{
                                                                    fontSize: '11px',
                                                                    color: missingPoints > 0 ? '#e65100' : '#2e7d32'
                                                                }} />
                                                            </div>
                                                        )}

                                                        {/* No Discrepancy Message */}
                                                        {!hasDiscrepancy && adminTopup > 0 && (
                                                            <div style={{
                                                                marginTop: '12px',
                                                                padding: '10px',
                                                                backgroundColor: '#e8f5e8',
                                                                borderRadius: '6px',
                                                                border: '1px solid #4caf50'
                                                            }}>
                                                                <div style={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: '8px'
                                                                }}>
                                                                    <div style={{
                                                                        width: '16px',
                                                                        height: '16px',
                                                                        borderRadius: '50%',
                                                                        backgroundColor: '#4caf50',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        color: 'white',
                                                                        fontSize: '10px',
                                                                        fontWeight: 'bold'
                                                                    }}>
                                                                        ✓
                                                                    </div>
                                                                    <TextView type="subDark" text="All points are accounted for. No discrepancies found." style={{
                                                                        fontSize: '11px',
                                                                        color: '#2e7d32'
                                                                    }} />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                )}


                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '8px',
                                    marginTop: '20px'
                                }}>
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
                    width: '70%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    paddingLeft: '20px',
                    paddingRight: '0px',
                    paddingBottom: '0px'
                }}>
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
                                    {/* {formData.search && (
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
                            )} */}
                                </div>

                                {/* {activeTab === 'redeems' && (
                            <RoundButton 
                            icon={faPlus} 
                            onClick={() => setShowRedeemPopup(true)}
                            style={{
                                backgroundColor: 'var(--highlight-color)',
                                color: '#333',
                                width: '40px',
                                height: '40px'
                            }}
                            />
                        )} */}
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
                                                                text={baseId + trItems.transaction_id}
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
                                                            {formatDateTime(trItems.transaction_created_at)}
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
                                                                text={baseId + rdmItems.redeem_id}
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
                                                            {formatDateTime(rdmItems.redeem_created_at)}
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
                                        borderBottom: '1px solid #eee',
                                    }}>
                                        <FontAwesomeIcon icon={activeTab === 'transactions' ? faHistory : faGift} style={{ fontSize: '18px', color: 'var(--highlight-color)' }} />
                                        <TextView type="darkBold" text={`${activeTab === 'transactions' ? 'Transaction' : 'Redeem'} Details`} style={{ fontSize: '16px' }} />
                                    </div>

                                    {/* Details Content */}
                                    <div style={{ flex: 1, }}>
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
                                                        src={selectedTransaction?.vendor_image ? baseUrl + selectedTransaction?.vendor_image : "/dummy.jpg"}
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
                                                            <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#666' }}>{baseId + selectedTransaction?.transaction_id}</div>
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
                                                            <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Date & Time</div>
                                                            <div style={{ fontSize: '12px', color: '#666' }}>
                                                                {formatDateTime(selectedTransaction?.transaction_created_at)}
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
                                                        <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Request Date & Time</div>
                                                        <div style={{ fontSize: '12px', color: '#666' }}>
                                                            {formatDateTime(selectedReadeem?.redeem_created_at)}
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

                                                {/* Status Update Section */}
                                                <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #eee' }}>
                                                    <TextView type="darkBold" text="Update Status" style={{ marginBottom: '15px' }} />
                                                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                                        <div style={{ width: '50%' }}>
                                                            {/* <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>New Status</div> */}
                                                            <Dropdown
                                                                data={[
                                                                    { id: 0, name: 'Pending' },
                                                                    { id: 1, name: 'Done' },
                                                                    { id: 2, name: 'Rejected' }
                                                                ]}
                                                                selectedItem={selectedReadeem?.redeem_status || 0}
                                                                onChange={handleStatusChange}
                                                                firstItem="Select Status"
                                                            />
                                                        </div>
                                                        {/* <div style={{ 
                                                padding: '6px 12px',
                                                backgroundColor: getStatusColor(selectedReadeem?.redeem_status),
                                                color: 'white',
                                                borderRadius: '20px',
                                                fontSize: '12px',
                                                fontWeight: 'bold',
                                                minWidth: '80px',
                                                textAlign: 'center'
                                            }}>
                                                {getStatusText(selectedReadeem?.redeem_status)}
                                            </div> */}
                                                    </div>
                                                </div>
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
                            padding: '25px 0px',
                            borderBottom: '1px solid #e0e0e0',
                            borderRadius: '8px 8px 0 0',
                            height: '10px'
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                height: '100%'
                            }}>
                                <TextView type="darkBold" text="Top Up Wallet" style={{ fontSize: '18px', margin: 0 }} />
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
                            <TextView type="subDark" text="Enter amount to top up:" style={{ marginBottom: '8px' }} />
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

                            {/* Top-up Amount Display */}
                            {topUpAmount && topUpAmount > 0 && (
                                <div style={{
                                    marginTop: '15px',
                                    padding: '12px',
                                    backgroundColor: '#e8f5e8',
                                    borderRadius: '6px',
                                    border: '1px solid #4caf50'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <TextView type="subDark" text="Top-up Amount:" />
                                        <TextView type="darkBold" text={`${topUpAmount} Points`} style={{ color: '#2e7d32' }} />
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

            {/* Redeem Status Update Popup */}
            {showRedeemPopup && (
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
                            height: '10px',
                        }}>
                            <TextView type="darkBold" text="Complete Redeem Request" style={{ fontSize: '18px' }} />
                        </div>

                        <div style={{ marginBottom: '30px' }}>
                            <div style={{ marginBottom: '15px' }}>
                                <TextView type="darkBold" text="Points to Complete" style={{ marginBottom: '8px' }} />
                                <div style={{
                                    fontSize: '24px',
                                    fontWeight: 'bold',
                                    color: 'var(--highlight-color)',
                                    textAlign: 'center',
                                    padding: '15px',
                                    backgroundColor: '#f5f5f5',
                                    borderRadius: '8px'
                                }}>
                                    {selectedReadeem?.point} Points
                                </div>
                            </div>

                            <div>
                                <TextView type="darkBold" text="Admin Notes (Optional)" style={{ marginBottom: '8px' }} />
                                <InputText
                                    name="pointNote"
                                    value={pointNote}
                                    onChange={(e) => setPointNote(e.target.value)}
                                    placeholder="Enter any additional notes..."
                                    style={{
                                        width: '100%',
                                        border: '2px solid #e0e0e0',
                                        borderRadius: '12px',
                                        padding: '15px 18px',
                                        fontSize: '14px',
                                        backgroundColor: '#ffffff',
                                        color: '#333',
                                        transition: 'all 0.3s ease',
                                        outline: 'none',
                                        boxSizing: 'border-box',
                                        fontFamily: 'inherit',
                                        lineHeight: '1.5',
                                        resize: 'vertical',
                                        minHeight: '60px'
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = '#007bff';
                                        e.target.style.boxShadow = '0 0 0 3px rgba(0, 123, 255, 0.1)';
                                        e.target.style.backgroundColor = '#fafbfc';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = '#e0e0e0';
                                        e.target.style.boxShadow = 'none';
                                        e.target.style.backgroundColor = '#ffffff';
                                    }}
                                    onMouseEnter={(e) => {
                                        if (document.activeElement !== e.target) {
                                            e.target.style.borderColor = '#d0d0d0';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (document.activeElement !== e.target) {
                                            e.target.style.borderColor = '#e0e0e0';
                                        }
                                    }}
                                />
                            </div>

                            {/* Bank Information Section */}
                            <div style={{ marginTop: '20px' }}>
                                <TextView type="darkBold" text="Member Bank Details" style={{ marginBottom: '15px' }} />

                                {loadingBankInfo ? (
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        padding: '20px',
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: '8px'
                                    }}>
                                        <div className="spinner" style={{ width: '20px', height: '20px' }}></div>
                                        <span style={{ marginLeft: '10px', color: '#666' }}>Loading bank details...</span>
                                    </div>
                                ) : bankInfo ? (
                                    <div style={{
                                        padding: '15px',
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: '8px',
                                        border: '1px solid #e0e0e0'
                                    }}>
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: '1fr 1fr',
                                            gap: '15px',
                                            marginBottom: '15px'
                                        }}>
                                            <div>
                                                <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Account Number</div>
                                                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#333' }}>
                                                    {bankInfo.ac_no || 'N/A'}
                                                </div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>IBAN Number</div>
                                                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#333' }}>
                                                    {bankInfo.iban_no || 'N/A'}
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Bank Name</div>
                                            <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#333' }}>
                                                {bankInfo.bank_name || 'N/A'}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{
                                        padding: '15px',
                                        backgroundColor: '#fff3e0',
                                        borderRadius: '8px',
                                        border: '1px solid #ff9800',
                                        textAlign: 'center',
                                        color: '#e65100'
                                    }}>
                                        <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' }}>
                                            ⚠️ No Bank Information
                                        </div>
                                        <div style={{ fontSize: '12px' }}>
                                            Member has not provided bank details yet.
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div style={{
                            display: 'flex',
                            gap: '10px',
                            justifyContent: 'flex-end'
                        }}>
                            <button
                                onClick={handleRedeemPopupCancel}
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
                                onClick={() => handleCompleteRedeemRequest(pointNote)}
                                disabled={isCompletingRedeem}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: isCompletingRedeem ? '#ccc' : '#4caf50',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: isCompletingRedeem ? 'not-allowed' : 'pointer',
                                    fontSize: '14px',
                                    fontWeight: 'bold',
                                    opacity: isCompletingRedeem ? 0.7 : 1
                                }}
                            >
                                {isCompletingRedeem ? 'Processing...' : 'Complete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* API Response Popup */}
            {showResponsePopup && (
                <SimplePopup onClose={() => setShowResponsePopup(false)}>
                    <div style={{
                        padding: '20px',
                        textAlign: 'center',
                    }}>
                        <div style={{
                            marginBottom: '15px',
                            fontSize: responseType === 'success' ? '24px' : '20px',
                            color: responseType === 'success' ? '#2e7d32' : '#d32f2f',
                            fontWeight: 'bold'
                        }}>
                            {responseType === 'success' ? '✓' : '✗'}
                        </div>
                        <TextView
                            type="darkBold"
                            text={responseMessage}
                            style={{
                                marginBottom: '20px',
                                color: responseType === 'success' ? '#2e7d32' : '#d32f2f'
                            }}
                        />
                        <button
                            onClick={() => setShowResponsePopup(false)}
                            style={{
                                padding: '10px 10px',
                                backgroundColor: responseType === 'success' ? '#2e7d32' : '#d32f2f',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: 'bold'
                            }}
                        >
                            OK
                        </button>
                    </div>
                </SimplePopup>
            )}
        </div>
    )
}

export default WalletAdmin
