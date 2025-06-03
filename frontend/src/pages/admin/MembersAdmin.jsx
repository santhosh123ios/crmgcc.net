import React,{useEffect,useState} from 'react'
import DashboardBox from '../../componants/Main/DashboardBox'
import apiClient from '../../utils/ApiClient';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InputText from '../../componants/Main/InputText';
import TextView from '../../componants/Main/TextView';
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons'
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { faPhone } from '@fortawesome/free-solid-svg-icons';

const baseUrl = import.meta.env.VITE_API_BASE_IMG_URL;

function MembersAdmin() {
  const [loadingVend, setLoadingVend] = useState(false);
    const [member, setMember] = useState([]);
    const [selectedPosMemb, setselectedPosMemb] = useState(0);
    const [selectedMember, setSelectedMember] = useState(null);
    const [formData, setFormData] = useState({
        search: "",
    })

    useEffect(() => {
        loadMembers();
    },[]);

    ///API CALLING
    const loadMembers = async () => {
        setLoadingVend(true)
        try {
            const data = await apiClient.get("/admin/member_list");
        if (data && data.result?.data) {
            setMember(data.result.data);
            setSelectedMember(data.result.data[0])
        }
        } catch (err) {
        console.error("Something went wrong fetching Members", err);
        }
        finally
        {
            setLoadingVend(false)
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

    const handleMemberListClick = (index) => {
        setselectedPosMemb(index)
        console.log("Clicked index:", index);
        console.log("Clicked Sttaus:", member[index].lead_status);
        setSelectedMember(member[index])
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
                                    placeholder="Search Member"
                                    name="search"
                                    value={formData.search}
                                    onChange={handleChange}
                                />

                            </div>
                        </div>


                        <div className="user-list-scroll-container">
                            {loadingVend ? (
                            <div className="loader-container">
                                <div className="spinner" />
                            </div>
                            ) : (
                            member.map((memberItems, index) => (
                              <div className="user-list-item-rdm" key={index}>
                                <DashboardBox>
                                      <div className="user-list-item-tr-inside" onClick={() => handleMemberListClick(index)}>
                                        
                                            <img className="user-avatar" style={{marginLeft:'10px'}} src={memberItems.profile_img? baseUrl+memberItems.profile_img: "/dummy.jpg"} alt={memberItems.name} />
                                                <div className="user-info-vendor">
                                                    <TextView type='darkBold' text={memberItems.name}/>
                                                    <TextView type='dark' text={memberItems.email}/>
        
                                                    <div className="button-row">
                                                        {/* Translation */}
                                                        <button className="circle-btn">
                                                                <FontAwesomeIcon icon={faPhone} />
                                                        </button>
        
                                                        {/* Translation */}
                                                        <button className="circle-btn">
                                                                <FontAwesomeIcon icon={faLocationDot} />
                                                        </button>
        
                                                        {/* Translation */}
                                                        <button className="circle-btn">
                                                                <FontAwesomeIcon icon={faExchangeAlt} />
                                                        </button>
                                                    </div>
                                                </div>

                                            {selectedPosMemb === index && (
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
                    <DashboardBox>
                        <div className="comp-item-inside">               
                           
                        </div>
                    </DashboardBox>

                </div>
        </div>

    </div>
  )
}

export default MembersAdmin
