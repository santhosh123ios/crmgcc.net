import React,{useState,useEffect} from 'react'
import DashboardBox from '../../componants/Main/DashboardBox'
import TitleView from '../../componants/Main/TitleView'
import TextView from '../../componants/Main/TextView'
import InputText from '../../componants/Main/InputText'
import { LuEye, LuEyeClosed } from "react-icons/lu";
import Dropdown from '../../componants/Main/Dropdown'
import ImageUploadPopup from '../../componants/Main/ImageUploadPopup'
import apiClient from '../../utils/ApiClient';
import RoundButtonText from '../../componants/Main/RoundButtonText'
import { faSave } from '@fortawesome/free-solid-svg-icons';
import './MemberProfile.css';

const baseUrl = import.meta.env.VITE_API_BASE_IMG_URL;

function MemberProfile() {

    const [show, setShow] = useState(false);
    const [showImagePopup, setShowImagePopup] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        password: "",
        dob: "",
        gender: "",
        address:"",
        job: "",
        ac_no:"",
        iban_no:"",
        bank_name:"",
        profile_img:""
    });

     const genderArray =[
        {
            id: 0,
            name: "Male",
        },
        {
            id: 1,
            name: "Femal",
        }
    ];

    useEffect(() => {
        fetchProfile();
    },[]);


    ///API CALLING
    const fetchProfile = async () => {
        //setLoading(true);
        try {
        const response = await apiClient.get("/member/get_profile");
        if (response?.result?.status === 1) {
            console.warn("Get Transaction successfully");
            setFormData(response.result.data);
            //setProfile(response.result.data);

        } else {
            console.warn("No Transaction found or status != 1");
        }
        } catch (error) {
        console.error("Failed to fetch Transaction:", error);
        } finally {
        //setLoading(false);
        }
    };

    const saveProfile = async () => {
        //(true); // Show loader
        try {

            // const payload = {
            //     redeem_point: point,
            //     redeem_notes: notes
            // };
            
            //console.log("SANTHOSH Vendor ID:", payload);
            const data = await apiClient.post("/member/update_profile", formData);

            //if (data && data.result?.data.status === 1) {
            if (data?.result?.status === 1) {
                console.log("saved successfully");
            }
        } catch (err) {
            console.error("Something went wrong fetching vendors", err);
        }
        finally {
            //setisLoading(false); // Hide loader
        }
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
        ...prev,
        [name]: value,
        }));
    };

    const handleGenderChange = (e) => {
        setFormData(prev => ({
            ...prev,
            gender: e.target.value
        }));
        //setSelectedGender(e.target.value);
        console.log("Selected Status ID:", e.target.value);
    };

    const handleimageChange = () => {
        setShowImagePopup(false)
        fetchProfile()
        
    };

    const handleSaveButton = () => {
        console.log("SAVE BUTTON ACTION")
        saveProfile();
    };

   
  return (
    <div className='content-view'>
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom:'10px',
            width:'100%'
            }}>
            <div>
                <TitleView text={"Profile"} />
            </div>
            <div style={{width:'80px'}}>
                <RoundButtonText icon={faSave} text={"SAVE"} onClick={handleSaveButton}/>            
            </div>
            
        </div>

        <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'row'
            }}>

                <div style={{
                  width: '20%',
                  height: '100%',
                  backgroundColor: '#00000', 
                  display: 'flex',
                  flexDirection: 'column'
                    }}>

                    {/* Profile image view box    */}
                    <div style={{
                    boxSizing: 'border-box',
                    padding: '2px',
                    width: '100%',
                    height: '50%',
                    display: 'flex',
                    }}>
                      <DashboardBox>
                        <div className="profile-image-container" style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setShowImagePopup(true)}>
                          <img className='img-profile-dash' src={formData?.profile_img ? baseUrl+formData?.profile_img : "/dummy.jpg"} alt="Remote Image" />
                          <div className="profile-overlay" style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: '8px'
                          }}>
                            <button style={{
                              backgroundColor: 'var(--highlight-color)',
                              color: 'white',
                              border: 'none',
                              padding: '8px 16px',
                              borderRadius: '4px',
                              fontSize: '14px',
                              fontWeight: '500',
                              cursor: 'pointer'
                            }}>
                              Change Profile
                            </button>
                          </div>
                        </div>
                        <div className="blur-box">
                            <div style={{padding:'10px'}}>
                                <p className="title-text-light">{formData?.name}</p>
                                <p className="sub-title-text-light">{formData?.email}</p>
                            </div>
                        </div>
                      </DashboardBox>
                   </div>

                    {/* QR Code view box    */}
                    <div style={{
                    boxSizing: 'border-box',
                    padding: '2px',
                    width: '100%',
                    height: '50%',
                    display: 'flex',
                    }}>
                      <DashboardBox>
                         <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height:'100%' }}>
                           
                        </div>
                      </DashboardBox>
                    </div>
                </div>

                <div style={{
                    boxSizing: 'border-box',
                    padding: '2px',
                    width: '40%',
                    height: '100%',
                    display: 'flex',
                    }}>
                        <DashboardBox>
                           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', marginLeft: '10px', marginRight: '10px' }}>
                                <TextView type='darkBold' text={"Personal Details"}/>
                            </div>

                            <div style={{ display: 'flex', flexDirection:'column', alignItems: 'center', padding: '10px', marginLeft: '10px', marginRight: '10px', gap:'15px' }}>

                                <div style={{width:'100%'}}>
                                    <TextView type='subDark' text={"DOB"}/>
                                    <InputText
                                        type="name"
                                        placeholder="Date of Birth"
                                        name="dob"
                                        value={new Date(formData?.dob ? formData?.dob : "1994-09-03T21:00:00.000Z" ).toISOString().slice(0, 10)}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div style={{width:'100%'}}>
                                    <TextView type='subDark' text={"Job"}/>
                                     <Dropdown
                                        data={genderArray}
                                        selectedItem={formData.gender}
                                        onChange={handleGenderChange}
                                        firstItem="Select Status"
                                    />
                                </div>

                                <div style={{width:'100%'}}>
                                    <TextView type='subDark' text={"Job"}/>
                                    <InputText
                                        type="name"
                                        placeholder="Job"
                                        name="job"
                                        value={formData.job}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div style={{width:'100%'}}>
                                    <TextView type='subDark' text={"Address"}/>
                                    <InputText
                                        type="address"
                                        placeholder="Address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                    />
                                </div>


                            </div>
                        </DashboardBox>
                </div>


                <div style={{
                  boxSizing: 'border-box',
                  padding: '0px',
                  width: '40%',
                  height: '100%',
                  display: 'flex',
                  flexDirection:'column',
                }}>

                    <div style={{
                    boxSizing: 'border-box',
                    padding: '2px',
                    width: '100%',
                    height: '50%',
                    display: 'flex',
                    flexDirection:'column',
                    }}>

                        <DashboardBox>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', marginLeft: '10px', marginRight: '10px' }}>
                                <TextView type='darkBold' text={"Basic Details"}/>
                            </div>

                            <div style={{ display: 'flex', flexDirection:'column', alignItems: 'center', padding: '10px', marginLeft: '10px', marginRight: '10px', gap:'15px' }}>

                                <div style={{width:'100%'}}>
                                    <TextView type='subDark' text={"Name"}/>
                                    <InputText
                                        type="name"
                                        placeholder="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div style={{width:'100%'}}>
                                    <TextView type='subDark' text={"Phone"}/>
                                    <InputText
                                        type="phone"
                                        placeholder="Phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div style={{width:'100%'}}>
                                    <TextView type='subDark' text={"Password"}/>
                                    <div className='input-div-view-pwd' style={{padding:'0px',margin:'0px'}}>
                                        <input  type={show ? 'text' : 'password'} placeholder="Password" name="password"   onChange={handleChange} required  value={formData.password} />
                                        <span className="eye-icon" onClick={() => setShow(!show)}>
                                        {show ? <LuEyeClosed /> : <LuEye />}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            
                        </DashboardBox>
                    </div>


                    <div style={{
                    boxSizing: 'border-box',
                    padding: '2px',
                    width: '100%',
                    height: '50%',
                    display: 'flex',
                    flexDirection:'column',
                    }}>

                        <DashboardBox>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', marginLeft: '10px', marginRight: '10px' }}>
                                <TextView type='darkBold' text={"Bank Details"}/>
                            </div>

                            <div style={{ display: 'flex', flexDirection:'column', alignItems: 'center', padding: '10px', marginLeft: '10px', marginRight: '10px', gap:'15px' }}>

                                <div style={{width:'100%'}}>
                                    <TextView type='subDark' text={"Account Number"}/>
                                    <InputText
                                    type="text"
                                    placeholder="Account Number"
                                    name="ac_no"
                                    value={formData.ac_no}
                                    onChange={handleChange}
                                />
                                </div>
                                <div style={{width:'100%'}}>
                                    <TextView type='subDark' text={"IBAN Number"}/>
                                    <InputText
                                    type="text"
                                    placeholder="IBAN Number"
                                    name="iban_no"
                                    value={formData.iban_no}
                                    onChange={handleChange}
                                />
                                </div>
                                <div style={{width:'100%'}}>
                                    <TextView type='subDark' text={"Bank Name"}/>
                                    <InputText
                                    type="text"
                                    placeholder="Bank Name"
                                    name="bank_name"
                                    value={formData.bank_name}
                                    onChange={handleChange}
                                />
                                </div>
                            </div>
                        </DashboardBox>
                    </div>
                </div>
        </div>
        {showImagePopup && (
            <ImageUploadPopup onClose={() => handleimageChange() } userType={"member"}/>
        )}
    </div>
  )
}

export default MemberProfile
