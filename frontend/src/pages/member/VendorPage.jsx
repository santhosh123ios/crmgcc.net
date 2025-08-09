import React,{useEffect,useState} from 'react'
import DashboardBox from '../../componants/Main/DashboardBox'
import apiClient from '../../utils/ApiClient';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InputText from '../../componants/Main/InputText';
import TextView from '../../componants/Main/TextView';
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons'
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import { faGift, faBox } from '@fortawesome/free-solid-svg-icons';

const baseId = import.meta.env.VITE_ID_BASE;
const baseUrl = import.meta.env.VITE_API_BASE_IMG_URL;

function VendorPage() {

    const [loadingVend, setLoadingVend] = useState(false);
    const [vendor, setVendor] = useState([]);
    const [selectedPosVend, setselectedPosVend] = useState(0);
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [activeTab, setActiveTab] = useState('offers'); // New state for tab management
    const [formData, setFormData] = useState({
        search: "",
    })

    const [offers, setOffers] = useState([]);
    const [products, setProducts] = useState([]);
    const [loadingOffers, setLoadingOffers] = useState(false);
    const [loadingProducts, setLoadingProducts] = useState(false);

    useEffect(() => {
        loadVendors();
        loadOffers();
        loadProducts();
    },[]);

    ///API CALLING
    const loadVendors = async () => {
        setLoadingVend(true)
        try {
            const data = await apiClient.get("/member/vendorlist");
            if (data && data.result?.data) {
            setVendor(data.result.data);
            setSelectedVendor(data.result.data[0])
            }
        } catch (err) {
            console.error("Something went wrong fetching vendors", err);
        }
        finally
        {
            setLoadingVend(false)
        }
    };

    const loadOffers = async () => {
        setLoadingOffers(true);
        try {
            const data = await apiClient.get("/member/get_all_offers");
            if (data && data.result?.data) {
                setOffers(data.result.data);
            }
        } catch (err) {
            console.error("Something went wrong fetching offers", err);
        } finally {
            setLoadingOffers(false);
        }
    };

    const loadProducts = async () => {
        setLoadingProducts(true);
        try {
            const data = await apiClient.get("/member/get_all_product");
            if (data && data.result?.data) {
                setProducts(data.result.data);
            }
        } catch (err) {
            console.error("Something went wrong fetching products", err);
        } finally {
            setLoadingProducts(false);
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

    const handleVendorListClick = (index) => {
        setselectedPosVend(index)
        console.log("Clicked index:", index);
        console.log("Clicked Sttaus:", vendor[index].lead_status);
        setSelectedVendor(vendor[index])
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const renderOffersGrid = () => (
        <div className="grid-container">
            {loadingOffers ? (
                <div className="loader-container">
                    <div className="spinner" />
                </div>
            ) : offers.length > 0 ? (
                offers.map((offer) => (
                    <div key={offer.id} className="user-list-item-product">
                        <DashboardBox>
                            <div className="user-list-item-product-inside">
                                <img className="prod-image" src={offer.image ? baseUrl + offer.image : "/dummy.jpg"} alt={offer.title} />
                                <div style={{margin:'5px'}}/>
                                <div className="user-info-leads">
                                    <TextView type='darkBold' text={offer.title} overflow={true} />
                                    <TextView type='dark' text={offer.description} overflow={true}/>
                                    
                                    <div style={{ display: 'flex', justifyContent: 'start', alignItems: 'center', padding: '0px', margin: '0px'}}>
                                        <TextView type='dark' text={"Discount : "+offer.discount+"%"}/>
                                    </div>
                                </div>
                            </div>
                        </DashboardBox>
                    </div>
                ))
            ) : (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#666' }}>
                    <TextView type='dark' text="No offers available" />
                </div>
            )}
        </div>
    );

    const renderProductsGrid = () => (
        <div className="grid-container">
            {loadingProducts ? (
                <div className="loader-container">
                    <div className="spinner" />
                </div>
            ) : products.length > 0 ? (
                products.map((product) => (
                    <div key={product.id} className="user-list-item-product">
                        <DashboardBox>
                            <div className="user-list-item-product-inside">
                                <img className="prod-image" src={product.image ? baseUrl + product.image : "/dummy.jpg"} alt={product.name} />
                                <div style={{margin:'5px'}}/>
                                <div className="user-info-leads">
                                    <TextView type='darkBold' text={product.title} overflow={true} />
                                    <TextView type='dark' text={product.description} overflow={true}/>
                                    
                                    <div style={{ display: 'flex', justifyContent: 'start', alignItems: 'center', padding: '0px', margin: '0px'}}>
                                        <TextView type='dark' text={"Price : "+product?.offer_price}/>
                                        <div style={{margin:'5px'}}/>
                                        <TextView type='dark' text={product?.price} strike={true}/>
                                    </div>
                                </div>
                            </div>
                        </DashboardBox>
                    </div>
                ))
            ) : (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#666' }}>
                    <TextView type='dark' text="No products available" />
                </div>
            )}
        </div>
    );

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


                        <div className="vendor-list-scroll-container">
                            {loadingVend ? (
                            <div className="loader-container">
                                    <div className="spinner" />
                                </div>
                            ) : (
                            vendor.map((vendorItems, index) => (
                              <div className={`vendor-list-item ${selectedPosVend === index ? 'selected' : ''}`} key={index}>
                                <div className="vendor-list-item-content" onClick={() => handleVendorListClick(index)}>
                                    
                                    <div className="vendor-avatar-container">
                                        <img className="vendor-avatar" src={vendorItems.profile_img? baseUrl+vendorItems.profile_img: "/dummy.jpg"} alt={vendorItems.name} />
                                        {selectedPosVend === index && (
                                            <div className="vendor-selection-indicator"/>
                                        )}
                                                </div>
                                    
                                                                        <div className="vendor-info-container">
                                        <TextView type='darkBold' text={vendorItems.name} className="vendor-name"/>
                                        <TextView type='dark' text={vendorItems.email} className="vendor-email"/>
                                        
                                        <div className="vendor-rating">
                                            <span className="rating-stars">★★★★☆</span>
                                            <span className="rating-text">4.5 (120 reviews)</span>
                </div>

                                        <div className="vendor-actions-container">
                                            <button className="vendor-action-btn phone-btn" title="Call">
                                            <FontAwesomeIcon icon={faPhone} />
                                        </button>

                                            <button className="vendor-action-btn lock-btn" title="Call">
                                            <FontAwesomeIcon icon={faLocationDot} />
                                            </button>
                                            <button className="vendor-action-btn exchange-btn" title="Exchange">
                                                <FontAwesomeIcon icon={faExchangeAlt} />
                                        </button>
                                        </div>
                                    </div>
                                    
                                </div>
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
                            <DashboardBox>
                                <div className="comp-item-inside">
                                    {/* Tab Bar */}
                                    <div className="vendor-tab-bar">
                                        <button 
                                            className={`vendor-tab ${activeTab === 'offers' ? 'active' : ''}`}
                                            onClick={() => handleTabClick('offers')}
                                        >
                                            <FontAwesomeIcon icon={faGift} />
                                            <span>Offers</span>
                                        </button>
                                        <button 
                                            className={`vendor-tab ${activeTab === 'products' ? 'active' : ''}`}
                                            onClick={() => handleTabClick('products')}
                                        >
                                            <FontAwesomeIcon icon={faBox} />
                                            <span>Products</span>
                                        </button>
                                    </div>

                                    {/* Tab Content */}
                                    <div className="vendor-tab-content">
                                        {activeTab === 'offers' && renderOffersGrid()}
                                        {activeTab === 'products' && renderProductsGrid()}
                                    </div>
                                </div>
                            </DashboardBox>
                        </div>
        </div>

        </div>
    )
}

export default VendorPage
