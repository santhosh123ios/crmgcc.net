import React, {useState,useEffect} from 'react'
import DashboardBox from '../../componants/Main/DashboardBox'
import apiClient from '../../utils/ApiClient';

import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons'
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import InputText from '../../componants/Main/InputText';
import DateWithIcon from '../../componants/Main/DateWithIcon';
import TextView from '../../componants/Main/TextView';
import RoundButton from '../../componants/Main/RoundButton';
import RedeemPopup from '../../componants/Main/RedeemPopup';
import StatusBadge from '../../componants/Main/StatusBadge';

const baseId = import.meta.env.VITE_ID_BASE;
const baseUrl = import.meta.env.VITE_API_BASE_IMG_URL;

function WalletMember() {

  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [wallet, setWallet] = useState({});
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [selectedPosTr, setselectedPosTr] = useState(0);
  const [availablePoint, setAvailablePoint] = useState(1000);
  const [showRedeemPopup, setShowRedeemPopup] = useState(false);
  const [redeems, setredeems] = useState([]);
  const [selectedReadeem, setSelectedRedeem] = useState(null);
  const [selectedPosRedeem, setselectedPosReadeem] = useState(0);
  const [loadingRdm, setLoadingRdm] = useState(true);
  const [loadingWallet, setLoadingWallet] = useState(true);
  const [formData, setFormData] = useState({
        search: ""
  });


  useEffect(() => {
    fetchTransaction();
    fetchRedeem();
    fetchWallet();
  },[]);


  ///API CALLING
  const fetchTransaction = async () => {
      setLoading(true);
      try {
      const response = await apiClient.get("/member/get_transaction");
      if (response?.result?.status === 1) {
          console.warn("Get Transaction successfully");
          setTransactions(response.result.data);
          setSelectedTransaction(response.result.data[0])

      } else {
          console.warn("No Transaction found or status != 1");
      }
      } catch (error) {
      console.error("Failed to fetch Transaction:", error);
      } finally {
      setLoading(false);
      }
  };

  const addRedeem = async (point,notes) => {
      //(true); // Show loader
      try {

          const payload = {
              redeem_point: point,
              redeem_notes: notes
          };
          
          //console.log("SANTHOSH Vendor ID:", payload);
          const data = await apiClient.post("/member/add_redeem", payload);

          //if (data && data.result?.data.status === 1) {
          if (data?.result?.status === 1) {
                setShowRedeemPopup(false)
                fetchRedeem();
          }
      } catch (err) {
          console.error("Something went wrong fetching vendors", err);
      }
      finally {
          //setisLoading(false); // Hide loader
      }
  };

  const fetchRedeem = async () => {
      setLoadingRdm(true);
      try {
      const responseRedeems = await apiClient.get("/member/get_redeem");
      if (responseRedeems?.result?.status === 1) {
          console.warn("Get Redeem successfully");
          setredeems(responseRedeems.result.data);
          setSelectedRedeem(responseRedeems.result.data[0])

      } else {
          console.warn("No Transaction found or status != 1");
      }
      } catch (error) {
      console.error("Failed to fetch Transaction:", error);
      } finally {
      setLoadingRdm(false);
      }
  };

  const fetchWallet = async () => {
      setLoadingWallet(true);
      try {
      const response = await apiClient.get("/member/get_walletDetails");
      if (response?.result?.status === 1) {
          console.warn("Get Transaction successfully");
          setWallet(response.result);
          setLoadingWallet(false)

      } else {
          console.warn("No Transaction found or status != 1");
      }
      } catch (error) {
      console.error("Failed to fetch Transaction:", error);
      } finally {
      setLoadingWallet(false);
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

  const handleLeadListClick = (index) => {
      setselectedPosTr(index)
      console.log("Clicked index:", index);
      console.log("Clicked Sttaus:", transactions[index].lead_status);
      setSelectedTransaction(transactions[index])
  };

  const handleRedeemPopupSubmit = (points,notes) => {
        console.log('Submitted Points:', points);
       addRedeem(points,notes)
  };

  const handleLeadListClickRedeem = (index) => {
      setselectedPosReadeem(index)
      console.log("Clicked index:", index);
      console.log("Clicked Sttaus:", redeems[index].redeem_id);
      setSelectedRedeem(redeems[index])
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
                  width: '35%',
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
                                        placeholder="Search Transaction"
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
                            transactions.map((trItems, index) => (
                              <div className="user-list-item-tr" key={index}>
                                <DashboardBox>
                                      <div className="user-list-item-tr-inside" onClick={() => handleLeadListClick(index)}>
                                        
                                            <div className="user-info-tr">
                                                <DateWithIcon text={new Date(trItems.transaction_created_at).toLocaleString("en-US", {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    second: "2-digit"
                                                })} >
                                                </DateWithIcon>
                                                <TextView type="subDarkBold" text={trItems.transaction_title}/>
                                                <TextView type="subDark" text={trItems.vendor_name}/>
                                            </div>

                                            <div style={{height: '100%',display: 'flex',justifyContent: 'center',alignItems: 'center',paddingLeft:'10px',paddingRight:'10px',gap:'2px'}}>
                                              <TextView type="darkBold" text={trItems.transaction_type === 1 ? trItems.transaction_cr : trItems.transaction_dr }/>
                                              <TextView type="subDarkBold" text={trItems.transaction_type === 1 ? "Cr" : "Dr" } style={{color:trItems.transaction_type === 1 ? 'green' : 'red'}}/>
                                            </div>
                                            {selectedPosTr === index && (
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
                  width: '30%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '2px'
                }}>
                    {/* Transaction detalil view */}
                    <div style={{
                        width: '100%',
                        height: '32%',
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '2px'
                        }}>
                        <DashboardBox >
                          <div className='user-list-item-inside'>
                              <img className="user-avatar" src={selectedTransaction?.vendor_image ? baseUrl+selectedTransaction?.vendor_image : "/dummy.jpg"} alt={"selectedLead.vendor_name"} /> 
                                {/* <img className="user-avatar" src="http://localhost:8000/uploads/1747778079775.jpg"alt={"uploads"} /> */}
                              <div className="user-info">
                                  <p className="title-text-dark">{selectedTransaction?.vendor_name ?? "No member name"}</p>
                                  <p className="sub-title-text-dark">{selectedTransaction?.vendor_email ?? "No member email"}</p>

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

                          <div style={{boxSizing:'border-box',display: 'flex',alignItems: 'start',justifyItems:'start'}}>
                            <div className="tr-view-item">
                                  <div className="user-info-tr">
                                      <DateWithIcon text={new Date(selectedTransaction?.transaction_created_at).toLocaleDateString("en-US", {
                                          year: "numeric",
                                          month: "long",
                                          day: "numeric",
                                          })} >
                                      </DateWithIcon>
                                      <TextView type="subDarkBold" text={selectedTransaction?.transaction_title}/>
                                      <TextView type="subDark" text={selectedTransaction?.vendor_name}/>
                                      <TextView type="subDark" text={baseId+selectedTransaction?.transaction_id}/>
                                  </div>

                                  <div style={{height: '100%',display: 'flex',justifyContent: 'center',alignItems: 'center',paddingLeft:'10px',paddingRight:'10px',gap:'2px'}}>
                                    <TextView type="darkBold" text={selectedTransaction?.transaction_type === 1 ? selectedTransaction?.transaction_cr : selectedTransaction?.transaction_dr }/>
                                    <TextView type="subDarkBold" text={selectedTransaction?.transaction_type === 1 ? "Cr" : "Dr" } style={{color:selectedTransaction?.transaction_type === 1 ? 'green' : 'red'}}/>
                                  </div>
                            </div>
                          </div>
                        </DashboardBox>
                    </div>

                    <div style={{
                    boxSizing: 'border-box',
                    padding: '2px',
                    width: '100%',
                    height: '35%',
                    display: 'flex',
                    }}>
                      
                        <div className='card-view-bg'>
                          {loadingWallet ? (
                            <div className="loader-container">
                                <div className="spinner" />
                            </div>
                            ) : (
                            <div style={{ boxSizing:'border-box', width:'100%',height:'100%'}}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0px', marginLeft: '10px', marginRight: '10px',height:'15%'}}>
                                    <p className="title-text-light">{wallet?.card?.card_type_name}</p>
                                    <p className="title-text-light">Wallet</p>
                                </div>

                                <div style={{ display: 'flex', 
                                    justifyContent: 'center', 
                                    alignItems: 'center', 
                                    padding: '0px', 
                                    marginLeft: '10px', 
                                    marginRight: '10px' , 
                                    height:'70%',
                                    fontSize:'25px',
                                    fontWeight:'bold',
                                    flexDirection:'column'}}>
                                    <TextView type="subLight" text={"Balance"}/>
                                    {wallet?.available_point?.user_balance}
                                    <TextView type="light" text={wallet?.card?.card_no.replace(/(.{4})/g, '$1    ').trim()}/>
                                </div>
                                
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0px', marginLeft: '10px', marginRight: '10px',height:'15%'}}>
                                    <p className="title-text-light">{wallet?.user?.name.toUpperCase()}</p>
                                </div>
                            </div>
                             )}
                        </div>
                     
                    </div>

                    {/* Redeem detail view */}
                    <div style={{
                        width: '100%',
                        height: '33%',
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '2px'
                        }}>
                        <DashboardBox>

                          <div className="user-list-item-redeem-inside" >      
                              <div className="user-info-tr">
                                  <DateWithIcon text={new Date(selectedReadeem?.redeem_created_at).toLocaleString("en-US", {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      second: "2-digit"
                                  })} >
                                  </DateWithIcon>
                                  <TextView type="subDarkBold" text={selectedReadeem?.notes}/>
                                    <StatusBadge status={selectedReadeem?.redeem_status==0 ? 0 : selectedReadeem?.redeem_status==1 ? 3 : 4 } />
                                  <TextView type="subDark" text={baseId+selectedReadeem?.redeem_id}/>
                                  
                              </div> 

                              <div style={{height: '100%',display: 'flex',justifyContent: 'center',alignItems: 'center',paddingLeft:'10px',paddingRight:'10px',gap:'2px'}}>
                                <TextView type="darkBold" text={selectedReadeem?.point}/>
                              </div>
                          </div>
                          <div style={{paddingLeft:'10px',paddingRight:'10px',paddingBottom:'10px'}}>
                              <TextView type="subDarkBold" text="Notes :"/>   
                              <TextView type="subDark" text={selectedReadeem?.redeem_comment}/>                  
                          </div>
                          

                        </DashboardBox>
                    </div>

                    
                </div>

                <div style={{
                  width: '35%',
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
                                        placeholder="Search Redeem Requests"
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
                                    <RoundButton icon={faPlus} onClick={() => setShowRedeemPopup(true)}/>
                                </div>  
                        </div>


                        <div className="user-list-scroll-container">
                            {loadingRdm ? (
                            <div className="loader-container">
                                <div className="spinner" />
                            </div>
                            ) : (
                            redeems.map((rdmItems, index) => (
                              <div className="user-list-item-rdm" key={index}>
                                <DashboardBox>
                                      <div className="user-list-item-tr-inside" onClick={() => handleLeadListClickRedeem(index)}>
                                        
                                            <div className="user-info-tr">
                                                <DateWithIcon text={new Date(rdmItems.redeem_created_at).toLocaleString("en-US", {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    second: "2-digit"
                                                })} >
                                                </DateWithIcon>
                                                <TextView type="subDarkBold" text={rdmItems.notes}/>
                                                 <StatusBadge status={rdmItems.redeem_status==0 ? 0 : rdmItems.redeem_status==1 ? 3 : 4 } />
                                                <TextView type="subDark" text={baseId+rdmItems.redeem_id}/>
                                               
                                            </div> 

                                            <div style={{height: '100%',display: 'flex',justifyContent: 'center',alignItems: 'center',paddingLeft:'10px',paddingRight:'10px',gap:'2px'}}>
                                              <TextView type="darkBold" text={rdmItems.point}/>
                                            </div>
                                            {selectedPosRedeem === index && (
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


        </div>

        {showRedeemPopup && (
            <RedeemPopup
            point = {wallet?.available_point?.user_balance}
            onClose={() => setShowRedeemPopup(false)}
            onSubmit={handleRedeemPopupSubmit}
            />
        )}

    </div>
  )
}

export default WalletMember
