import React,{useState,useEffect,useRef} from 'react'
import DashboardBox from '../../componants/Main/DashboardBox'
import InputText from '../../componants/Main/InputText'
import RoundButton from '../../componants/Main/RoundButton';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import StatusBadge from '../../componants/Main/StatusBadge';
import DateWithIcon from '../../componants/Main/DateWithIcon';

import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons'
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import RightSidePopup from '../../componants/Main/RightSidePopup';
import FileAttachButton from '../../componants/Main/FileAttachButton';
import TextView from '../../componants/Main/TextView';
import '/src/App.css'
import Dropdown from '../../componants/Main/Dropdown';

import apiClient from '../../utils/ApiClient';
import DotBadge from '../../componants/Main/DotBadge';
import { getUserId } from '../../utils/auth';
import PointPopup from '../../componants/Main/PointPopup';
const baseUrl = import.meta.env.VITE_API_BASE_IMG_URL;

// Helper function to format message date
const formatMessageDate = (dateString) => {
    const messageDate = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Reset time to compare only dates
    const messageDateOnly = new Date(messageDate.getFullYear(), messageDate.getMonth(), messageDate.getDate());
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const yesterdayOnly = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
    
    if (messageDateOnly.getTime() === todayOnly.getTime()) {
        return 'Today';
    } else if (messageDateOnly.getTime() === yesterdayOnly.getTime()) {
        return 'Yesterday';
    } else {
        return messageDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
};

// Helper function to group messages by date
const groupMessagesByDate = (messages) => {
    const groups = [];
    let currentDate = null;
    let currentGroup = [];

    messages.forEach((message) => {
        // Try different possible date field names
        const dateField = message.create_at || message.created_at || message.date || message.timestamp;
        
        if (!dateField) {
            return;
        }
        
        const messageDate = new Date(dateField);
        const dateKey = messageDate.toDateString();
        
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

    return groups;
};

function LeadsVendor() {

    const [selectedPos, setselectedPos] = useState(0);
    const [selectedLead, setSelectedLead] = useState(null);
    const [leads, setLeads] = useState([]);
    const [filteredLeads, setFilteredLeads] = useState([]);
    const [file, setFile] = useState(null);
    const [fileName, setfileName] = useState("");
    const [fileUploadStatus, setfileUploadStatus] = useState("");
    const [isLoading, setisLoading] = useState(false);
    const [members, setMembers] = useState([]);
    const [selectedMember, setSelectedMember] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [showPointsPopup, setShowPointsPopup] = useState(false);
    const [loading, setLoading] = useState(true);
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const [selectedStatus, setSelectedStatus] = useState(1);
    const [formData, setFormData] = useState({
            search: "",
            message: "",

            leadId: "",
            leadName: "",
            leadDescription: "",
            memberId: 0,
            leadFile: ""
    });
    const [messages, setMessages] = useState([]);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [sendingMessage, setSendingMessage] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);

    const statusArray =[
        {
            id: 0,
            name: "Pending",
        },
        {
            id: 1,
            name: "Review",
        },
        {
            id: 2,
            name: "Processing",
        },
        {
            id: 3,
            name: "Done",
        },
        {
            id: 4,
            name: "REJECTED",
        }
    ];

    ///API CALLS GET ALL MEMBERS LIST
    useEffect(() => {

        fetchLeads();

        setFormData((prev) => ({
        ...prev,
        memberId:selectedMember,
        leadFile:fileName
        }));

        const loadMembers = async () => {

            try {

                const data = await apiClient.get("/vendor/memberlist");
                
            // const data = await fetchwithAuth("/vendor/memberlist", {
            //     method: "GET"
            // });

            if (data && data.result?.data) {
                setMembers(data.result.data);
            }
            } catch (err) {
            console.error("Something went wrong fetching members", err);
            }
        };

        loadMembers();
    },[selectedMember,fileName]);

    useEffect(() => {
        // Simulate loading time (e.g., API call)
        const timer = setTimeout(() => {
            //setLoading(false);
        }, 1000); // 1 second

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        fetchLeads();
        // Set current user ID
        const userId = getUserId();
        if (userId) {
            setCurrentUserId(parseInt(userId));
        }
    }, []);

    useEffect(() => {
        if (selectedLead?.id) {
            fetchMessages(selectedLead.id);
        }
    }, [selectedLead]);

    useEffect(() => {
        // Scroll to bottom when messages are loaded
        const messagesContainer = document.querySelector('.messages-container');
        if (messagesContainer && messages.length > 0) {
            setTimeout(() => {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }, 100);
        }
    }, [messages]);


    const fetchLeads = async () => {
        setLoading(true);
        try {
        const response = await apiClient.get("/vendor/getleads");

        if (response?.result?.status === 1) {
            setLeads(response.result.data);
            setFilteredLeads(response.result.data);
            setSelectedLead(response.result.data[0])
            setSelectedStatus(response.result.data[selectedPos].lead_status);
        } else {
            console.warn("No leads found or status != 1");
        }
        } catch (error) {
        console.error("Failed to fetch leads:", error);
        } finally {
        setLoading(false);
        }
    };

    const fetchMessages = async (leadId) => {
        if (!leadId) return;
        
        setLoadingMessages(true);
        try {
            const payload = {
                lead_id: leadId
            };
            const response = await apiClient.post(`/vendor/get_lead_message`,payload);
            if (response?.result?.status === 1) {
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

    const sendMessage = async (text, leadId) => {
        if (!text.trim() || !leadId || !currentUserId) return;
        
        setSendingMessage(true);
        try {
            const payload = {
                text: text,
                lead_id: leadId
            };
            
            const response = await apiClient.post("/vendor/create_lead_message", payload);
            if (response?.result?.status === 1) {
                // Add the new message to the messages list
                const newMessage = {
                    id: response.result.data?.id || Date.now(), // Use the ID from response if available
                    text: text,
                    lead_id: leadId,
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

    const updateLeadStatus = async (id,status) => {
        //setLoading(true);
        try {
        const payload = {
        id: id,
        lead_status: status,
        };

        const response = await apiClient.post("/vendor/lead-status-update",payload);

            if (response?.result?.status === 1) {
                setSelectedStatus(id);
                setShowPopup(false);
                fetchLeads()
            } else {
                console.warn("No leads found or status != 1");
            }
        } 
        catch (error) {
        console.error("Failed to fetch leads:", error);
        } finally {
        setLoading(false);
        }
    };

    const addTransaction = async (point) => {

        //(true); // Show loader
        try {

            const payload = {
                transaction_point: point,
                transaction_title: selectedLead.lead_name,
                to_id: selectedLead.user_id
            };
            //console.log("SANTHOSH Vendor ID:", payload);
            const data = await apiClient.post("/vendor/add_transaction", payload);

            //if (data && data.result?.data.status === 1) {
            if (data?.result?.status === 1) {
                // setVendors(data.result.data);
                // setShowPopup(false)
                // fetchLeads();
                updateLeadStatus(selectedLead.id,3)
            }
        } catch (err) {
            console.error("Something went wrong fetching vendors", err);
        }
        finally {
            //setisLoading(false); // Hide loader
        }
    };

    ///CLICKS FUNCTION
    const handlePhoneClick = () => {
        if (formData.message.trim() && selectedLead?.id && currentUserId) {
            sendMessage(formData.message, selectedLead.id);
        }
    };
    // Search functionality
    const handleSearch = (searchTerm) => {
        if (!searchTerm.trim()) {
            setFilteredLeads(leads);
            return;
        }

        const filtered = leads.filter(lead => {
            const searchLower = searchTerm.toLowerCase();
            return (
                lead.lead_name?.toLowerCase().includes(searchLower) ||
                lead.lead_description?.toLowerCase().includes(searchLower) ||
                lead.member_name?.toLowerCase().includes(searchLower) ||
                lead.id?.toString().includes(searchTerm)
            );
        });
        setFilteredLeads(filtered);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
            memberId: selectedMember
        }));

        // Handle search in real-time
        if (name === 'search') {
            handleSearch(value);
        }
    };

    const createLeads = async () => {

        setisLoading(true); // Show loader
        try {

            const payload = {
            member_id: formData.memberId,
            lead_name: formData.leadName,
            lead_description: formData.leadDescription,
            lead_file: formData.leadFile // optional: just a filename string
            };
            console.log("SANTHOSH Member ID:", payload);
            const data = await apiClient.post("/vendor/create-leads", payload);

            //if (data && data.result?.data.status === 1) {
            if (data?.result?.status === 1) {
                setMembers(data.result.data);
                setShowPopup(false)
                fetchLeads();
            }
        } catch (err) {
            console.error("Something went wrong fetching members", err);
        }
        finally {
            setisLoading(false); // Hide loader
        }
    };

    const handleLeadListClick = (index) => {
        setselectedPos(index)
        console.log("Clicked index:", index);
        setSelectedLead(filteredLeads[index])
        setSelectedStatus(filteredLeads[index].lead_status);
    };

    const handleFileChange = async (e) => {
        setfileUploadStatus("");
        const selected = e.target.files[0];
        setFile(selected);
        const formDataFile = new FormData();
        formDataFile.append("file", file);
        setisLoading(true); // Show loader

        try {
            setisLoading(true); // Show loader
            await sleep(1000); // Delay for 1 second (1000 ms)
            const response = await apiClient.post("/vendor/upload", formDataFile);
            setfileName(response.file); 
            setfileUploadStatus("Uploaded ✅");
            console.log("Upload successful", response);
        } catch (err) {
            setfileName(""); 
            setfileUploadStatus("failed ❌");
            console.error("Upload failed", err);
        } finally {
            setisLoading(false); // Hide loader
        }
    };

    
    //const [selectedMemberId, setSelectedMemberId] = useState(0);
    const handleMemberChange = (e) => {
        setSelectedMember(e.target.value);
        
        console.log("Selected Member ID:", e.target.value);
    };

    const handleStatusChange = (e) => {
       // setSelectedStatus(e.target.value);
        console.log("Selected Status ID:", e.target.value);
        console.log("Selected LEAD ID:", selectedLead.id);
        if (e.target.value == 3)
        {
             console.log("Selected Status okaaaay:", e.target.value);
            setShowPointsPopup(true);
        }
        else
        {
             console.log("Selected Status Noooooo:", e.target.value);
            //updateLeadStatus(selectedLead.id,e.target.value)
        }
        
    };

    const handlePopupSubmit = (points) => {
       console.log('Submitted Points:', points);
       addTransaction(points)

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
                                paddingRight:'5px'
                                }}> 

                                   <InputText 
                                        type="name"
                                        placeholder="Search"
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
                                    <RoundButton icon={faPlus} onClick={() => setShowPopup(true)}/>
                                </div>  


                                
                        </div>


                        {/* Search Results Counter */}
                        {formData.search && !loading && (
                            <div style={{
                                padding: '8px 16px',
                                fontSize: '12px',
                                color: '#666',
                                borderBottom: '1px solid #f0f0f0',
                                backgroundColor: '#f8f9fa'
                            }}>
                                {filteredLeads.length === 1 ? '1 lead found' : `${filteredLeads.length} leads found`}
                                {formData.search && (
                                    <span style={{ color: '#999' }}>
                                        {' '}for "{formData.search}"
                                    </span>
                                )}
                            </div>
                        )}

                        <div className="user-list-scroll-container">
                            {loading ? (
                            <div className="loader-container">
                                <div className="spinner" />
                            </div>
                            ) : filteredLeads.length === 0 ? (
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '40px 20px',
                                    color: '#666',
                                    textAlign: 'center'
                                }}>
                                    <div style={{
                                        fontSize: '48px',
                                        marginBottom: '16px',
                                        opacity: 0.5
                                    }}>
                                        🔍
                                    </div>
                                    <div style={{
                                        fontSize: '16px',
                                        fontWeight: '500',
                                        marginBottom: '8px',
                                        color: '#333'
                                    }}>
                                        No leads found
                                    </div>
                                    <div style={{
                                        fontSize: '14px',
                                        color: '#888'
                                    }}>
                                        {formData.search ? `No results for "${formData.search}"` : 'No leads available'}
                                    </div>
                                </div>
                            ) : (
                            filteredLeads.map((leadsItems, index) => (
                                <div className="user-list-item-leads" key={index}>
                                    <div className={`${selectedPos === index ? "user-list-item-leads-inside-select" : "user-list-item-leads-inside"}`} onClick={() => handleLeadListClick(index)}>
                                        {/* Member Avatar */}
                                        <div style={{
                                            position: 'relative',
                                            flexShrink: 0
                                        }}>
                                            <img 
                                                className="user-avatar" 
                                                src={leadsItems.member_image ? baseUrl+leadsItems.member_image : "/public/dummy.jpg"} 
                                                alt={leadsItems.lead_name}
                                                style={{
                                                    width: '50px',
                                                    height: '50px',
                                                    borderRadius: '12px',
                                                    objectFit: 'cover',
                                                    border: '2px solid #f0f0f0'
                                                }}
                                            />
                                            {/* Status indicator dot */}
                                            <div className={`lead-status-indicator lead-status-${leadsItems.lead_status === 0 ? 'pending' : 
                                                                                           leadsItems.lead_status === 1 ? 'review' : 
                                                                                           leadsItems.lead_status === 2 ? 'processing' : 
                                                                                           leadsItems.lead_status === 3 ? 'completed' : 'rejected'}`} />
                                        </div>
                                        
                                        {/* Lead Information */}
                                        <div className="user-info-leads">
                                            {/* Header with title and status */}
                                            <div style={{ 
                                                display: 'flex', 
                                                justifyContent: 'space-between', 
                                                alignItems: 'flex-start', 
                                                gap: '12px'
                                            }}>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div className="lead-item-title">
                                                        {leadsItems.lead_name}
                                                    </div>
                                                </div>
                                                <div style={{ flexShrink: 0 }}>
                                                    <StatusBadge status={leadsItems.lead_status} />
                                                </div>
                                            </div>
                                            
                                            {/* Description */}
                                            <div className="lead-item-description-box">
                                                <p className="lead-item-description">
                                                    {leadsItems.lead_description || "No description available"}
                                                </p>
                                            </div>
                                            
                                            {/* Footer with date and member info */}
                                            <div className="lead-item-meta">
                                                <div className="lead-item-date">
                                                    <FontAwesomeIcon 
                                                        icon={faCalendar} 
                                                        style={{ fontSize: '11px', color: '#999' }}
                                                    />
                                                    <span>
                                                        {new Date(leadsItems.created_at).toLocaleDateString("en-US", {
                                                            month: "short",
                                                            day: "numeric",
                                                            year: "numeric"
                                                        })}
                                                    </span>
                                                </div>
                                                
                                                <div className="lead-item-vendor">
                                                    <FontAwesomeIcon 
                                                        icon={faExchangeAlt} 
                                                        style={{ fontSize: '10px' }}
                                                    />
                                                    <span>{leadsItems.member_name || 'Member'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                            )}
                        </div>

                    </DashboardBox>

                </div>

                <div style={{
                  width: '35%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '2px'
                }}>

                    {/* Lead Status */}
                    <div style={{
                    width: '100%',
                    height: '30%',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '2px'
                    }}>
                         <DashboardBox>
                            <div style={{display: 'flex',flexDirection:'column', justifyContent: 'start', padding: '10px',height:'100%',width:'100%',boxSizing:'border-box'}}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', padding: '0px', margin: '0px',height:'50px'}}>
                                <p className="title-text-dark" style={{fontSize: '16px', fontWeight: '600', color: '#333'}}>{"Lead Status"}</p>
                                    <div style={{height:'50px',width:'130px'}}>
                                        {!(selectedStatus === 3 || selectedStatus === 4) && (
                                            <Dropdown
                                                data={statusArray}
                                                selectedItem={selectedStatus}
                                                onChange={handleStatusChange}
                                                firstItem="Select Status"
                                            />
                                        )}
                                    </div>
                                </div>
                                    <div style={{justifyContent: 'center',boxSizing:'border-box'}}>
                                        <div style={{display:'flex',flexDirection:'row',alignItems: 'center',marginTop:'20px'}}>
                                            {/* <DotBadge status={3} /> */}
                                            {/* Step 1: Pending */}
                                            <div style={{width:'150px',display:'flex',flexDirection:'row'}}>
                                                <div style={{display:'flex',flexDirection:'column',width:'100%',alignItems: 'flex-start'}}>
                                                    
                                                    <div style={{
                                                        display: 'flex',
                                                        position: 'relative',
                                                        alignItems: 'center',
                                                        width:'100%'
                                                    }}>
                                                        <div style={{
                                                            position: 'absolute',
                                                            width: '20px',
                                                            height: '20px',
                                                            borderRadius: '50%',
                                                            backgroundColor: selectedStatus >= 0 ? '#4CAF50' : '#e0e0e0',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            border: '2px solid white',
                                                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                            transition: 'all 0.3s ease'
                                                        }}>
                                                            {selectedStatus >= 0 && (
                                                                <div style={{
                                                                    width: '8px',
                                                                    height: '8px',
                                                                    borderRadius: '50%',
                                                                    backgroundColor: 'white'
                                                                }} />
                                                            )}
                                                        </div>
                                                        <hr style={{background: selectedStatus === 1 || selectedStatus === 2 || selectedStatus === 3 || selectedStatus === 4 ? '#4CAF50' : '#e0e0e0',width:'100%',padding:'0px',margin:'0px'}}/>
                                                    </div>

                                                    <div style={{
                                                            marginTop: '15px',
                                                            fontSize: '12px',
                                                            fontWeight: '500',
                                                            color: selectedStatus >= 0 ? '#4CAF50' : '#999',
                                                            textAlign: 'center',
                                                            transition: 'color 0.3s ease'
                                                        }}>
                                                            Pending
                                                        </div>
                                                
                                                </div>
                                                
                                            </div>


                                            {/* <DotBadge status={3} /> */}
                                            {/* Step 2: Review */}
                                            <div style={{width:'150px',display:'flex',flexDirection:'row'}}>
                                                <div style={{display:'flex',flexDirection:'column',width:'100%',alignItems: 'flex-start'}}>
                                                    
                                                    <div style={{
                                                        display: 'flex',
                                                        position: 'relative',
                                                        alignItems: 'center',
                                                        width:'100%'
                                                    }}>
                                                        <div style={{
                                                            position: 'absolute',
                                                            width: '20px',
                                                            height: '20px',
                                                            borderRadius: '50%',
                                                            backgroundColor: selectedStatus >= 1 ? '#4CAF50' : '#e0e0e0',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            border: '2px solid white',
                                                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                            transition: 'all 0.3s ease'
                                                        }}>
                                                            {selectedStatus >= 1 && (
                                                                <div style={{
                                                                    width: '8px',
                                                                    height: '8px',
                                                                    borderRadius: '50%',
                                                                    backgroundColor: 'white'
                                                                }} />
                                                            )}
                                                        </div>
                                                        <hr style={{background: selectedStatus === 2 || selectedStatus === 3 || selectedStatus === 4 ? '#4CAF50' : '#e0e0e0',width:'100%',padding:'0px',margin:'0px'}}/>
                                                    </div>

                                                    <div style={{
                                                            marginTop: '15px',
                                                            fontSize: '12px',
                                                            fontWeight: '500',
                                                            color: selectedStatus >= 1 ? '#4CAF50' : '#999',
                                                            textAlign: 'center',
                                                            transition: 'color 0.3s ease'
                                                    }}>
                                                        Review
                                                    </div>
                                                
                                                </div>
                                                
                                            </div>

                                            
                                            {/* <DotBadge status={3} /> */}
                                            {/* Step 2: Processing */}
                                            <div style={{width:'150px',display:'flex',flexDirection:'row'}}>
                                                <div style={{display:'flex',flexDirection:'column',width:'100%',alignItems: 'flex-start'}}>
                                                    
                                                    <div style={{
                                                        display: 'flex',
                                                        position: 'relative',
                                                        alignItems: 'center',
                                                        width:'100%'
                                                    }}>
                                                        <div style={{
                                                            position: 'absolute',
                                                            width: '20px',
                                                            height: '20px',
                                                            borderRadius: '50%',
                                                            backgroundColor: selectedStatus >= 2 ? '#4CAF50' : '#e0e0e0',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            border: '2px solid white',
                                                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                            transition: 'all 0.3s ease'
                                                        }}>
                                                            {selectedStatus >= 2 && (
                                                                <div style={{
                                                                    width: '8px',
                                                                    height: '8px',
                                                                    borderRadius: '50%',
                                                                    backgroundColor: 'white'
                                                                }} />
                                                            )}
                                                        </div>
                                                        <hr style={{
                                                            backgroundColor: selectedStatus >= 3 ? (selectedStatus === 3 ? '#4CAF50' : '#f44336') : '#e0e0e0',
                                                            //background: selectedStatus === 3 || selectedStatus === 4 ? '#4CAF50' : '#e0e0e0',
                                                            width:'100%',padding:'0px',margin:'0px'}}/>
                                                    </div>

                                                    <div style={{
                                                            marginTop: '15px',
                                                            fontSize: '12px',
                                                            fontWeight: '500',
                                                            color: selectedStatus >= 2 ? '#4CAF50' : '#999',
                                                            textAlign: 'center',
                                                            transition: 'color 0.3s ease'
                                                        }}>
                                                            Processing
                                                        </div>
                                                
                                                </div>
                                                
                                            </div>


                                            {/* <DotBadge status={3} /> */}
                                            {/* Step 2: Final */}
                                            <div style={{width:'60px',display:'flex',flexDirection:'row'}}>
                                                <div style={{display:'flex',flexDirection:'column',width:'100%',alignItems: 'flex-start'}}>
                                                    
                                                    <div style={{
                                                        display: 'flex',
                                                        position: 'relative',
                                                        alignItems: 'center',
                                                        width:'100%'
                                                    }}>
                                                        <div style={{
                                                            position: 'absolute',
                                                            width: '20px',
                                                            height: '20px',
                                                            borderRadius: '50%',
                                                            backgroundColor: selectedStatus >= 3 ? (selectedStatus === 3 ? '#4CAF50' : '#f44336') : '#e0e0e0',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            border: '2px solid white',
                                                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                            transition: 'all 0.3s ease'
                                                        }}>
                                                            {selectedStatus >= 3 && (
                                                                <div style={{
                                                                    width: '8px',
                                                                    height: '8px',
                                                                    borderRadius: '50%',
                                                                    backgroundColor: 'white'
                                                                }} />
                                                            )}
                                                        </div>
                                                        {/* <hr style={{background: selectedStatus === 3 || selectedStatus === 4 ? 'green' : 'gray',width:'100%',padding:'0px',margin:'0px'}}/> */}
                                                    </div>

                                                    <div style={{
                                                            marginTop: '15px',
                                                            fontSize: '12px',
                                                            fontWeight: '500',
                                                            color: selectedStatus >= 3 ? (selectedStatus === 3 ? '#4CAF50' : '#f44336') : '#999',
                                                            textAlign: 'center',
                                                            transition: 'color 0.3s ease'
                                                        }}>
                                                            {selectedStatus === 4 ? "Rejected" : "Done"}
                                                        </div>
                                                
                                                </div>
                                                
                                            </div>

                                            

                                            {/* <div style={{width:'80px',display:'flex',flexDirection:'column'}}>
                                                <TextView type="subDark" text={selectedStatus === 4 ? "Rejected" : "Done"}/>
                                                <div style={{display:'flex',flexDirection:'row',height:'10px'}}>
                                                    <DotBadge status={selectedStatus === 3 || selectedStatus === 4 ? 3 : 6} />
                                                    
                                                </div>
                                            </div> */}

                                        </div>
                                    </div>

                                    {/* Status Description */}
                                    <div style={{
                                        marginTop: '15px',
                                        padding: '10px 15px',
                                        backgroundColor: selectedStatus === 4 ? '#ffebee' : '#f1f8e9',
                                        borderRadius: '8px',
                                        border: `1px solid ${selectedStatus === 4 ? '#ffcdd2' : '#c8e6c9'}`,
                                        transition: 'all 0.3s ease'
                                    }}>
                                        <div style={{
                                            fontSize: '13px',
                                            fontWeight: '500',
                                            color: selectedStatus === 4 ? '#d32f2f' : '#2e7d32',
                                            textAlign: 'center'
                                        }}>
                                            {selectedStatus === 0 && "Your lead is pending review"}
                                            {selectedStatus === 1 && "Your lead is under review"}
                                            {selectedStatus === 2 && "Your lead is being processed"}
                                            {selectedStatus === 3 && "Your lead has been completed"}
                                            {selectedStatus === 4 && "Your lead has been rejected"}
                                        </div>
                                    </div>
                                    
                                </div>
                            </DashboardBox>
                    </div>
                    
                    {/* Leads detalil view */}
                    <div style={{
                        width: '100%',
                        height: '70%',
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '2px'
                        }}>
                        <DashboardBox>
                            <div style={{
                                padding: '20px',
                                paddingBottom: '0px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '10px'
                            }}>
                                {/* Header Section */}
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    borderBottom: '2px solid #f0f0f0',
                                    paddingBottom: '15px'
                                }}>
                                    <div style={{ flex: 1 }}>
                                                                                <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            marginBottom: '8px'
                                        }}>
                                            <img 
                                                className="user-avatar" 
                                                src={selectedLead?.member_image ? baseUrl + selectedLead.member_image : "/public/dummy.jpg"} 
                                                alt={selectedLead?.member_name || 'Member'}
                                                style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    borderRadius: '12px',
                                                    objectFit: 'cover',
                                                    border: '2px solid #f0f0f0'
                                                }}
                                            />
                                            <div>
                                                <TextView 
                                                    type="darkBold" 
                                                    text={selectedLead?.lead_name ?? "Lead Title"} 
                                                    style={{ fontSize: '18px', marginBottom: '4px' }}
                                                />
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '8px'
                                                }}>
                                                    <div style={{
                                                        width: '8px',
                                                        height: '8px',
                                                        borderRadius: '50%',
                                                        backgroundColor: selectedLead?.lead_status === 3 ? '#4caf50' : 
                                                                       selectedLead?.lead_status === 4 ? '#f44336' : '#ff9800'
                                                    }} />
                                                    <span style={{
                                                        fontSize: '12px',
                                                        color: '#666',
                                                        fontWeight: '500'
                                                    }}>
                                                        {selectedLead?.lead_status === 0 ? 'Pending' :
                                                         selectedLead?.lead_status === 1 ? 'Under Review' :
                                                         selectedLead?.lead_status === 2 ? 'Processing' :
                                                         selectedLead?.lead_status === 3 ? 'Completed' : 'Rejected'}
                                                    </span>
                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'flex-end',
                                        gap: '8px'
                                    }}>
                                        <div style={{
                                            padding: '6px 12px',
                                            backgroundColor: '#f5f5f5',
                                            borderRadius: '20px',
                                            fontSize: '11px',
                                            color: '#666',
                                            fontWeight: '500'
                                        }}>
                                            Lead ID: #{selectedLead?.id ?? 'N/A'}
                                        </div>
                                                                                <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            fontSize: '12px',
                                            color: '#666',
                                            fontWeight: '500'
                                        }}>
                                            <FontAwesomeIcon 
                                                icon={faCalendar} 
                                                style={{ color: '#999', fontSize: '12px' }}
                                            />
                                            <span>
                                                {new Date(selectedLead?.created_at ?? new Date()).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                })} • {new Date(selectedLead?.created_at ?? new Date()).toLocaleTimeString("en-US", {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    hour12: true
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Description Section */}
                                <div style={{
                                    backgroundColor: '#fafafa',
                                    borderRadius: '12px',
                                    padding: '16px',
                                    border: '1px solid #e0e0e0'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        marginBottom: '12px'
                                    }}>
                                        <FontAwesomeIcon 
                                            icon={faLocationDot} 
                                            style={{ color: '#666', fontSize: '14px' }}
                                        />
                                        <span style={{
                                            fontSize: '14px',
                                            fontWeight: '600',
                                            color: '#333'
                                        }}>
                                            Lead Description
                                        </span>
                                    </div>
                                    <p style={{
                                        fontSize: '14px',
                                        lineHeight: '1.6',
                                        color: '#555',
                                        margin: '0',
                                        padding: '0'
                                    }}>
                                        {selectedLead?.lead_description ?? "No description available for this lead."}
                                    </p>
                                </div>

                                {/* Key Information Grid */}
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: '16px'
                                }}>
                                    {/* Member Information */}
                                    <div style={{
                                        backgroundColor: '#fff',
                                        borderRadius: '10px',
                                        padding: '16px',
                                        border: '1px solid #e8e8e8',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            marginBottom: '12px'
                                        }}>
                                            <div style={{
                                                width: '24px',
                                                height: '24px',
                                                borderRadius: '50%',
                                                backgroundColor: '#e8f5e8',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <FontAwesomeIcon 
                                                    icon={faExchangeAlt} 
                                                    style={{ color: '#4caf50', fontSize: '12px' }}
                                                />
                                            </div>
                                            <span style={{
                                                fontSize: '13px',
                                                fontWeight: '600',
                                                color: '#333'
                                            }}>
                                                Member Details
                                            </span>
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#666', lineHeight: '1.5' }}>
                                            <div style={{ marginBottom: '6px' }}>
                                                <strong>Name:</strong> {selectedLead?.member_name ?? 'N/A'}
                                            </div>
                                            <div style={{ marginBottom: '6px' }}>
                                                <strong>Email:</strong> {selectedLead?.member_email ?? 'N/A'}
                                            </div>
                                            <div>
                                                <strong>Contact:</strong> {selectedLead?.member_phone ?? 'N/A'}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Lead Statistics */}
                                    <div style={{
                                        backgroundColor: '#fff',
                                        borderRadius: '10px',
                                        padding: '16px',
                                        border: '1px solid #e8e8e8',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            marginBottom: '12px'
                                        }}>
                                            <div style={{
                                                width: '24px',
                                                height: '24px',
                                                borderRadius: '50%',
                                                backgroundColor: '#fff3e0',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <FontAwesomeIcon 
                                                    icon={faPaperPlane} 
                                                    style={{ color: '#ff9800', fontSize: '12px' }}
                                                />
                                            </div>
                                            <span style={{
                                                fontSize: '13px',
                                                fontWeight: '600',
                                                color: '#333'
                                            }}>
                                                Lead Info
                                            </span>
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#666', lineHeight: '1.5' }}>
                                            <div style={{ marginBottom: '6px' }}>
                                                <strong>Category:</strong> Business Lead
                                            </div>
                                            <div style={{ marginBottom: '6px' }}>
                                                <strong>Priority:</strong> 
                                                <span style={{
                                                    padding: '2px 8px',
                                                    borderRadius: '10px',
                                                    fontSize: '10px',
                                                    fontWeight: '500',
                                                    backgroundColor: '#e3f2fd',
                                                    color: '#1976d2',
                                                    marginLeft: '6px'
                                                }}>
                                                    Medium
                                                </span>
                                            </div>
                                            <div>
                                                <strong>Messages:</strong> {messages.length} exchanged
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div style={{
                                    display: 'flex',
                                    gap: '12px',
                                    marginTop: '20px',
                                    paddingTop: '0px',
                                }}>
                                    <button style={{
                                        flex: 1,
                                        padding: '12px 16px',
                                        backgroundColor: 'var(--highlight-color)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px',
                                        transition: 'all 0.3s ease',
                                        marginTop: '0px'
                                    }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#e6c200'}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--highlight-color)'}
                                    >
                                        <FontAwesomeIcon icon={faPhone} style={{ fontSize: '14px' }} />
                                        Contact Member
                                    </button>
                                    <button style={{
                                        flex: 1,
                                        padding: '12px 16px',
                                        backgroundColor: '#fff',
                                        color: '#666',
                                        border: '1px solid #ddd',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px',
                                        transition: 'all 0.3s ease',
                                        marginTop: '0px'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.backgroundColor = '#f5f5f5';
                                        e.target.style.borderColor = '#ccc';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.backgroundColor = '#fff';
                                        e.target.style.borderColor = '#ddd';
                                    }}
                                    >
                                        <FontAwesomeIcon icon={faLocationDot} style={{ fontSize: '14px' }} />
                                        Location
                                    </button>
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
                  padding: '2px'
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
                                minHeight: '480px'
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
                                            Chat with Member
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
                                            {selectedLead?.member_name || 'Member'}
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
                                                    Send your first message to begin chatting with the member
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
                                                    handlePhoneClick();
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
                                            onClick={handlePhoneClick}
                                            disabled={!formData.message.trim() || sendingMessage}
                                        />
                                    </div>      
                                    
                                </div>
                            </div>
                        </DashboardBox>
                    </div>
                </div>


        </div>

        
        <RightSidePopup isloading={false} isOpen={showPopup} onClose={() => setShowPopup(false)} 
            onSubmit={() => {
            //setShowPopup(false);
            createLeads();
            } }
            >
            <TextView type="darkBold" text={"Create your Lead"}/>
            <div style={{marginTop:'20px'}}></div>

            <Dropdown
                data={members}
                selectedItem={selectedMember}
                onChange={handleMemberChange}
            />
            <InputText placeholder={"Lead Name"} name={"leadName"} onChange={handleChange}></InputText>
            <InputText placeholder={"Description"} name={"leadDescription"} onChange={handleChange}></InputText>

            <FileAttachButton onChange={handleFileChange} text={` Document ${fileUploadStatus}`} accept=".pdf,.jpg,.PNG" />
        </RightSidePopup>

        {showPointsPopup && (
            <PointPopup
            onClose={() => setShowPointsPopup(false)}
            onSubmit={handlePopupSubmit}
            userType="vendor"
            />
        )}

    </div>
  )
}

export default LeadsVendor
