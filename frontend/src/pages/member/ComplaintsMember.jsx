import React,{useState,useEffect,useRef} from 'react'
import DashboardBox from '../../componants/Main/DashboardBox'
import apiClient from '../../utils/ApiClient';
import { getUserId } from '../../utils/auth';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperclip } from "@fortawesome/free-solid-svg-icons";
import '../../componants/Main/Main.css';
import InputText from '../../componants/Main/InputText';
import RoundButton from '../../componants/Main/RoundButton';
import DateWithIcon from '../../componants/Main/DateWithIcon';
import StatusBadge from '../../componants/Main/StatusBadge';
import TextView from '../../componants/Main/TextView';
import RightSidePopup from '../../componants/Main/RightSidePopup';
import Dropdown from '../../componants/Main/Dropdown';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

const baseId = import.meta.env.VITE_ID_BASE;

// Helper function to format message date
const formatMessageDate = (dateString) => {
    console.log('formatMessageDate called with:', dateString);
    const messageDate = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Reset time to compare only dates
    const messageDateOnly = new Date(messageDate.getFullYear(), messageDate.getMonth(), messageDate.getDate());
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const yesterdayOnly = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
    
    console.log('Message date:', messageDateOnly);
    console.log('Today:', todayOnly);
    console.log('Yesterday:', yesterdayOnly);
    
    if (messageDateOnly.getTime() === todayOnly.getTime()) {
        console.log('Returning Today');
        return 'Today';
    } else if (messageDateOnly.getTime() === yesterdayOnly.getTime()) {
        console.log('Returning Yesterday');
        return 'Yesterday';
    } else {
        const formattedDate = messageDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        console.log('Returning formatted date:', formattedDate);
        return formattedDate;
    }
};

// Helper function to group messages by date
const groupMessagesByDate = (messages) => {
    console.log('groupMessagesByDate called with messages:', messages);
    const groups = [];
    let currentDate = null;
    let currentGroup = [];

    messages.forEach((message) => {
        console.log('Processing message:', message);
        // Try different possible date field names
        const dateField = message.create_at || message.created_at || message.date || message.timestamp;
        console.log('Date field found:', dateField);
        
        if (!dateField) {
            console.warn('No date field found for message:', message);
            return;
        }
        
        const messageDate = new Date(dateField);
        const dateKey = messageDate.toDateString();
        console.log('Date key:', dateKey);
        
        if (dateKey !== currentDate) {
            if (currentGroup.length > 0) {
                groups.push({
                    date: currentDate,
                    messages: currentGroup
                });
            }
            currentDate = dateKey;
            currentGroup = [message];
        } else {
            currentGroup.push(message);
        }
    });

    // Add the last group
    if (currentGroup.length > 0) {
        groups.push({
            date: currentDate,
            messages: currentGroup
        });
    }

    console.log('Final groups:', groups);
    return groups;
};

// Helper function to group complaints by date
const groupComplaintsByDate = (complaints) => {
    const groups = [];
    let currentDate = null;
    let currentGroup = [];

    complaints.forEach((complaint) => {
        // Try different possible date field names
        const dateField = complaint.created_at || complaint.create_at || complaint.date || complaint.timestamp;
        
        if (!dateField) {
            return;
        }
        
        const complaintDate = new Date(dateField);
        const dateKey = complaintDate.toDateString();
        
        if (dateKey !== currentDate) {
            if (currentGroup.length > 0) {
                groups.push({
                    date: currentDate,
                    complaints: currentGroup
                });
            }
            currentDate = dateKey;
            currentGroup = [complaint];
        } else {
            currentGroup.push(complaint);
        }
    });

    // Add the last group
    if (currentGroup.length > 0) {
        groups.push({
            date: currentDate,
            complaints: currentGroup
        });
    }

    return groups;
};

