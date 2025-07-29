import React,{useState,useEffect} from 'react'
import DashboardBox from '../../componants/Main/DashboardBox'
import apiClient from '../../utils/ApiClient';
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

function ComplaintsAdmin() {
  const [loadingComp, setLoadingComp] = useState(true);
    const [complaints, setComplaints] = useState([]);
    const [selectedComplaints, setSelectedComplaints] = useState(null);
    const [selectedPosComp, setselectedPosComp] = useState(0);

    const [selectedStatus, setSelectedStatus] = useState(0);

    const [formData, setFormData] = useState({
            search: "",
            subject:"",
            message:""
      })

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
            name: "Done",
        },
        {
            id: 3,
            name: "Reject",
        },
    ];

     useEffect(() => {
        fetchComplaints();
      },[]);


    ///API CALLING
    const fetchComplaints = async () => {
        setLoadingComp(true);
        try {
        const response = await apiClient.get("/admin/get_complaints");
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

    const updateComplaintStatus = async (id,status) => {
        //setLoading(true);
        try {
        const payload = {
            id: id,
            status: status,
        };

        const response = await apiClient.post("/admin/complaints_status_update",payload);

            if (response?.result?.status === 1) {
                setSelectedStatus(status);
                //setShowPopup(false);
                
                // Update the selected complaint's status locally
                setSelectedComplaints(prev => prev ? { ...prev, status: parseInt(status) } : prev);
                
                // Update the complaints list locally without refetching
                setComplaints(prev => prev.map(complaint => 
                    complaint.id === id 
                        ? { ...complaint, status: parseInt(status) }
                        : complaint
                ));
            } else {
                console.warn("No records found or status");
            }
        } 
        catch (error) {
        console.error("Failed to update complaint status:", error);
        } finally {
        ///setLoading(false);
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

  const handleStatusChange = (e) => {
        setSelectedStatus(e.target.value);
        console.log("Selected Status ID:", e.target.value);
        console.log("Selected Complaint ID:", selectedComplaints.id);
        if (e.target.value !== "" && selectedComplaints?.id) {
            updateComplaintStatus(selectedComplaints.id, e.target.value);
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
                  padding: '5px'
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
                                                 <StatusBadge status={compItems?.status} />
                                               
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
                  padding: '2px'
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
                                            <div style={{height:'50px',width:'130px',marginTop:'10px'}}>
                                                {!(selectedComplaints?.status === 5) && (
                                                    <Dropdown
                                                        data={statusArray}
                                                        selectedItem={selectedComplaints?.status !== undefined && selectedComplaints?.status !== null ? parseInt(selectedComplaints.status) : ""}
                                                        onChange={handleStatusChange}
                                                        firstItem="Select Status"
                                                    />
                                                )}
                                            </div>
                                            {/* <StatusBadge status={selectedComplaints?.status==0 ? 0 : selectedComplaints?.status==1 ? 3 : 4 } /> */}
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
                                    
                                        <div style={{display: 'flex', flexDirection: 'column',height: '100%'}}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0px', margin: '0px',height:'50px'}}>
                                                <p className="title-text-dark">{"Message"}</p>
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
                                                        <RoundButton icon={faPaperPlane} />
                                                    </div>      
                                                    
                                            </div>
                                        </div>


                                    </div>
                                </div>
                            </DashboardBox>

                    </div>

                </div>
        </div>
    </div>
  )
}

export default ComplaintsAdmin
