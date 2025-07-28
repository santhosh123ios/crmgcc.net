import React, {useState,useEffect} from 'react'
import DashboardBox from '../../componants/Main/DashboardBox'
import InputText from '../../componants/Main/InputText'
import RoundButton from '../../componants/Main/RoundButton';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import StatusBadge from '../../componants/Main/StatusBadge';
import DateWithIcon from '../../componants/Main/DateWithIcon';

import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons'
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
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

const baseUrl = import.meta.env.VITE_API_BASE_IMG_URL;


function LeadsMember() {

    const [selectedPos, setselectedPos] = useState(0);
    const [selectedLead, setSelectedLead] = useState(null);
    const [leads, setLeads] = useState([]);
    const [file, setFile] = useState(null);
    const [fileName, setfileName] = useState("");
    const [fileUploadStatus, setfileUploadStatus] = useState("");
    const [isLoading, setisLoading] = useState(false);
    const [vendors, setVendors] = useState([]);
    const [selectedVendor, setSelectedVendor] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [loading, setLoading] = useState(true);
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const [selectedStatus, setSelectedStatus] = useState(1);
    const [formData, setFormData] = useState({
            search: "",
            message: "",

            leadId: "",
            leadName: "",
            leadDescription: "",
            vendorId: 0,
            leadFile: ""
    });
    const [messages, setMessages] = useState([]);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [sendingMessage, setSendingMessage] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);


    const handleLeadListClick = (index) => {
        setselectedPos(index)
        console.log("Clicked index:", index);
        setSelectedLead(leads[index])
        setSelectedStatus(leads[index].lead_status);
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
            const response = await apiClient.post("/member/upload", formDataFile);
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

    
    //const [selectedVendorId, setSelectedVendorId] = useState(0);
    const handleVendorChange = (e) => {
        setSelectedVendor(e.target.value);
        
        console.log("Selected Vendor ID:", e.target.value);
    };

    const fetchLeads = async () => {
        setLoading(true);
        try {
        const response = await apiClient.get("/member/getleads");

        if (response?.result?.status === 1) {
            setLeads(response.result.data);
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
            const response = await apiClient.post(`/member/get_lead_message`, payload);
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
            
            const response = await apiClient.post("/member/create_lead_message", payload);
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

    }


    const createLeads = async () => {

        setisLoading(true); // Show loader
        try {

            const payload = {
            vendor_id: formData.vendorId,
            lead_name: formData.leadName,
            lead_description: formData.leadDescription,
            lead_file: formData.leadFile // optional: just a filename string
            };
            console.log("SANTHOSH Vendor ID:", payload);
            const data = await apiClient.post("/member/create-leads", payload);

            //if (data && data.result?.data.status === 1) {
            if (data?.result?.status === 1) {
                setVendors(data.result.data);
                setShowPopup(false)
                fetchLeads();
            }
        } catch (err) {
            console.error("Something went wrong fetching vendors", err);
        }
        finally {
            setisLoading(false); // Hide loader
        }
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
        ...prev,
        [name]: value,
        vendorId:selectedVendor
        }));
    };
  
    ///API CALLS GET ALL VENDORS LIST
    useEffect(() => {

        fetchLeads();

        setFormData((prev) => ({
        ...prev,
        vendorId:selectedVendor,
        leadFile:fileName
        }));

        const loadVendors = async () => {

            try {

                const data = await apiClient.get("/member/vendorlist");
                
            // const data = await fetchwithAuth("/member/vendorlist", {
            //     method: "GET"
            // });

            if (data && data.result?.data) {
                setVendors(data.result.data);
            }
            } catch (err) {
            console.error("Something went wrong fetching vendors", err);
            }
        };

        loadVendors();
    },[selectedVendor,fileName]);

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

    const handlePhoneClick = () => {
        if (formData.message.trim() && selectedLead?.id && currentUserId) {
            sendMessage(formData.message, selectedLead.id);
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


                        <div className="user-list-scroll-container">
                            {loading ? (
                            <div className="loader-container">
                                <div className="spinner" />
                            </div>
                            ) : (
                            leads.map((leadsItems, index) => (
                                <div className="user-list-item-leads" key={index}>
                                <DashboardBox>
                                    <div className={`${selectedPos === index ? "user-list-item-leads-inside-select" : "user-list-item-leads-inside"}`} onClick={() => handleLeadListClick(index)}>
                                        <img className="user-avatar" src={leadsItems.vendor_image ? baseUrl+leadsItems.vendor_image : "/public/dummy.jpg"} alt={leadsItems.lead_name} />
                                        <div className="user-info-leads">
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0px', margin: '0px'}}>
                                                
                                                <TextView  type="darkBold" text={leadsItems.lead_name}/>
                                                <div className="text-with-dot">
                                                    <StatusBadge status={leadsItems.lead_status} />
                                                </div>
                                                {/* <TextButton text={"View All"} /> */}
                                                
                                            </div>
                                            
                                            <p className="sub-title-text-dark truncate-text">{leadsItems.lead_description}</p>
                                            <DateWithIcon text={new Date(leadsItems.created_at).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                                })} >
                                            </DateWithIcon>
                                        </div>
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
                    {/* Brand detalil view */}
                    <div style={{
                        width: '100%',
                        height: '100px',
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '2px'
                        }}>
                        <DashboardBox>
                            <div className='user-list-item-inside'>
                                <img className="user-avatar" src={selectedLead?.vendor_image ? baseUrl+selectedLead.vendor_image : "/dummy.jpg"} alt={"selectedLead.lead_name"} /> 
                                
                                <div className="user-info">
                                    <TextView  type="darkBold" text={selectedLead?.vendor_name ?? "No vendor name"}/>
                                    <p className="sub-title-text-dark">{selectedLead?.vendor_email ?? "No vendor email"}</p>

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
                        </DashboardBox>
                    </div>
                    {/* Leads detalil view */}
                    <div style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '2px'
                        }}>
                        <DashboardBox>
                            <div className="user-info-leads-full">
                                <div style={{width:'100%',height:'100%'}}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0px', margin: '0px'}}>
                                    <p className="title-text-dark-bold">{selectedLead?.lead_name ?? "No lead name"}</p>
                                    
                                    </div>
                                    <div style={{marginTop:'5PX'}}></div>
                                    <p className="sub-title-text-dark">{selectedLead?.lead_description ?? "No lead description"}</p>
                                </div>
                                <div >
                                    <div style={{marginTop:'5PX'}}></div>
                                    <DateWithIcon text={new Date(selectedLead?.created_at ?? "No lead description").toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                    })} >
                                    </DateWithIcon>
                                </div>
                            </div>
                        </DashboardBox>
                    </div>
                </div>

                <div style={{
                  width: '40%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '2px'
                }}>

                    <div style={{
                    width: '100%',
                    height: '150px',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '2px'
                    }}>
                         <DashboardBox>
                            <div style={{display: 'flex',flexDirection:'column', justifyContent: 'start', padding: '10px',height:'100%',width:'100%',boxSizing:'border-box'}}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', padding: '0px', margin: '0px',height:'50px'}}>
                                    <p className="title-text-dark">{"Status"}</p>
                                    <div style={{height:'50px',width:'130px'}}>
                                        
                                    </div>
                                </div>
                                <div style={{justifyContent: 'center',height:'100%',boxSizing:'border-box'}}>
                                    <div style={{display:'flex',flexDirection:'row',alignItems: 'center',marginTop:'40px'}}>
                                        <div style={{width:'150px',display:'flex',flexDirection:'column'}}>
                                        <TextView type="subDark" text={"Pending"}/>
                                            <div style={{display:'flex',flexDirection:'row',height:'10px'}}>
                                                <DotBadge status={3} />
                                                <hr style={{background: selectedStatus === 1 || selectedStatus === 2 || selectedStatus === 3 || selectedStatus === 4 ? 'green' : 'gray'}}/>
                                            </div>
                                        </div>

                                        <div style={{width:'150px',display:'flex',flexDirection:'column'}}>
                                            <TextView type="subDark" text={"Review"}/>
                                            <div style={{display:'flex',flexDirection:'row',height:'10px'}}>
                                                <DotBadge status={selectedStatus === 1 || selectedStatus === 2 || selectedStatus === 3 || selectedStatus === 4 ? 3 : 6} />
                                                <hr style={{background: selectedStatus === 2 || selectedStatus === 3 || selectedStatus === 4 ? 'green' : 'gray'}}/>
                                            </div>
                                        </div>

                                        <div style={{width:'200px',display:'flex',flexDirection:'column'}}>
                                            <TextView type="subDark" text={"Processing"}/>
                                            <div style={{display:'flex',flexDirection:'row',height:'10px'}}>
                                                <DotBadge status={selectedStatus === 2 || selectedStatus === 3 || selectedStatus === 4 ? 3 : 6} />
                                                <hr style={{background: selectedStatus === 3 || selectedStatus === 4 ? 'green' : 'gray'}}/>
                                            </div>
                                        </div>

                                        <div style={{width:'80px',display:'flex',flexDirection:'column'}}>
                                            <TextView type="subDark" text={selectedStatus === 4 ? "Rejected" : "Done"}/>
                                            <div style={{display:'flex',flexDirection:'row',height:'10px'}}>
                                                <DotBadge status={selectedStatus === 3 || selectedStatus === 4 ? 3 : 6} />
                                                
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                
                            </div>
                         </DashboardBox>
                    </div>

                    {/* Messages Container */}
                    <div style={{
                    width: '100%',
                    height: 'calc(100vh - 272px)',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '2px'
                    }}>
                        <DashboardBox>
                            <div style={{boxSizing:'border-box',display: 'flex',height:'100%',flexDirection:'column', justifyContent: 'start', padding: '10px', minHeight: '400px'}}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0px', margin: '0px',height:'30px'}}>
                                    <p className="title-text-dark">
                                        {selectedLead?.vendor_name ? `Chat with ${selectedLead.vendor_name}` : "Chat with Lead"}
                                    </p>
                                </div>

                                
                                <div 
                                    className="messages-container"
                                    style={{
                                        flex: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        overflowY: 'auto',
                                        padding: '10px',
                                        gap: '10px',
                                        maxHeight: 'calc(100vh - 300px)',
                                        minHeight: '200px'
                                    }}
                                >
                                    {loadingMessages ? (
                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
                                            <div className="spinner" />
                                        </div>
                                    ) : messages.length === 0 ? (
                                        <div style={{ 
                                            display: 'flex', 
                                            justifyContent: 'center', 
                                            alignItems: 'center', 
                                            height: '100px',
                                            color: '#666',
                                            fontSize: '14px'
                                        }}>
                                            No messages yet. Start a conversation!
                                        </div>
                                    ) : (
                                        messages.map((message, index) => {
                                            const isSentByMe = message.sender === currentUserId;
                                            return (
                                                <div key={message.id || index} style={{
                                                    display: 'flex',
                                                    justifyContent: isSentByMe ? 'flex-end' : 'flex-start',
                                                    marginBottom: '8px'
                                                }}>
                                                    <div style={{
                                                        maxWidth: '70%',
                                                        padding: '10px 15px',
                                                        borderRadius: '18px',
                                                        backgroundColor: isSentByMe ? '#0084ff' : '#f0f0f0',
                                                        color: isSentByMe ? 'white' : 'black',
                                                        wordWrap: 'break-word',
                                                        wordBreak: 'break-word',
                                                        fontSize: '14px',
                                                        lineHeight: '1.4',
                                                        overflowWrap: 'break-word'
                                                    }}>
                                                        {message.text}
                                                        <div style={{
                                                            fontSize: '11px',
                                                            opacity: 0.7,
                                                            marginTop: '4px',
                                                            textAlign: isSentByMe ? 'right' : 'left'
                                                        }}>
                                                            {new Date(message.create_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>

                                {/* Input Section */}
                                <div style={{
                                    width: '100%',
                                    height: '40px',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    borderTop: '1px solid #e0e0e0',
                                    paddingTop: '10px'
                                }}>

                                    <div style={{
                                        flex: 1,
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
                data={vendors}
                selectedItem={selectedVendor}
                onChange={handleVendorChange}
            />
            <InputText placeholder={"Lead Name"} name={"leadName"} onChange={handleChange}></InputText>
            <InputText placeholder={"Description"} name={"leadDescription"} onChange={handleChange}></InputText>

            <FileAttachButton onChange={handleFileChange} text={` Document ${fileUploadStatus}`} accept=".pdf,.jpg,.PNG" />
        </RightSidePopup>
       
    </div>
    
  )
}

export default LeadsMember
