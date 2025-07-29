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
        console.log("Clicked Sttaus:", complaints[index].lead_status);
        setSelectedComplaints(complaints[index])
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
                  width: '40%',
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
                            ) : (
                            complaints.map((compItems, index) => (
                              <div className="user-list-item-rdm" key={index}>
                                <DashboardBox>
                                      <div className="user-list-item-tr-inside" onClick={() => handleCompListClick(index)}>
                                        
                                            <div className="user-info-tr">
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <DateWithIcon text={new Date(compItems?.created_at).toLocaleDateString("en-US", {
                                                        year: "numeric",
                                                        month: "long",
                                                        day: "numeric",
                                                        })} >
                                                    </DateWithIcon>
                                                    <TextView type="subDark" text={new Date(compItems?.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}/>
                                                </div>
                                                <TextView type="subDarkBold" text={compItems?.subject}/>
                                                <TextView type="subDark" text={baseId+compItems?.id}/>
                                                 <StatusBadge status={compItems?.status==0 ? 0 : compItems?.status==1 ? 3 : 4 } />
                                               
                                            </div> 

                                            {selectedPosComp === index && (
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
                  width: '60%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '0px'
                  
                }}>
                    <div style={{
                        width: '100%',
                        height: '30%',
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '2px'
                        
                        }}>
                            <DashboardBox>
                                <div className="comp-item-inside">               
                                    <div style={{display: 'flex', flexDirection: 'column',height: '100%'}}>

                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <TextView type="subDarkBold" text={selectedComplaints?.subject}/>
                                            <StatusBadge status={selectedComplaints?.status==0 ? 0 : selectedComplaints?.status==1 ? 3 : 4 } />
                                        </div>

                                        <div style={{ display: 'flex', justifyContent: 'start', alignItems: 'start', flex:'1'}}>
                                            <TextView type="subDark" text={selectedComplaints?.message} />
                                        </div>

                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <DateWithIcon text={new Date(selectedComplaints?.created_at).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                    })} >
                                                </DateWithIcon>
                                                <TextView type="subDark" text={new Date(selectedComplaints?.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}/>
                                            </div>
                                            <TextView type="subDark" text={baseId+selectedComplaints?.id}/>
                                        </div>
                                    </div> 
                                </div>
                            </DashboardBox>

                    </div>

                    <div style={{
                        width: '100%',
                        height: '70%',
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '2px'
                        }}>
                            <DashboardBox>
                                <div className="comp-item-inside">               
                                    
                                    <div style={{display: 'flex', flexDirection: 'column',height: '100%'}}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0px', margin: '0px',height:'30px'}}>
                                            <p className="title-text-dark">
                                                {selectedComplaints?.vendor_name ? `Chat: ${selectedComplaints.vendor_name}` : "Chat with Vendor"}
                                            </p>
                                        </div>

                                        {/* Messages Container */}
                                        <div 
                                            className="messages-container"
                                            style={{
                                                flex: 1,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                overflowY: 'auto',
                                                padding: '10px 0px 0px 0px',
                                                gap: '10px',
                                                maxHeight: 'calc(100vh - 400px)',
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
                                                (() => {
                                                    const groupedMessages = groupMessagesByDate(messages);
                                                    console.log('Grouped messages:', groupedMessages);
                                                    return groupedMessages.map((group, groupIndex) => (
                                                        <div key={groupIndex}>
                                                            {/* Date Separator */}
                                                            <div style={{
                                                                display: 'flex',
                                                                justifyContent: 'center',
                                                                margin: groupIndex === 0 ? '10px 0 10px 0' : '20px 0 10px 0',
                                                                padding: '0 10px'
                                                            }}>
                                                                <div style={{
                                                                    backgroundColor: '#f0f0f0',
                                                                    padding: '6px 12px',
                                                                    borderRadius: '12px',
                                                                    fontSize: '12px',
                                                                    color: '#666',
                                                                    fontWeight: '500'
                                                                }}>
                                                                    {formatMessageDate(group.messages[0].create_at || group.messages[0].created_at || group.messages[0].date || group.messages[0].timestamp)}
                                                                </div>
                                                            </div>
                                                            
                                                            {/* Messages for this date */}
                                                            {group.messages.map((message, index) => {
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
                                                                                {formatMessageDate(message.create_at || message.created_at || message.date || message.timestamp)} • {new Date(message.create_at || message.created_at || message.date || message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
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
                                                    // disabled={!formData.message.trim() || sendingMessage}
                                                />
                                            </div>      
                                            
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
