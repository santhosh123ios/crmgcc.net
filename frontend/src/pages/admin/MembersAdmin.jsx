import React,{useEffect,useState} from 'react'
import DashboardBox from '../../componants/Main/DashboardBox'
import apiClient from '../../utils/ApiClient';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InputText from '../../componants/Main/InputText';
import TextView from '../../componants/Main/TextView';
import { faExchangeAlt, faLocationDot, faPhone, faEnvelope, faUser, faCalendarAlt, faStore, faUsers } from '@fortawesome/free-solid-svg-icons'

const baseUrl = import.meta.env.VITE_API_BASE_IMG_URL;

function MembersAdmin() {
    const [loadingVend, setLoadingVend] = useState(false);
    const [member, setMember] = useState([]);
    const [filteredMembers, setFilteredMembers] = useState([]);
    const [selectedPosMemb, setselectedPosMemb] = useState(0);
    const [selectedMember, setSelectedMember] = useState(null);
    
    // New state for vendors
    const [vendor, setVendor] = useState([]);
    const [filteredVendors, setFilteredVendors] = useState([]);
    const [selectedPosVend, setselectedPosVend] = useState(0);
    const [selectedVendor, setSelectedVendor] = useState(null);
    
    // Tab state
    const [activeTab, setActiveTab] = useState('members');
    
    const [formData, setFormData] = useState({
        search: "",
    })

    useEffect(() => {
        loadMembers();
        loadVendors();
    },[]);

    useEffect(() => {
        if (activeTab === 'members') {
            filterMembers();
        } else {
            filterVendors();
        }
    }, [formData.search, member, vendor, activeTab]);

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

    // New function to load vendors
    const loadVendors = async () => {
        try {
            const data = await apiClient.get("/admin/vendor_list");
            if (data && data.result?.data) {
                setVendor(data.result.data);
                setFilteredVendors(data.result.data);
                setSelectedVendor(data.result.data[0])
            }
        } catch (err) {
            console.error("Something went wrong fetching vendors", err);
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

    // New function to filter vendors
    const filterVendors = () => {
        const searchTerm = formData.search.toLowerCase().trim();
        
        if (!searchTerm) {
            setFilteredVendors(vendor);
            return;
        }

        const filtered = vendor.filter(vendorItem => {
            const name = vendorItem.name?.toLowerCase() || '';
            const email = vendorItem.email?.toLowerCase() || '';
            const phone = vendorItem.phone?.toLowerCase() || '';
            
            return name.includes(searchTerm) || 
                   email.includes(searchTerm) || 
                   phone.includes(searchTerm);
        });

        setFilteredVendors(filtered);
        
        // Reset selection if current selected vendor is not in filtered results
        if (filtered.length > 0 && !filtered.includes(selectedVendor)) {
            setselectedPosVend(0);
            setSelectedVendor(filtered[0]);
        } else if (filtered.length === 0) {
            setselectedPosVend(0);
            setSelectedVendor(null);
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

    // New function to handle vendor list click
    const handleVendorListClick = (index) => {
        setselectedPosVend(index)
        console.log("Clicked vendor index:", index);
        setSelectedVendor(filteredVendors[index])
    };

    // New function to handle tab click
    const handleTabClick = (tab) => {
        setActiveTab(tab);
        setFormData({ search: "" }); // Reset search when switching tabs
        
        // Reset selections when switching tabs
        if (tab === 'members') {
            if (member.length > 0) {
                setselectedPosMemb(0);
                setSelectedMember(member[0]);
            }
        } else {
            if (vendor.length > 0) {
                setselectedPosVend(0);
                setSelectedVendor(vendor[0]);
            }
        }
    };

    // New function to update user status
    const updateUserStatus = async (userId, newStatus) => {
        try {
            console.log("Updating user status:", { userId, newStatus });
            
            const response = await apiClient.post("/admin/update_user_status", {
                user_id: userId,
                status: newStatus
            });

            console.log("API Response:", response);

            // Check for different possible response structures
            const isSuccess = response && (
                response.success === true || 
                response.result?.success === true || 
                response.data?.success === true
            );

            if (isSuccess) {
                // Update the local state
                if (activeTab === 'members') {
                    // Update member status
                    const updatedMembers = member.map(m => 
                        m.id === userId ? { ...m, status: newStatus === 1 ? 1 : 0 } : m
                    );
                    const updatedFilteredMembers = filteredMembers.map(m => 
                        m.id === userId ? { ...m, status: newStatus === 1 ? 1 : 0 } : m
                    );
                    
                    setMember(updatedMembers);
                    setFilteredMembers(updatedFilteredMembers);
                    
                    // Update selected member if it's the current one
                    if (selectedMember && selectedMember.id === userId) {
                        setSelectedMember(prev => ({ ...prev, status: newStatus === 1 ? 1 : 0 }));
                    }
                } else {
                    // Update vendor status
                    const updatedVendors = vendor.map(v => 
                        v.id === userId ? { ...v, status: newStatus === 1 ? 1 : 0 } : v
                    );
                    const updatedFilteredVendors = filteredVendors.map(v => 
                        v.id === userId ? { ...v, status: newStatus === 1 ? 1 : 0 } : v
                    );
                    
                    setVendor(updatedVendors);
                    setFilteredVendors(updatedFilteredVendors);
                    
                    // Update selected vendor if it's the current one
                    if (selectedVendor && selectedVendor.id === userId) {
                        setSelectedVendor(prev => ({ ...prev, status: newStatus === 1 ? 1 : 0 }));
                    }
                }

                console.log("User status updated successfully");
            } else {
                console.error("API response indicates failure:", response);
                // Try to update UI anyway for better user experience
                if (activeTab === 'members') {
                    if (selectedMember && selectedMember.id === userId) {
                        setSelectedMember(prev => ({ ...prev, status: newStatus === 1 ? 1 : 0 }));
                    }
                } else {
                    if (selectedVendor && selectedVendor.id === userId) {
                        setSelectedVendor(prev => ({ ...prev, status: newStatus === 1 ? 1 : 0 }));
                    }
                }
            }
        } catch (err) {
            console.error("Error updating user status:", err);
        }
    };

    // Function to handle status toggle
    const handleStatusToggle = (userId, currentStatus) => {
        console.log("Toggle clicked:", { userId, currentStatus });
        const newStatus = currentStatus === 1 ? 0 : 1;
        console.log("New status will be:", newStatus);
        updateUserStatus(userId, newStatus);
    };

    // Helper function to format status display
    const formatStatus = (status) => {
        if (status === 1) {
            return 'Active';
        } else if (status === 0) {
            return 'Deactivated';
        }
        return status || 'N/A';
    };

    // Helper function to get status color
    const getStatusColor = (status) => {
        if (status === 1) {
            return '#28a745';
        } else if (status === 0) {
            return '#dc3545';
        }
        return '#6c757d';
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
                        {/* Tab Bar */}
                        <div style={{
                            width: '100%',
                            height: '50px',
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            padding: '10px',
                            borderBottom: '1px solid #e0e0e0',
                        }}>
                            <div className="vendor-tab-bar" >
                                <button 
                                    className={`vendor-tab ${activeTab === 'members' ? 'active' : ''}`}
                                    onClick={() => handleTabClick('members')}
                                >
                                    <FontAwesomeIcon icon={faUsers} />
                                    <span>Members</span>
                                </button>
                                <button 
                                    className={`vendor-tab ${activeTab === 'vendors' ? 'active' : ''}`}
                                    onClick={() => handleTabClick('vendors')}
                                >
                                    <FontAwesomeIcon icon={faStore} />
                                    <span>Vendors</span>
                                </button>
                            </div>

                            {/* Search bar and add button */}
                            <div style={{
                                width: '100%',
                                height: '60px',
                                display: 'flex',
                                flexDirection: 'row',
                                padding: '2px',
                                borderBlock:'boxSizing',
                                marginRight:'10px'}}>

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
                        </div>

                        

                        <div className="member-list-container">
                            {loadingVend ? (
                            <div className="loader-container">
                                <div className="spinner" />
                            </div>
                            ) : activeTab === 'members' ? (
                                // Members Tab Content
                                filteredMembers.length === 0 ? (
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
                                          <div className={memberItems.status == 1? "member-status-indicator-active": "member-status-indicator"}></div>
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
                              )
                            ) : (
                                // Vendors Tab Content
                                filteredVendors.length === 0 ? (
                                    <div className="member-empty-state">
                                        <div className="member-empty-state-icon">
                                            <FontAwesomeIcon icon={faStore} />
                                        </div>
                                        <p className="member-empty-state-text">No vendors found</p>
                                        <p className="member-empty-state-subtext">Try adjusting your search criteria</p>
                                    </div>
                                ) : (
                                filteredVendors.map((vendorItems, index) => (
                                  <div className="member-list-item" key={index}>
                                    <div 
                                      className={`member-card ${selectedPosVend === index ? 'member-card-selected' : ''}`}
                                      onClick={() => handleVendorListClick(index)}
                                    >
                                      <div className="member-card-header">
                                        <div className="member-avatar-container">
                                          <img 
                                            className="member-avatar" 
                                            src={vendorItems.profile_img ? baseUrl + vendorItems.profile_img : "/dummy.jpg"} 
                                            alt={vendorItems.name} 
                                          />
                                          <div className={vendorItems.status == 1? "member-status-indicator-active": "member-status-indicator"}></div>
                                        </div>
                                        <div className="member-info">
                                          <h3 className="member-name">{vendorItems.name}</h3>
                                          <p className="member-email">
                                            <FontAwesomeIcon icon={faEnvelope} className="member-icon" />
                                            {vendorItems.email}
                                          </p>
                                          {vendorItems.phone && (
                                            <p className="member-phone">
                                              <FontAwesomeIcon icon={faPhone} className="member-icon" />
                                              {vendorItems.phone}
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                      
                                      <div className="member-card-actions">
                                        <button className="member-action-btn" title="Call Vendor">
                                          <FontAwesomeIcon icon={faPhone} />
                                        </button>
                                        <button className="member-action-btn" title="View Location">
                                          <FontAwesomeIcon icon={faLocationDot} />
                                        </button>
                                        <button className="member-action-btn" title="View Products">
                                          <FontAwesomeIcon icon={faStore} />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ))
                              )
                            )}
                        </div>

                    </DashboardBox>

                </div>

            {/* Selected member/vendor details */}
                <div style={{
                  width: '60%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '2px'
                }}>
                    <DashboardBox>
                        <div className="comp-item-inside">               
                            {activeTab === 'members' ? (
                                // Member Details
                                selectedMember ? (
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
                                                    <div className={selectedMember.status == 1? "member-status-badge-active": "member-status-badge"}>
                                                        {formatStatus(selectedMember.status)}
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
                                                <label className="member-detail-label">Status</label>
                                                <span className="member-detail-value status-value" style={{ color: getStatusColor(selectedMember.status) }}>
                                                    {formatStatus(selectedMember.status)}
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

                                        {/* Status Update Section */}
                                        <div className="member-details-section">
                                            <h3 className="member-details-section-title">Status Management</h3>
                                            
                                            {/* Toggle Switch */}
                                            <div style={{ marginTop: '15px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                
                                                <div 
                                                    className="status-toggle-switch"
                                                    onClick={() => {
                                                        console.log("Toggle switch clicked!");
                                                        handleStatusToggle(selectedMember.id, selectedMember.status);
                                                    }}
                                                    style={{
                                                        width: '60px',
                                                        height: '30px',
                                                        backgroundColor: (selectedMember.status === 1) ? '#28a745' : '#dc3545',
                                                        borderRadius: '15px',
                                                        cursor: 'pointer',
                                                        position: 'relative',
                                                        transition: 'all 0.3s ease',
                                                        border: '2px solid #fff',
                                                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                                    }}
                                                >
                                                    <div style={{
                                                        position: 'absolute',
                                                        top: '4px',
                                                        left: (selectedMember.status === 1) ? '32px' : '5px',
                                                        width: '22px',
                                                        height: '22px',
                                                        backgroundColor: '#fff',
                                                        borderRadius: '50%',
                                                        transition: 'all 0.3s ease',
                                                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                                    }} />
                                                </div>
                                                <span style={{ 
                                                    fontSize: '14px', 
                                                    fontWeight: '500',
                                                    color: (selectedMember.status === 1) ? '#28a745' : '#dc3545'
                                                }}>
                                                    {(selectedMember.status === 1) ? 'Active' : 'Deactivated'}
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
                                )
                            ) : (
                                // Vendor Details
                                selectedVendor ? (
                                    <div className="member-details-container">
                                        {/* Vendor Header */}
                                        <div className="member-details-header">
                                            <div className="member-details-avatar-section">
                                                <img 
                                                    className="member-details-avatar" 
                                                    src={selectedVendor.profile_img ? baseUrl + selectedVendor.profile_img : "/dummy.jpg"} 
                                                    alt={selectedVendor.name} 
                                                />
                                                <div className="member-details-status">
                                                    <div className={selectedVendor.status == 1? "member-status-badge-active": "member-status-badge"}>
                                                        {formatStatus(selectedVendor.status)}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="member-details-info">
                                                <h2 className="member-details-name">{selectedVendor.name}</h2>
                                                <p className="member-details-email">
                                                    <FontAwesomeIcon icon={faEnvelope} className="member-details-icon" />
                                                    {selectedVendor.email}
                                                </p>
                                                {selectedVendor.phone && (
                                                    <p className="member-details-phone">
                                                        <FontAwesomeIcon icon={faPhone} className="member-details-icon" />
                                                        {selectedVendor.phone}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Vendor Details Grid */}
                                        <div className="member-details-grid">
                                            <div className="member-detail-item">
                                                <label className="member-detail-label">Vendor ID</label>
                                                <span className="member-detail-value">{selectedVendor.id || 'N/A'}</span>
                                            </div>
                                            
                                            <div className="member-detail-item">
                                                <label className="member-detail-label">Status</label>
                                                <span className="member-detail-value status-value" style={{ color: getStatusColor(selectedVendor.status) }}>
                                                    {formatStatus(selectedVendor.status)}
                                                </span>
                                            </div>
                                            
                                            <div className="member-detail-item">
                                                <label className="member-detail-label">Registration Date</label>
                                                <span className="member-detail-value">
                                                    {selectedVendor.created_at ? new Date(selectedVendor.created_at).toLocaleDateString() : 'N/A'}
                                                </span>
                                            </div>
                                            
                                            <div className="member-detail-item">
                                                <label className="member-detail-label">Last Updated</label>
                                                <span className="member-detail-value">
                                                    {selectedVendor.updated_at ? new Date(selectedVendor.updated_at).toLocaleDateString() : 'N/A'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Status Update Section */}
                                        <div className="member-details-section">
                                            <h3 className="member-details-section-title">Status Management</h3>
                                            
                                            {/* Toggle Switch */}
                                            <div style={{ marginTop: '15px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                
                                                <div 
                                                    className="status-toggle-switch"
                                                    onClick={() => {
                                                        console.log("Vendor toggle switch clicked!");
                                                        handleStatusToggle(selectedVendor.id, selectedVendor.status);
                                                    }}
                                                    style={{
                                                        width: '60px',
                                                        height: '30px',
                                                        backgroundColor: (selectedVendor.status === 1) ? '#28a745' : '#dc3545',
                                                        borderRadius: '15px',
                                                        cursor: 'pointer',
                                                        position: 'relative',
                                                        transition: 'all 0.3s ease',
                                                        border: '2px solid #fff',
                                                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                                    }}
                                                >
                                                    <div style={{
                                                        position: 'absolute',
                                                        top: '4px',
                                                        left: (selectedVendor.status === 1) ? '32px' : '5px',
                                                        width: '22px',
                                                        height: '22px',
                                                        backgroundColor: '#fff',
                                                        borderRadius: '50%',
                                                        transition: 'all 0.3s ease',
                                                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                                    }} />
                                                </div>
                                                <span style={{ 
                                                    fontSize: '14px', 
                                                    fontWeight: '500',
                                                    color: (selectedVendor.status === 1) ? '#28a745' : '#dc3545'
                                                }}>
                                                    {(selectedVendor.status === 1) ? 'Active' : 'Deactivated'}
                                                </span>
                                            </div>
                                            
                                            
                                        </div>

                                        {/* Additional Information */}
                                        {selectedVendor.address && (
                                            <div className="member-details-section">
                                                <h3 className="member-details-section-title">Address</h3>
                                                <p className="member-details-address">
                                                    <FontAwesomeIcon icon={faLocationDot} className="member-details-icon" />
                                                    {selectedVendor.address}
                                                </p>
                                            </div>
                                        )}

                                        {/* Action Buttons */}
                                        <div className="member-details-actions">
                                            
                                            <button className="member-detail-action-btn" title="View Products">
                                                <FontAwesomeIcon icon={faStore} />
                                                View Products
                                            </button>
                                            <button className="member-detail-action-btn" title="Send Message">
                                                <FontAwesomeIcon icon={faEnvelope} />
                                                Message
                                            </button>
                                            <button className="member-detail-action-btn" title="Text Reporting">
                                                <FontAwesomeIcon icon={faStore} />
                                                Report
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="member-details-empty">
                                        <div className="member-details-empty-icon">
                                            <FontAwesomeIcon icon={faStore} />
                                        </div>
                                        <h3 className="member-details-empty-title">No Vendor Selected</h3>
                                        <p className="member-details-empty-text">
                                            Select a vendor from the list to view their details
                                        </p>
                                    </div>
                                )
                            )}
                        </div>
                    </DashboardBox>

                </div>
        </div>

    </div>
  )
}

export default MembersAdmin
