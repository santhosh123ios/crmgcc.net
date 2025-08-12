import React,{useEffect,useState} from 'react'
import DashboardBox from '../../componants/Main/DashboardBox'
import apiClient from '../../utils/ApiClient';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InputText from '../../componants/Main/InputText';
import TextView from '../../componants/Main/TextView';
import { faExchangeAlt, faLocationDot, faPhone, faEnvelope, faUser, faCalendarAlt } from '@fortawesome/free-solid-svg-icons'

const baseUrl = import.meta.env.VITE_API_BASE_IMG_URL;

function MembersAdmin() {
    const [loadingVend, setLoadingVend] = useState(false);
    const [member, setMember] = useState([]);
    const [filteredMembers, setFilteredMembers] = useState([]);
    const [selectedPosMemb, setselectedPosMemb] = useState(0);
    const [selectedMember, setSelectedMember] = useState(null);
    const [formData, setFormData] = useState({
        search: "",
    })

    useEffect(() => {
        loadMembers();
    },[]);

    useEffect(() => {
        filterMembers();
    }, [formData.search, member]);

    ///API CALLING
    const loadMembers = async () => {
        setLoadingVend(true)
        try {
            const data = await apiClient.get("/admin/member_list");
        if (data && data.result?.data) {
            setMember(data.result.data);
            setFilteredMembers(data.result.data);
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

    ///SEARCH FUNCTIONALITY
    const filterMembers = () => {
        const searchTerm = formData.search.toLowerCase().trim();
        
        if (!searchTerm) {
            setFilteredMembers(member);
            return;
        }

        const filtered = member.filter(memberItem => {
            const name = memberItem.name?.toLowerCase() || '';
            const email = memberItem.email?.toLowerCase() || '';
            const phone = memberItem.phone?.toLowerCase() || '';
            
            return name.includes(searchTerm) || 
                   email.includes(searchTerm) || 
                   phone.includes(searchTerm);
        });

        setFilteredMembers(filtered);
        
        // Reset selection if current selected member is not in filtered results
        if (filtered.length > 0 && !filtered.includes(selectedMember)) {
            setselectedPosMemb(0);
            setSelectedMember(filtered[0]);
        } else if (filtered.length === 0) {
            setselectedPosMemb(0);
            setSelectedMember(null);
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
        console.log("Clicked Sttaus:", filteredMembers[index].lead_status);
        setSelectedMember(filteredMembers[index])
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

                        <div className="member-list-container">
                            {loadingVend ? (
                            <div className="loader-container">
                                <div className="spinner" />
                            </div>
                            ) : filteredMembers.length === 0 ? (
                                <div className="member-empty-state">
                                    <div className="member-empty-state-icon">
                                        <FontAwesomeIcon icon={faUser} />
                                    </div>
                                    <p className="member-empty-state-text">No members found</p>
                                    <p className="member-empty-state-subtext">Try adjusting your search criteria</p>
                                </div>
                            ) : (
                            filteredMembers.map((memberItems, index) => (
                              <div className="member-list-item" key={index}>
                                <div 
                                  className={`member-card ${selectedPosMemb === index ? 'member-card-selected' : ''}`}
                                  onClick={() => handleMemberListClick(index)}
                                >
                                  <div className="member-card-header">
                                    <div className="member-avatar-container">
                                      <img 
                                        className="member-avatar" 
                                        src={memberItems.profile_img ? baseUrl + memberItems.profile_img : "/dummy.jpg"} 
                                        alt={memberItems.name} 
                                      />
                                      <div className="member-status-indicator"></div>
                                    </div>
                                    <div className="member-info">
                                      <h3 className="member-name">{memberItems.name}</h3>
                                      <p className="member-email">
                                        <FontAwesomeIcon icon={faEnvelope} className="member-icon" />
                                        {memberItems.email}
                                      </p>
                                      {memberItems.phone && (
                                        <p className="member-phone">
                                          <FontAwesomeIcon icon={faPhone} className="member-icon" />
                                          {memberItems.phone}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  
                                  <div className="member-card-actions">
                                    <button className="member-action-btn" title="Call Member">
                                      <FontAwesomeIcon icon={faPhone} />
                                    </button>
                                    <button className="member-action-btn" title="View Location">
                                      <FontAwesomeIcon icon={faLocationDot} />
                                    </button>
                                    <button className="member-action-btn" title="Exchange Points">
                                      <FontAwesomeIcon icon={faExchangeAlt} />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>

                    </DashboardBox>

                </div>

            {/* Selected member details */}
                <div style={{
                  width: '60%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '2px'
                }}>
                    <DashboardBox>
                        <div className="comp-item-inside">               
                            {selectedMember ? (
                                <div className="member-details-container">
                                    {/* Member Header */}
                                    <div className="member-details-header">
                                        <div className="member-details-avatar-section">
                                            <img 
                                                className="member-details-avatar" 
                                                src={selectedMember.profile_img ? baseUrl + selectedMember.profile_img : "/dummy.jpg"} 
                                                alt={selectedMember.name} 
                                            />
                                            <div className="member-details-status">
                                                <div className="member-status-badge">
                                                    {selectedMember.lead_status || 'Active'}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="member-details-info">
                                            <h2 className="member-details-name">{selectedMember.name}</h2>
                                            <p className="member-details-email">
                                                <FontAwesomeIcon icon={faEnvelope} className="member-details-icon" />
                                                {selectedMember.email}
                                            </p>
                                            {selectedMember.phone && (
                                                <p className="member-details-phone">
                                                    <FontAwesomeIcon icon={faPhone} className="member-details-icon" />
                                                    {selectedMember.phone}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Member Details Grid */}
                                    <div className="member-details-grid">
                                        <div className="member-detail-item">
                                            <label className="member-detail-label">Member ID</label>
                                            <span className="member-detail-value">{selectedMember.id || 'N/A'}</span>
                                        </div>
                                        
                                        <div className="member-detail-item">
                                            <label className="member-detail-label">Lead Status</label>
                                            <span className="member-detail-value status-value">
                                                {selectedMember.lead_status || 'N/A'}
                                            </span>
                                        </div>
                                        
                                        <div className="member-detail-item">
                                            <label className="member-detail-label">Registration Date</label>
                                            <span className="member-detail-value">
                                                {selectedMember.created_at ? new Date(selectedMember.created_at).toLocaleDateString() : 'N/A'}
                                            </span>
                                        </div>
                                        
                                        <div className="member-detail-item">
                                            <label className="member-detail-label">Last Updated</label>
                                            <span className="member-detail-value">
                                                {selectedMember.updated_at ? new Date(selectedMember.updated_at).toLocaleDateString() : 'N/A'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Additional Information */}
                                    {selectedMember.address && (
                                        <div className="member-details-section">
                                            <h3 className="member-details-section-title">Address</h3>
                                            <p className="member-details-address">
                                                <FontAwesomeIcon icon={faLocationDot} className="member-details-icon" />
                                                {selectedMember.address}
                                            </p>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="member-details-actions">
                                        
                                        <button className="member-detail-action-btn" title="View Transactions">
                                            <FontAwesomeIcon icon={faExchangeAlt} />
                                            View History
                                        </button>
                                        <button className="member-detail-action-btn" title="Send Message">
                                            <FontAwesomeIcon icon={faEnvelope} />
                                            Message
                                        </button>
                                        <button className="member-detail-action-btn" title="Text Reporting">
                                            <FontAwesomeIcon icon={faUser} />
                                            Report
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="member-details-empty">
                                    <div className="member-details-empty-icon">
                                        <FontAwesomeIcon icon={faUser} />
                                    </div>
                                    <h3 className="member-details-empty-title">No Member Selected</h3>
                                    <p className="member-details-empty-text">
                                        Select a member from the list to view their details
                                    </p>
                                </div>
                            )}
                        </div>
                    </DashboardBox>

                </div>
        </div>

    </div>
  )
}

export default MembersAdmin
