import React,{useState,useEffect} from 'react'
import DashboardBox from '../../componants/Main/DashboardBox'
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import InputText from '../../componants/Main/InputText';
import RightSidePopup from '../../componants/Main/RightSidePopup';
import RoundButton from '../../componants/Main/RoundButton';
import TextView from '../../componants/Main/TextView';
import apiClient from '../../utils/ApiClient';
import DotBadge from '../../componants/Main/DotBadge';

function CardAdmin() {


  const [selectedPos, setselectedPos] = useState(0);
  const [loading, setLoading] = useState(true);
  const [cards, setcards] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState({
              search: "",
              card_type_name: "",
              card_type_w_point:"",
              card_type_e_point:"",
              card_profit_margin:""
      });

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
        //setSelectedLead(leads[index])
  };


  //API CALL
  const createCard = async () => {

        //setisLoading(true); // Show loader
        try {

            const payload = {
              card_type_name: formData.card_type_name,
              card_type_e_point: formData.card_type_e_point,
              card_type_w_point: formData.card_type_w_point,
              card_type_status: 1,
              card_profit_margin:formData.card_profit_margin
            };
    
            console.log("SANTHOSH Vendor ID:", payload);
            const data = await apiClient.post("/admin/createcard", payload);

            if (data?.result?.status === 1) {
                //setVendors(data.result.data);
                setShowPopup(false)
                fetchCardDetails();
            }
        } catch (err) {
            console.error("Something went wrong fetching vendors", err);
        }
        finally {
            //setisLoading(false); // Hide loader
        }
  };

  const fetchCardDetails = async () => {
    console.log("SANTHOSH API CALL")
        setLoading(true);
        try {
        const response = await apiClient.get("/admin/get_card_details");

        if (response?.result?.status === 1) {
            setcards(response.result.data);
            //setSelectedLead(response.result.data[0])
        } else {
            console.warn("No leads found or status ");
        }
        } catch (error) {
        console.error("Failed to fetch leads:", error);
        } finally {
        setLoading(false);
        }
    };


     useEffect(() => {

        fetchCardDetails();

        setFormData((prev) => ({
        ...prev,
        }));

        
    },[]);

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
                          paddingRight:'5px'
                          }}> 

                              <InputText 
                                  type="name"
                                  placeholder="Search"
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
                              <RoundButton icon={faPlus} onClick={() => setShowPopup(true)}/>
                          </div>  


                          
                    </div>


                    <div className="user-list-scroll-container">
                          {loading ? (
                          <div className="loader-container">
                              <div className="spinner" />
                          </div>
                          ) : (
                          cards.map((cardItems, index) => (
                              <div className="user-list-item-card" key={index}>
                              <DashboardBox>
                                  <div className={`${selectedPos === index ? "user-list-item-leads-inside-select" : "user-list-item-leads-inside"}`} onClick={() => handleLeadListClick(index)}>
                                    <div className="user-info-leads">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0px', margin: '0px'}}>
                                            <p className="title-text-dark  truncate-text">{cardItems.card_type_name}</p>
                                            <div style={{display:'flex',flexDirection:'row'}}>
                                                <DotBadge status={1} />
                                                <div style={{margin:'2px'}}/>
                                                <TextView type="subDark" text={"Active"}/>
                                            </div>
                                        </div>
                                        <p className="sub-title-text-dark truncate-text">Eligible point : {cardItems.card_type_e_point}</p>
                                        <p className="sub-title-text-dark truncate-text">Welcome point : {cardItems.card_type_w_point}</p>
                                        <p className="sub-title-text-dark truncate-text">Profit Margin : {cardItems.card_profit_margin}</p>
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
                width: '70%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                padding: '2px'
                }}>
                  <DashboardBox></DashboardBox>
              </div>
        </div>

        <RightSidePopup isloading={false} isOpen={showPopup} onClose={() => setShowPopup(false)} 
            onSubmit={() => {
            //setShowPopup(false);
            createCard();
            } }
            >
            <TextView type="darkBold" text={"Create Card Type"}/>
            <div style={{marginTop:'20px'}}></div>
            <InputText placeholder={"Card type name	"} name={"card_type_name"} onChange={handleChange}></InputText>
            <InputText placeholder={"Eligible point"} name={"card_type_e_point"} onChange={handleChange}></InputText>
            <InputText placeholder={"Welcome point"} name={"card_type_w_point"} onChange={handleChange}></InputText>
            <InputText placeholder={"Profit Margin"} name={"card_profit_margin"} onChange={handleChange}></InputText>

        </RightSidePopup>

    </div>
  )
}

export default CardAdmin
