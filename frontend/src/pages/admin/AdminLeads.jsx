import React, {useState,useEffect} from 'react'
import DashboardBox from '../../componants/Main/DashboardBox'
import apiClient from '../../utils/ApiClient';

import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons'
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

import InputText from '../../componants/Main/InputText';
import RoundButton from '../../componants/Main/RoundButton';
import DotBadge from '../../componants/Main/DotBadge';
import TextView from '../../componants/Main/TextView';
import DateWithIcon from '../../componants/Main/DateWithIcon';
import StatusBadge from '../../componants/Main/StatusBadge';
import Dropdown from '../../componants/Main/Dropdown';
import PointPopup from '../../componants/Main/PointPopup';
const baseUrl = import.meta.env.VITE_API_BASE_IMG_URL;

function AdminLeads() {
  const [loading, setLoading] = useState(true);
    const [selectedPos, setselectedPos] = useState(0);
    const [selectedLead, setSelectedLead] = useState(null);
    const [leads, setLeads] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState(1);
     const [showPopup, setShowPopup] = useState(false);
    const [formData, setFormData] = useState({
                search: "",
                message: ""
        });

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

    useEffect(() => {
        fetchLeads();
    },[]);


    ///API CALLING
    const fetchLeads = async () => {
        setLoading(true);
        try {
        const response = await apiClient.get("/admin/get_leads");
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

    const updateLeadStatus = async (id,status) => {
        //setLoading(true);
        try {
        const payload = {
        id: id,
        lead_status: status,
        };

        const response = await apiClient.post("/admin/lead_status_update",payload);

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
                transaction_type: 1,
                transaction_point: point,
                transaction_title: selectedLead.lead_name,
                member_id: selectedLead.user_id
            };
            //console.log("SANTHOSH Vendor ID:", payload);
            const data = await apiClient.post("/admin/add_transaction", payload);

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
        console.log('Phone button clicked!');
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
        ...prev,
        [name]: value,
        }));
    };

    const handleLeadListClick = (index) => {
        setselectedPos(index)
        console.log("Clicked index:", index);
        console.log("Clicked Sttaus:", leads[index].lead_status);
        setSelectedLead(leads[index])
        setSelectedStatus(leads[index].lead_status);
    };

    const handleStatusChange = (e) => {
       // setSelectedStatus(e.target.value);
        console.log("Selected Status ID:", e.target.value);
        console.log("Selected LEAD ID:", selectedLead.id);
        if (e.target.value == 3)
        {
             console.log("Selected Status okaaaay:", e.target.value);
            setShowPopup(true);
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
                                paddingRight:'10px'
                                }}> 

                                   <InputText 
                                        type="name"
                                        placeholder="Search"
                                        name="search"
                                        value={formData.search}
                                        onChange={handleChange}
                                    />

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
                                        <img className="user-avatar" src={leadsItems.member_image ? baseUrl+leadsItems.member_image : "/public/dummy.jpg"} alt={leadsItems.lead_name} />
                                        <div className="user-info-leads">
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0px', margin: '0px'}}>
                                                <p className="title-text-dark  truncate-text">{leadsItems.lead_name}</p>
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
                                <img className="user-avatar" src={selectedLead?.member_image ? baseUrl+selectedLead.member_image : "/dummy.jpg"} alt={"selectedLead.lead_name"} /> 
                                
                                <div className="user-info">
                                    <p className="title-text-dark">{selectedLead?.member_name ?? "No member name"}</p>
                                    <p className="sub-title-text-dark">{selectedLead?.member_email ?? "No member email"}</p>

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
                    height: '250px',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '2px'
                    }}>
                         <DashboardBox>
                            <div style={{display: 'flex',flexDirection:'column', justifyContent: 'start', padding: '10px',height:'100%',width:'100%',boxSizing:'border-box'}}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', padding: '0px', margin: '0px',height:'50px'}}>
                                    <p className="title-text-dark">{"Status"}</p>
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
                                <div style={{justifyContent: 'center',height:'100%',boxSizing:'border-box'}}>
                                    <div style={{display:'flex',flexDirection:'row',alignItems: 'center',marginTop:'20px'}}>
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

                    <div style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '2px'
                    }}>
                        <DashboardBox>
                            <div style={{boxSizing:'border-box',display: 'flex',height:'100%',flexDirection:'column', justifyContent: 'start', padding: '10px'}}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0px', margin: '0px',height:'30px'}}>
                                    <p className="title-text-dark">{"Chatbot"}</p>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',height:'100%'}}>
                                    {/* <p className="title-text-dark-bold">{"Status"}</p> */}
                                </div>

                                <div style={{
                                    width: '100%',
                                    height: '40px',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    padding: '0px',
                                    borderBlock:'boxSizing'}}>

                                        <div style={{width: '100%',
                                        height: '40px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent:'center',
                                        justifyItems: 'center',
                                        }}> 

                                        <InputText 
                                                type="name"
                                                placeholder="Message"
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                            />

                                        </div>

                                        <div style={{
                                        width: '55px',
                                        height: '40px',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center'}}> 
                                            <RoundButton icon={faPaperPlane} onClick={handlePhoneClick} />
                                        </div>      
                                        
                                </div>
                            </div>
                        </DashboardBox>
                    </div>
                </div>


        </div>

        {showPopup && (
            <PointPopup
            onClose={() => setShowPopup(false)}
            onSubmit={handlePopupSubmit}
            userType="admin"
            />
        )}

    </div>
  )
}

export default AdminLeads
