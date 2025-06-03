import React,{useState,useEffect,useRef} from 'react'
import DashboardBox from '../../componants/Main/DashboardBox'
import apiClient from '../../utils/ApiClient';
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

     useEffect(() => {
        fetchComplaints();
        loadVendors();
      },[]);


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
                                                <DateWithIcon text={new Date(compItems?.created_at).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                    })} >
                                                </DateWithIcon>
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
                                            <DateWithIcon text={new Date(selectedComplaints?.created_at).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                                })} >
                                            </DateWithIcon>
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
