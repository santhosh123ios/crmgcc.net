import React, {useState,useEffect} from 'react'
import DashboardBox from '../../componants/Main/DashboardBox'
import apiClient from '../../utils/ApiClient';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons'
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { faPhone } from '@fortawesome/free-solid-svg-icons';

import InputText from '../../componants/Main/InputText';
import DateWithIcon from '../../componants/Main/DateWithIcon';
import TextView from '../../componants/Main/TextView';

const baseId = import.meta.env.VITE_ID_BASE;
const baseUrl = import.meta.env.VITE_API_BASE_IMG_URL;


function TransactionsVendor() {

  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [selectedPosTr, setselectedPosTr] = useState(0);
  const [formData, setFormData] = useState({
        search: ""
  });


  useEffect(() => {
    fetchTransaction();
  },[]);


  ///API CALLING
  const fetchTransaction = async () => {
      setLoading(true);
      try {
      const response = await apiClient.get("/vendor/get_transaction");
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
                                                <DateWithIcon text={new Date(trItems.transaction_created_at).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
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
                        height: '31%',
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '2px'
                        }}>
                        <DashboardBox >
                          <div className='user-list-item-inside'>
                              <img className="user-avatar" src={selectedTransaction?.member_image ? baseUrl+selectedTransaction?.member_image : "/dummy.jpg"} alt={"selectedLead.vendor_name"} /> 
                                {/* <img className="user-avatar" src="http://localhost:8000/uploads/1747778079775.jpg"alt={"uploads"} /> */}
                              <div className="user-info">
                                  <p className="title-text-dark">{selectedTransaction?.member_name ?? "No member name"}</p>
                                  <p className="sub-title-text-dark">{selectedTransaction?.member_email ?? "No member email"}</p>

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
                    

                    {/* Redeem detail view */}
                    <div style={{
                        width: '100%',
                        height: '69%',
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '2px'
                        }}>
                        <DashboardBox>

                          
                          

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
                        

                    </DashboardBox>

                </div>


        </div>

    </div>
  )
}

export default TransactionsVendor
