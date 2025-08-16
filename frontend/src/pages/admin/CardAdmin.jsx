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
            {/* Card List */}
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

                        <div style={{
                            width: '100%',
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
                            paddingLeft:'0px'
                        }}> 
                            <RoundButton icon={faPlus} onClick={() => setShowPopup(true)}/>
                        </div>  


                          
                    </div>

                    {/* Cards List */}
                    <div style={{
                        padding: '16px 20px',
                        height: 'calc(100vh - 220px)',
                        overflowY: 'auto'
                    }}>
                        {loading ? (
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: '200px'
                            }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    border: '3px solid #f3f3f3',
                                    borderTop: '3px solid var(--highlight-color)',
                                    borderRadius: '50%',
                                    animation: 'spin 1s linear infinite'
                                }}></div>
                            </div>
                        ) : cards.length === 0 ? (
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '200px',
                                color: '#6c757d',
                                textAlign: 'center'
                            }}>
                                <div style={{
                                    fontSize: '48px',
                                    marginBottom: '16px',
                                    opacity: '0.5'
                                }}>💳</div>
                                <p style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '500' }}>
                                    No card types found
                                </p>
                                <p style={{ margin: 0, fontSize: '14px', opacity: '0.7' }}>
                                    Create your first card type to get started
                                </p>
                            </div>
                        ) : (
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '12px'
                            }}>
                                {cards.map((cardItems, index) => (
                                    <div 
                                        key={index}
                                        onClick={() => handleLeadListClick(index)}
                                        className="card-item-animate"
                                        style={{
                                            cursor: 'pointer',
                                            animationDelay: `${index * 0.1}s`
                                        }}
                                    >
                                        <div className={`card-item-hover ${selectedPos === index ? 'card-item-selected' : ''}`} style={{
                                            backgroundColor: selectedPos === index ? '#fffef7' : '#ffffff',
                                            border: selectedPos === index ? '2px solid var(--highlight-color)' : '1px solid #e9ecef',
                                            borderRadius: '12px',
                                            padding: '16px',
                                            boxShadow: selectedPos === index 
                                                ? '0 4px 20px rgba(248, 211, 7, 0.15)' 
                                                : '0 2px 8px rgba(0, 0, 0, 0.06)',
                                            position: 'relative',
                                            overflow: 'hidden'
                                        }}>
                                            {/* Status Indicator */}
                                            <div style={{
                                                position: 'absolute',
                                                top: 0,
                                                right: 0,
                                                width: '0',
                                                height: '0',
                                                borderStyle: 'solid',
                                                borderWidth: '0 20px 20px 0',
                                                borderColor: selectedPos === index 
                                                    ? 'var(--highlight-color) transparent transparent transparent'
                                                    : '#28a745 transparent transparent transparent'
                                            }}></div>
                                            
                                            {/* Card Header */}
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'flex-start',
                                                marginBottom: '12px'
                                            }}>
                                                <h4 style={{
                                                    margin: 0,
                                                    fontSize: '16px',
                                                    fontWeight: '600',
                                                    color: '#333',
                                                    lineHeight: '1.3',
                                                    flex: 1,
                                                    paddingRight: '16px'
                                                }}>
                                                    {cardItems.card_type_name}
                                                </h4>
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    padding: '4px 8px',
                                                    backgroundColor: selectedPos === index 
                                                        ? 'var(--highlight-color)' 
                                                        : '#e8f5e8',
                                                    borderRadius: '12px',
                                                    fontSize: '11px',
                                                    fontWeight: '500',
                                                    color: selectedPos === index ? '#333' : '#28a745'
                                                }}>
                                                    <div style={{
                                                        width: '6px',
                                                        height: '6px',
                                                        borderRadius: '50%',
                                                        backgroundColor: selectedPos === index ? '#333' : '#28a745'
                                                    }}></div>
                                                    Active
                                                </div>
                                            </div>

                                            {/* Card Details */}
                                            <div style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '8px'
                                            }}>
                                                <div className="card-detail-row" style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    padding: '8px 12px',
                                                    backgroundColor: '#f8f9fa',
                                                    borderRadius: '8px'
                                                }}>
                                                    <span style={{
                                                        fontSize: '13px',
                                                        color: '#6c757d',
                                                        fontWeight: '500'
                                                    }}>Eligible Points</span>
                                                    <span style={{
                                                        fontSize: '14px',
                                                        color: '#333',
                                                        fontWeight: '600'
                                                    }}>{cardItems.card_type_e_point}</span>
                                                </div>
                                                
                                                <div className="card-detail-row" style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    padding: '8px 12px',
                                                    backgroundColor: '#f8f9fa',
                                                    borderRadius: '8px'
                                                }}>
                                                    <span style={{
                                                        fontSize: '13px',
                                                        color: '#6c757d',
                                                        fontWeight: '500'
                                                    }}>Welcome Points</span>
                                                    <span style={{
                                                        fontSize: '14px',
                                                        color: '#333',
                                                        fontWeight: '600'
                                                    }}>{cardItems.card_type_w_point}</span>
                                                </div>
                                                
                                                <div className="card-detail-row" style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    padding: '8px 12px',
                                                    backgroundColor: '#fff3cd',
                                                    borderRadius: '8px',
                                                    border: '1px solid #ffeaa7'
                                                }}>
                                                    <span style={{
                                                        fontSize: '13px',
                                                        color: '#856404',
                                                        fontWeight: '500'
                                                    }}>Profit Margin</span>
                                                    <span style={{
                                                        fontSize: '14px',
                                                        color: '#856404',
                                                        fontWeight: '600'
                                                    }}>{cardItems.card_profit_margin}%</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </DashboardBox>
            </div>
            
            {/* Selected Card details */}
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