function ComplaintsMember() {

    const [loadingComp, setLoadingComp] = useState(true);
    const [complaints, setComplaints] = useState([]);
    const [selectedComplaints, setSelectedComplaints] = useState(null);
    const [showCompPopup, setShowCompPopup] = useState(false);
    const [selectedPosComp, setselectedPosComp] = useState(0);
    const [fileName, setFileName] = useState("");

    const [vendors, setVendors] = useState([]);
    const [selectedVendor, setSelectedVendor] = useState("");

    const fileInputRef = useRef();
    //const [file, setFile] = useState(null);
    const [isLoadingFile, setIsLoadingFile] = useState(false);
    const [fileUploadStatus, setfileUploadStatus] = useState("Add your attachment");
    //const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const [formData, setFormData] = useState({
            search: "",
            subject:"",
            message:""
      })
    const [messages, setMessages] = useState([]);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [sendingMessage, setSendingMessage] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [filteredComplaints, setFilteredComplaints] = useState([]);

     useEffect(() => {
        fetchComplaints();
        loadVendors();
        // Set current user ID
        const userId = getUserId();
        if (userId) {
            setCurrentUserId(parseInt(userId));
        }
      },[]);

    useEffect(() => {
        // Filter complaints based on search term
        if (complaints.length > 0) {
            if (formData.search.trim() === "") {
                setFilteredComplaints(complaints);
            } else {
                const filtered = complaints.filter(complaint => {
                    const searchTerm = formData.search.toLowerCase();
                    const subject = String(complaint.subject || '').toLowerCase();
                    const message = String(complaint.message || '').toLowerCase();
                    const complaintId = String(baseId + complaint.id || '').toLowerCase();
                    const status = String(complaint.status || '').toLowerCase();
                    
                    return subject.includes(searchTerm) ||
                           message.includes(searchTerm) ||
                           complaintId.includes(searchTerm) ||
                           status.includes(searchTerm);
                });
                setFilteredComplaints(filtered);
            }
        }
    }, [formData.search, complaints]);

    useEffect(() => {
        if (selectedComplaints?.id) {
            fetchMessages(selectedComplaints.id);
        }
    }, [selectedComplaints]);

    useEffect(() => {
        // Scroll to bottom when messages are loaded
        const messagesContainer = document.querySelector('.messages-container');
        if (messagesContainer && messages.length > 0) {
            setTimeout(() => {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }, 100);
        }
    }, [messages]);

    useEffect(() => {
        // Ensure first date separator is visible when messages load
        const messagesContainer = document.querySelector('.messages-container');
        if (messagesContainer && messages.length > 0) {
            setTimeout(() => {
                const firstDateSeparator = messagesContainer.querySelector('div[style*="justifyContent: center"]');
                if (firstDateSeparator) {
                    firstDateSeparator.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 200);
        }
    }, [messages]);


    ///API CALLING
    const fetchComplaints = async () => {
        setLoadingComp(true);
        try {
        const response = await apiClient.get("/member/get_complaints");
        if (response?.result?.status === 1) {
            console.warn("Get Complaints successfully");
            setComplaints(response.result.data);
            setFilteredComplaints(response.result.data);
            setSelectedComplaints(response.result.data[0])

        } else {
            console.warn("No Transaction found or status != 1");
        }
        } catch (error) {
        console.error("Failed to fetch Transaction:", error);
        } finally {
        setLoadingComp(false);
        }
    };

    const fetchMessages = async (complaintId) => {
        if (!complaintId) return;
        
        setLoadingMessages(true);
        try {
            const payload = {
                complaint_id: complaintId
            };
            const response = await apiClient.post(`/member/get_complaint_message`, payload);
            if (response?.result?.status === 1) {
                console.log('Fetched messages:', response.result.data);
                setMessages(response.result.data || []);
            } else {
                console.warn("No messages found or status != 1");
                setMessages([]);
            }
        } catch (error) {
            console.error("Failed to fetch messages:", error);
            setMessages([]);
        } finally {
            setLoadingMessages(false);
        }
    };

    const sendMessage = async (text, complaintId) => {
        if (!text.trim() || !complaintId || !currentUserId) return;
        
        setSendingMessage(true);
        try {
            const payload = {
                text: text,
                complaint_id: complaintId
            };
            
            const response = await apiClient.post("/member/create_complaint_message", payload);
            if (response?.result?.status === 1) {
                // Add the new message to the messages list
                const newMessage = {
                    id: response.result.data?.id || Date.now(), // Use the ID from response if available
                    text: text,
                    complaint_id: complaintId,
                    sender: currentUserId,
                    create_at: new Date().toISOString(),
                    read_status: 0
                };
                setMessages(prev => [...prev, newMessage]);
                // Clear the input
                setFormData(prev => ({ ...prev, message: "" }));
                
                // Scroll to bottom after a short delay to ensure the new message is rendered
                setTimeout(() => {
                    const messagesContainer = document.querySelector('.messages-container');
                    if (messagesContainer) {
                        messagesContainer.scrollTop = messagesContainer.scrollHeight;
                    }
                }, 100);
            } else {
                console.error("Failed to send message");
            }
        } catch (error) {
            console.error("Failed to send message:", error);
        } finally {
            setSendingMessage(false);
        }
    };

    const createCopm = async () => {
      try {

          const payload = {
              vendor_id: selectedVendor,
              subject: formData.subject,
              message: formData.message,
              attachment: fileName,

          };
          
         
          const data = await apiClient.post("/member/create_complaint", payload);

          if (data?.result?.status === 1) {
                setShowCompPopup(false)
                fetchComplaints();
                setFormData({
                    search: "",
                    subject:"",
                    message:""
                })
                setSelectedVendor(0)


          }
      } catch (err) {
          console.error("Something went wrong fetching vendors", err);
      }
      finally {
          //setisLoading(false); // Hide loader
      }
    };

    const loadVendors = async () => {
        try {
            const data = await apiClient.get("/member/vendorlist");
        if (data && data.result?.data) {
            setVendors(data.result.data);
        }
        } catch (err) {
        console.error("Something went wrong fetching vendors", err);
        }
    };

    const uploadFile = async (file) => {
        const formDataFile = new FormData();
        formDataFile.append("file", file);

        const response = await apiClient.post("/member/upload", formDataFile);

        const result = await response;
        console.log("Upload result:", result);
        if (result.success)
        {
            setFileName(result.file)
            setfileUploadStatus("Uploaded ✅");
            setIsLoadingFile(false)
        }
        else
        {
            setfileUploadStatus("failed ❌");
            setIsLoadingFile(false)
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

    const handleCompListClick = (index) => {
        setselectedPosComp(index)
        console.log("Clicked index:", index);
        console.log("Clicked Status:", filteredComplaints[index].status);
        setSelectedComplaints(filteredComplaints[index])
    };

    const handleVendorChange = (e) => {
        setSelectedVendor(e.target.value);
        
        console.log("Selected Vendor ID:", e.target.value);
    };

  const handleClick = () => {
    setfileUploadStatus("Add your attachment");
    fileInputRef.current.click();
  };

  const handleSendMessage = () => {
    if (formData.message.trim() && selectedComplaints?.id && currentUserId) {
      sendMessage(formData.message, selectedComplaints.id);
    }
  };

  const handleFileChange = (event) => {
    setIsLoadingFile(true)
    const selectedFile = event.target.files[0];
    if (selectedFile) {
        uploadFile(selectedFile);
        fileInputRef.current.value = ""; // Reset immediately
    }

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
                  width: '30%',
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
                                    placeholder="Search Complaints"
                                    name="search"
                                    value={formData.search}
                                    onChange={handleChange}
                                />

                            </div>

                            <div style={{
                            width: '55px',
                            height: '60px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingRight:'10px',
                            paddingLeft:'0px'}}> 
                                <RoundButton icon={faPlus} onClick={() => setShowCompPopup(true)}/>
                            </div>  
                        </div>


                        <div className="user-list-scroll-container">
                            {loadingComp ? (
                            <div className="loader-container">
                                <div className="spinner" />
                            </div>
                            ) : filteredComplaints.length === 0 ? (
                            <div className="no-results-container">
                                <div className="no-results-icon">🔍</div>
                                <div className="no-results-text">No complaints found</div>
                                <div className="no-results-subtext">Try adjusting your search terms</div>
                            </div>
                            ) : (
                            filteredComplaints.map((compItems, index) => (
                              <div className="user-list-item-rdm" key={compItems.id || index}>
                                <div 
                                  className={`complaint-list-item ${selectedPosComp === index ? 'complaint-list-item-selected' : ''}`}
                                  onClick={() => handleCompListClick(index)}
                                >
                                  <div className="complaint-item-header">
                                    <div className="complaint-status-indicator">
                                      <StatusBadge status={compItems?.status} />
                                    </div>
                                    <div className="complaint-date-time">
                                      <span className="complaint-date">
                                        {new Date(compItems?.created_at).toLocaleDateString("en-US", {
                                          month: "short",
                                          day: "numeric"
                                        })}
                                      </span>
                                      <span className="complaint-time">
                                        {new Date(compItems?.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                      </span>
                                    </div>
                                  </div>
                                  
                                  <div className="complaint-item-content">
                                    <h4 className="complaint-subject">
                                      {compItems?.subject}
                                    </h4>
                                    <p className="complaint-message-preview">
                                      {compItems?.message?.length > 60 
                                        ? `${compItems?.message.substring(0, 60)}...` 
                                        : compItems?.message
                                      }
                                    </p>
                                  </div>
                                  
                                  <div className="complaint-item-footer">
                                    <span className="complaint-id">
                                      #{baseId}{compItems?.id}
                                    </span>
                                    <div className="complaint-priority">
                                      <span className={`priority-dot ${compItems?.status === 'pending' ? 'high' : compItems?.status === 'in_progress' ? 'medium' : 'low'}`}></span>
                                      <span className="priority-text">
                                        {compItems?.status === 'pending' ? 'High' : compItems?.status === 'in_progress' ? 'Medium' : 'Low'}
                                      </span>
                                    </div>
                                  </div>
                                  
                                  {selectedPosComp === index && (
                                    <div className="complaint-selection-indicator">
                                      <div className="selection-arrow"></div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))
                          )}
                        </div>

                    </DashboardBox>

                </div>
                
                {/* Complaint Details */}
                <div style={{
                    width: '35%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '2px'
                    
                    }}>
                        <DashboardBox>
                            <div className="comp-item-inside complaint-details-container">               
                                <div style={{display: 'flex', flexDirection: 'column',height: '100%'}}>

                                    {/* Header Section with Gradient Background */}
                                    <div className="complaint-header">
                                        <div style={{ 
                                            display: 'flex', 
                                            justifyContent: 'space-between', 
                                            alignItems: 'flex-start'
                                        }}>
                                            <div style={{ flex: 1, marginRight: '16px' }}>
                                                <h3 style={{ 
                                                    margin: '0 0 8px 0', 
                                                    color: 'white', 
                                                    fontSize: '18px',
                                                    fontWeight: '600',
                                                    textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                                                }}>
                                                    {selectedComplaints?.subject || 'Complaint Details'}
                                                </h3>
                                                <p style={{ 
                                                    margin: '0', 
                                                    color: 'rgba(255, 255, 255, 0.9)', 
                                                    fontSize: '14px',
                                                    textShadow: '0 1px 1px rgba(0,0,0,0.1)'
                                                }}>
                                                    Complaint Information & Status
                                                </p>
                                            </div>
                                            <div style={{ 
                                                display: 'flex', 
                                                flexDirection: 'column', 
                                                alignItems: 'flex-end',
                                                gap: '8px'
                                            }}>
                                                <StatusBadge status={selectedComplaints?.status} />
                                                <div style={{
                                                    fontSize: '10px',
                                                    color: 'rgba(255, 255, 255, 0.8)',
                                                    textAlign: 'center'
                                                }}>
                                                    Last Updated
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Complaint ID and Priority Section */}
                                    <div style={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        alignItems: 'center',
                                        marginBottom: '20px',
                                        padding: '16px',
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: '10px',
                                        border: '1px solid #e9ecef',
                                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                                        position: 'relative'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div className="complaint-icon">
                                                #
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '11px', color: '#6c757d', marginBottom: '2px', fontWeight: '500' }}>
                                                    COMPLAINT ID
                                                </div>
                                                <div style={{ fontSize: '14px', fontWeight: '600', color: '#495057' }}>
                                                    {baseId}{selectedComplaints?.id}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="complaint-status-active">
                                            Active
                                        </div>
                                        {/* Decorative corner element */}
                                        <div style={{
                                            position: 'absolute',
                                            top: '0',
                                            right: '0',
                                            width: '0',
                                            height: '0',
                                            borderStyle: 'solid',
                                            borderWidth: '0 20px 20px 0',
                                            borderColor: 'transparent #007bff transparent transparent',
                                            borderRadius: '0 10px 0 0'
                                        }}></div>
                                    </div>

                                    {/* Message Content Section */}
                                    <div style={{ 
                                        flex: 1,
                                        marginBottom: '20px'
                                    }}>
                                        <div style={{
                                            marginBottom: '16px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px'
                                        }}>
                                            <div className="complaint-icon">
                                                💬
                                            </div>
                                            <h4 style={{ 
                                                margin: '0', 
                                                fontSize: '16px', 
                                                fontWeight: '600',
                                                color: '#495057'
                                            }}>
                                                Complaint Details
                                            </h4>
                                        </div>
                                        <div className="complaint-message-box">
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'flex-start',
                                                gap: '12px'
                                            }}>
                                                <div style={{
                                                    width: '4px',
                                                    height: '20px',
                                                    backgroundColor: '#007bff',
                                                    borderRadius: '2px',
                                                    marginTop: '2px'
                                                }}></div>
                                                <div style={{ flex: 1 }}>
                                                    <TextView type="subDark" text={selectedComplaints?.message || 'No complaint message available.'} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="complaint-divider"></div>

                                    {/* Footer Section with Date and Time */}
                                    <div style={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        alignItems: 'flex-end'
                                    }}>
                                        <div >
                                            <div style={{ 
                                                display: 'flex', 
                                                flexDirection: 'column', 
                                                gap: '8px'
                                            }}>
                                                <div style={{ 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    gap: '10px',
                                                    padding: '5px'
                                                }}>
                                                    <DateWithIcon text={new Date(selectedComplaints?.created_at).toLocaleDateString("en-US", {
                                                        year: "numeric",
                                                        month: "long",
                                                        day: "numeric",
                                                        })} >
                                                    </DateWithIcon>
                                                    <TextView type="subDark" text={new Date(selectedComplaints?.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}/>
                                               
                                                </div>
                                                
                                            </div>
                                        </div>
                                        
                                        {/* Action Buttons */}
                                        <div style={{ 
                                            display: 'flex', 
                                            gap: '8px'
                                        }}>
                                            {/* <button className="complaint-action-btn" title="Copy Complaint ID to clipboard">
                                                📋 Copy ID
                                            </button>
                                            <button className="complaint-action-btn" title="Export complaint details">
                                                📤 Export
                                            </button> */}
                                        </div>
                                    </div>

                                    {/* Additional Info Section */}
                                    {selectedComplaints && (
                                        <div style={{
                                            marginTop: '16px',
                                            padding: '12px',
                                            backgroundColor: '#f8f9fa',
                                            borderRadius: '8px',
                                            border: '1px solid #e9ecef',
                                            fontSize: '12px',
                                            color: '#6c757d'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                                <span>ℹ️</span>
                                                <span style={{ fontWeight: '500' }}>Quick Actions</span>
                                            </div>
                                            <div style={{ fontSize: '11px', lineHeight: '1.4' }}>
                                                Use the buttons above to copy the complaint ID or export details. 
                                                The status badge shows the current resolution progress.
                                            </div>
                                        </div>
                                    )}
                                </div> 
                            </div>
                        </DashboardBox>

                </div>

                {/* Chat with Vendor */}
                <div style={{
                  width: '35%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '0px'
                  
                }}>
                    

                    {/* Messages Container */}
                    <div style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '2px'
                    }}>
                        <DashboardBox>
                            <div style={{
                                boxSizing: 'border-box',
                                display: 'flex',
                                height: '100%',
                                flexDirection: 'column',
                                justifyContent: 'start',
                                padding: '0px',
                                maxHeight: 'calc(100vh - 300px)',
                                minHeight: 'calc(100vh - 200px)'
                            }}>
                                {/* Chat Header */}
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '20px 20px 15px 20px',
                                    borderBottom: '1px solid #f0f0f0',
                                    backgroundColor: '#fafafa',
                                    borderRadius: '8px 8px 0 0'
                                }}>
                                    <div>
                                        <div style={{
                                            fontSize: '16px',
                                            fontWeight: '600',
                                            color: '#333',
                                            marginBottom: '2px'
                                        }}>
                                            Chat with Vendor
                                        </div>
                                        <div style={{
                                            fontSize: '12px',
                                            color: '#666',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px'
                                        }}>
                                            <div style={{
                                                width: '6px',
                                                height: '6px',
                                                borderRadius: '50%',
                                                backgroundColor: '#4caf50'
                                            }} />
                                            <span>Active now</span>
                                        </div>
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}>
                                        <div style={{
                                            padding: '6px 12px',
                                            backgroundColor: '#e8f5e8',
                                            borderRadius: '20px',
                                            fontSize: '11px',
                                            color: '#2e7d32',
                                            fontWeight: '500',
                                            border: '1px solid #c8e6c9'
                                        }}>
                                            {selectedComplaints?.vendor_name || 'Vendor'}
                                        </div>
                                    </div>
                                </div>

                                {/* Messages Container */}
                                <div 
                                    className="messages-container"
                                    style={{
                                        flex: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        overflowY: 'auto',
                                        padding: '20px',
                                        gap: '16px',
                                        maxHeight: 'calc(100vh - 300px)',
                                        minHeight: 'calc(100vh - 300px)'
                                    }}
                                >
                                    {loadingMessages ? (
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            height: '100px',
                                            flexDirection: 'column',
                                            gap: '12px'
                                        }}>
                                            <div className="spinner" />
                                            <div style={{
                                                fontSize: '14px',
                                                color: '#666'
                                            }}>
                                                Loading messages...
                                            </div>
                                        </div>
                                    ) : messages.length === 0 ? (
                                        <div style={{ 
                                            display: 'flex', 
                                            justifyContent: 'center', 
                                            alignItems: 'center', 
                                            height: '100%',
                                            flexDirection: 'column',
                                            gap: '16px',
                                            color: '#666'
                                        }}>
                                            
                                            <div style={{
                                                textAlign: 'center'
                                            }}>
                                                <div style={{
                                                    fontSize: '18px',
                                                    fontWeight: '600',
                                                    color: '#333',
                                                    marginBottom: '8px'
                                                }}>
                                                    Start a conversation
                                                </div>
                                                <div style={{
                                                    fontSize: '14px',
                                                    color: '#666',
                                                    lineHeight: '1.5'
                                                }}>
                                                    Send your first message to begin chatting with the vendor
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        (() => {
                                            const groupedMessages = groupMessagesByDate(messages);
                                            return groupedMessages.map((group, groupIndex) => (
                                                <div key={groupIndex}>
                                                    {/* Date Separator */}
                                                    <div style={{
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        margin: groupIndex === 0 ? '0 0 20px 0' : '30px 0 20px 0',
                                                        padding: '0 10px'
                                                    }}>
                                                        <div style={{
                                                            backgroundColor: '#fff',
                                                            padding: '8px 16px',
                                                            borderRadius: '20px',
                                                            fontSize: '12px',
                                                            color: '#666',
                                                            fontWeight: '500',
                                                            border: '1px solid #e0e0e0',
                                                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                                        }}>
                                                            {formatMessageDate(group.messages[0].create_at || group.messages[0].created_at || group.messages[0].date || group.messages[0].timestamp)}
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Messages for this date */}
                                                    {group.messages.map((message, index) => {
                                                        const isSentByMe = message.sender === currentUserId;
                                                        const isLastMessage = index === group.messages.length - 1;
                                                        const isFirstMessage = index === 0;
                                                        
                                                        return (
                                                            <div key={message.id || index} style={{
                                                                display: 'flex',
                                                                justifyContent: isSentByMe ? 'flex-end' : 'flex-start',
                                                                marginBottom: isLastMessage ? '0' : '8px',
                                                                alignItems: 'flex-end',
                                                                gap: '8px'
                                                            }}>
                                                                
                                                                
                                                                                                                                 {/* Message Bubble */}
                                                                 <div style={{
                                                                     maxWidth: '70%',
                                                                     position: 'relative'
                                                                 }}>
                                                                     <div 
                                                                         className="message-bubble"
                                                                         style={{
                                                                             padding: '12px 16px',
                                                                             borderRadius: '20px',
                                                                             backgroundColor: isSentByMe ? '#0084ff' : '#fff',
                                                                             color: isSentByMe ? 'white' : '#333',
                                                                             wordWrap: 'break-word',
                                                                             wordBreak: 'break-word',
                                                                             fontSize: '14px',
                                                                             lineHeight: '1.5',
                                                                             overflowWrap: 'break-word',
                                                                             boxShadow: isSentByMe ? '0 2px 8px rgba(0,132,255,0.3)' : '0 2px 8px rgba(0,0,0,0.1)',
                                                                             border: isSentByMe ? 'none' : '1px solid #e0e0e0',
                                                                             position: 'relative'
                                                                         }}
                                                                     >
                                                                         {message.text}
                                                                         
                                                                         {/* Message Time */}
                                                                         <div style={{
                                                                             fontSize: '11px',
                                                                             opacity: isSentByMe ? 0.8 : 0.6,
                                                                             marginTop: '6px',
                                                                             textAlign: isSentByMe ? 'right' : 'left',
                                                                             fontWeight: '500'
                                                                         }}>
                                                                             {new Date(message.create_at || message.created_at || message.date || message.timestamp).toLocaleTimeString([], {
                                                                                 hour: '2-digit',
                                                                                 minute: '2-digit',
                                                                                 hour12: true
                                                                             })}
                                                                         </div>
                                                                     </div>
                                                                    
                                                                    
                                                                </div>
                                                                
                                                                
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            ));
                                        })()
                                    )}
                                </div>

                                {/* Input Section */}
                                <div style={{
                                    width: '100%',
                                    height: '40px',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    borderTop: '1px solid #e0e0e0',
                                    paddingTop: '10px',
                                    paddingLeft: '20px',
                                    paddingRight: '20px',
                                    paddingBottom: '10px'
                                }}>

                                    <div style={{
                                        width: '82%',
                                        height: '40px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent:'center',
                                        justifyItems: 'center',
                                    }}> 

                                    <InputText 
                                            type="name"
                                            placeholder="Type a message..."
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleSendMessage();
                                                }
                                            }}
                                        />

                                    </div>

                                    <div style={{
                                    width: '55px',
                                    height: '40px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'}}> 
                                        <RoundButton 
                                            icon={faPaperPlane} 
                                            onClick={handleSendMessage}
                                            disabled={!formData.message.trim() || sendingMessage}
                                        />
                                    </div>      
                                    
                                </div>
                            </div>
                        </DashboardBox>
                    </div>

                </div>
        </div>

        <RightSidePopup isloading={false} isOpen={showCompPopup} onClose={() => setShowCompPopup(false)} 
            onSubmit={() => {
            //setShowPopup(false);
            createCopm();
            } }
            >
            <TextView type="darkBold" text={"Create your Complaint"}/>
            <div style={{marginTop:'20px'}}></div>

            <Dropdown
                data={vendors}
                selectedItem={selectedVendor}
                onChange={handleVendorChange}
            />
            <InputText placeholder={"Subject"} name={"subject"} onChange={handleChange}></InputText>
            <InputText placeholder={"Message"} name={"message"} onChange={handleChange}></InputText>

            <div className={`input-div-views-attach`} onClick={handleClick}>
                
                {isLoadingFile ? (
                    <div className="loader-container">
                    <div className="spinner" />
                    </div>
                ) : (

                    <div className={`input-div-views-attach`}>

                        <span className="sub-title-text-dark">
                    {/* {text} {fileName && `: ${fileName}`} */}
                     {fileUploadStatus}
                  </span>
                  <FontAwesomeIcon icon={faPaperclip} className="attach-icon" />
                  <input
                    type="file"
                    ref = {fileInputRef}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="file-input-hidden"
                    onChange={handleFileChange}
                  />

                    </div>
                
                )}
                  
            </div>

           
        </RightSidePopup>

    </div>
  )
}

export default ComplaintsMember
