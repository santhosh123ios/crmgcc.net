import React,{useEffect,useState} from 'react'
import DashboardBox from '../../componants/Main/DashboardBox'
import apiClient from '../../utils/ApiClient';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TextView from '../../componants/Main/TextView';
import SimplePopup from '../../componants/Main/SimplePopup';
import { faGift, faBox, faCopy } from '@fortawesome/free-solid-svg-icons';
import { QRCodeCanvas } from "qrcode.react";

const baseId = import.meta.env.VITE_ID_BASE;
const baseUrl = import.meta.env.VITE_API_BASE_IMG_URL;

function Offers() {
  const [loadingVend, setLoadingVend] = useState(false);
    const [vendor, setVendor] = useState([]);
    const [selectedPosVend, setselectedPosVend] = useState(0);
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [activeTab, setActiveTab] = useState('offers'); // New state for tab management
    const [selectedItem, setSelectedItem] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [showRedeemPopup, setShowRedeemPopup] = useState(false);
    const [copyStatus, setCopyStatus] = useState('Copy');
    const [formData, setFormData] = useState({
        search: "",
    })

    const [offers, setOffers] = useState([]);
    const [products, setProducts] = useState([]);
    const [loadingOffers, setLoadingOffers] = useState(false);
    const [loadingProducts, setLoadingProducts] = useState(false);
    
    // New states for offer code generation
    const [generatedOfferCode, setGeneratedOfferCode] = useState(null);
    const [isGeneratingCode, setIsGeneratingCode] = useState(false);
    const [offerCodeError, setOfferCodeError] = useState(null);
    
    // Loading state for status updates
    const [updatingStatus, setUpdatingStatus] = useState(false);

    useEffect(() => {
        //loadVendors();
        loadOffers();
        loadProducts();
    },[]);


    const loadOffers = async () => {
        setLoadingOffers(true);
        try {
            const data = await apiClient.get("/admin/get_all_offers");
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
            const data = await apiClient.get("/admin/get_all_product");
            if (data && data.result?.data) {
                setProducts(data.result.data);
            }
        } catch (err) {
            console.error("Something went wrong fetching products", err);
        } finally {
            setLoadingProducts(false);
        }
    };

  

    const handleVendorListClick = (index) => {
        setselectedPosVend(index)
        console.log("Clicked index:", index);
        console.log("Clicked Sttaus:", vendor[index].lead_status);
        setSelectedVendor(vendor[index])
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        setShowDetails(false);
        setSelectedItem(null);
    };

    const handleItemClick = (item) => {
        setSelectedItem(item);
        setShowDetails(true);
    };

    const handleRedeemClick = () => {
        if (selectedItem && selectedItem.id) {
            //generateOfferCode(selectedItem.id);
            //setShowRedeemPopup(true);
        }
    };

    const updateOfferStatus = async (status, id) => {
        setUpdatingStatus(true);
        try {
            const payload = {
                status: status,
                id: id
            };
            console.log("Updating offer status:", payload);
            const data = await apiClient.post("/admin/update_offer_status", payload);

            if (data?.result?.status === 1) {
                // Refresh the offers list
                loadOffers();
                // Update the selected item if it's the same one
                if (selectedItem && selectedItem.id === id) {
                    setSelectedItem(prev => ({ ...prev, status: status }));
                }
            }
        } catch (err) {
            console.error("Something went wrong updating offer status", err);
        } finally {
            setUpdatingStatus(false);
        }
    };

    const updateProductStatus = async (status, id) => {
        setUpdatingStatus(true);
        try {
            const payload = {
                status: status,
                id: id
            };
            console.log("Updating product status:", payload);
            const data = await apiClient.post("/admin/update_product_status", payload);

            if (data?.result?.status === 1) {
                // Refresh the products list
                loadProducts();
                // Update the selected item if it's the same one
                if (selectedItem && selectedItem.id === id) {
                    setSelectedItem(prev => ({ ...prev, status: status }));
                }
            }
        } catch (err) {
            console.error("Something went wrong updating product status", err);
        } finally {
            setUpdatingStatus(false);
        }
    };

    const copyDiscountCode = async () => {
        if (selectedItem?.discount_code) {
            try {
                await navigator.clipboard.writeText(selectedItem.discount_code);
                setCopyStatus('Copied!');
                setTimeout(() => {
                    setCopyStatus('Copy');
                }, 2000);
            } catch (err) {
                console.error('Failed to copy discount code:', err);
                setCopyStatus('Failed');
                setTimeout(() => {
                    setCopyStatus('Copy');
                }, 2000);
            }
        }
    };

    const copyEncryptedCode = async () => {
        if (generatedOfferCode?.encrypted_code) {
            try {
                await navigator.clipboard.writeText(generatedOfferCode.encrypted_code);
                setCopyStatus('Copied!');
                setTimeout(() => {
                    setCopyStatus('Copy');
                }, 2000);
            } catch (err) {
                console.error('Failed to copy encrypted code:', err);
                setCopyStatus('Failed');
                setTimeout(() => {
                    setCopyStatus('Copy');
                }, 2000);
            }
        }
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
                            <div 
                                className={`user-list-item-product-inside ${selectedItem?.id === offer.id && showDetails ? 'user-list-item-product-inside-selected' : ''}`}
                                onClick={() => handleItemClick(offer)}
                                style={{ cursor: 'pointer', position: 'relative' }}
                            >
                                <img className="prod-image" src={offer.image ? baseUrl + offer.image : "/dummy.jpg"} alt={offer.title} />
                                <div style={{margin:'5px'}}/>
                                <div className="user-info-leads">
                                    <TextView type='darkBold' text={offer.title} overflow={true} />
                                    <TextView type='dark' text={offer.description} overflow={true}/>
                                    
                                    <div style={{ display: 'flex', justifyContent: 'start', alignItems: 'center', padding: '0px', margin: '0px'}}>
                                        <TextView type='dark' text={"Discount : "+offer.discount+"%"}/>
                                    </div>
                                </div>
                                {offer?.status == 0 && (
                                  <div
                                  style={{
                                      position: 'absolute',
                                      top: 0,
                                      left: 0,
                                      width: '100%',
                                      height: '100%',
                                      backgroundColor: 'rgba(255, 255, 255, 0.6)', // semi-transparent white
                                      
                                      zIndex: 5,
                                  }}
                                  />
                              )}
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
                            <div 
                                className={`user-list-item-product-inside ${selectedItem?.id === product.id && showDetails ? 'user-list-item-product-inside-selected' : ''}`}
                                onClick={() => handleItemClick(product)}
                                style={{ cursor: 'pointer', position: 'relative' }}
                            >
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
                                {product?.status == 0 && (
                                  <div
                                  style={{
                                      position: 'absolute',
                                      top: 0,
                                      left: 0,
                                      width: '100%',
                                      height: '100%',
                                      backgroundColor: 'rgba(255, 255, 255, 0.6)', // semi-transparent white
                                      
                                      zIndex: 5,
                                  }}
                                  />
                              )}
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
                            width: showDetails ? '70%' : '100%',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '2px',
                            transition: 'width 0.3s ease'
                        }}>
                            <DashboardBox>
                                <div className="comp-item-inside">
                                    {/* Tab Bar */}
                                    <div className="vendor-tab-bar-member">
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

                        {/* Details Panel */}
                        {showDetails && selectedItem && (
                            <div style={{
                                width: '30%',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                padding: '2px',
                                transition: 'width 0.3s ease'
                            }}>
                                <DashboardBox>
                                    <div className="comp-item-inside">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', width: '100%' }}>
                                            <TextView type='darkBold' text="Details" />
                                            <button 
                                                onClick={() => setShowDetails(false)}
                                                style={{ 
                                                    background: 'none', 
                                                    border: 'none', 
                                                    cursor: 'pointer',
                                                    fontSize: '18px',
                                                    color: '#666',
                                                    width: '10px',
                                                    height: '100%',
                                                    margin: '0px',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    textAlign: 'center',
                                                    padding: '0px',
                                                    backgroundColor: 'transparent',
                                                }}
                                            >
                                                ×
                                            </button>
                                        </div>
                                        
                                        <div style={{ textAlign: 'center', marginBottom: '5px' }}>
                                            <img 
                                                src={selectedItem.image ? baseUrl + selectedItem.image : "/dummy.jpg"} 
                                                alt={selectedItem.title || selectedItem.name} 
                                                style={{ 
                                                    width: '100%', 
                                                    maxWidth: '170px', 
                                                    height: '170px', 
                                                    objectFit: 'cover', 
                                                    borderRadius: '12px' 
                                                }} 
                                            />
                                        </div>

                                        <div style={{ marginBottom: '5px' }}>
                                            <TextView type='darkBold' text={selectedItem.title || selectedItem.name} />
                                            
                                        </div>

                                        {activeTab === 'offers' && (
                                            <div style={{ marginBottom: '5px' }}>
                                                
                                                
                                                <TextView type='darkBold' text={`Discount: ${selectedItem.discount}%`} style={{ color: '#28a745' }} />
                                                {selectedItem.discount_code && (
                                                    <div style={{ marginTop: '5px' }}>
                                                        <TextView type='dark' text={`Code: ${selectedItem.discount_code}`} />
                                                    </div>
                                                )}
                                                <div style={{ marginTop: '5px' }}>
                                                    <TextView type='darkBold' text="Description" style={{ marginBottom: '8px' }} />
                                                    <TextView type='dark' text={selectedItem.description || 'No description available'} />
                                                </div>
                                                <div style={{ marginTop: '15px' }}>
                                                    <TextView type='darkBold' text="Terms & Conditions" style={{ marginBottom: '8px' }} />
                                                    <TextView type='dark' text={selectedItem.terms_conditions || 'Standard terms and conditions apply. Please read carefully before redeeming this offer.'} />
                                                </div>
                                            </div>
                                        )}

                                        {activeTab === 'products' && (
                                            <div style={{ marginBottom: '15px' }}>
                                                <div style={{ display: 'flex', justifyContent: 'left', alignItems: 'center' }}>
                                                    <TextView type='darkBold' text={`Price: ${selectedItem.offer_price}`} style={{ color: '#28a745' }} />
                                                    <TextView type='dark' text={selectedItem.price} style={{ textDecoration: 'line-through' , marginLeft: '5px'}} />
                                                </div>
                                                {selectedItem.category && (
                                                    <div style={{ marginTop: '5px' }}>
                                                        <TextView type='dark' text={`Category: ${selectedItem.category}`} />
                                                    </div>
                                                )}
                                                <div style={{ marginTop: '15px' }}>
                                                    <TextView type='darkBold' text="Description" style={{ marginBottom: '8px' }} />
                                                    <TextView type='dark' text={selectedItem.description || 'No description available'} />
                                                </div>
                                                <div style={{ marginTop: '15px' }}>
                                                    <TextView type='darkBold' text="Terms & Conditions" style={{ marginBottom: '8px' }} />
                                                    <TextView type='dark' text={selectedItem.terms_conditions || 'Standard terms and conditions apply. Please read carefully before proceeding with this product.'} />
                                                </div>
                                            </div>
                                        )}

                                        <div style={{ marginTop: '10px' }}>
                                            <button 
                                                onClick={activeTab === 'offers' ? () => updateOfferStatus((selectedItem?.status === 1 || selectedItem?.status === undefined) ? 0 : 1, selectedItem.id) : 
                                                         activeTab === 'products' ? () => updateProductStatus((selectedItem?.status === 1 || selectedItem?.status === undefined) ? 0 : 1, selectedItem.id) : undefined}
                                                disabled={(activeTab === 'offers' || activeTab === 'products') ? updatingStatus : false}
                                                style={{
                                                    width: '100%',
                                                    padding: '12px',
                                                    backgroundColor: activeTab === 'offers' ? ((selectedItem?.status === 1 || selectedItem?.status === undefined) ? '#dc3545' : '#28a745') : 
                                                                 activeTab === 'products' ? ((selectedItem?.status === 1 || selectedItem?.status === undefined) ? '#dc3545' : '#28a745') : 'var(--highlight-color)',
                                                    color: '#fff',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    cursor: (activeTab === 'offers' || activeTab === 'products') && !updatingStatus ? 'pointer' : 'not-allowed',
                                                    fontWeight: '600',
                                                    transition: 'all 0.2s ease',
                                                    opacity: (activeTab === 'offers' || activeTab === 'products') && updatingStatus ? 0.7 : 1
                                                }}
                                                onMouseEnter={(e) => {
                                                    if ((activeTab === 'offers' || activeTab === 'products') && !updatingStatus) {
                                                        e.target.style.transform = 'translateY(-1px)';
                                                        e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                                                    }
                                                }}
                                                onMouseLeave={(e) => {
                                                    if (activeTab === 'offers' || activeTab === 'products') {
                                                        e.target.style.transform = 'translateY(0)';
                                                        e.target.style.boxShadow = 'none';
                                                    }
                                                }}
                                            >
                                                {activeTab === 'offers' ? (
                                                    updatingStatus ? 'Updating...' : ((selectedItem?.status === 1 || selectedItem?.status === undefined) ? 'Disable' : 'Enable')
                                                ) : activeTab === 'products' ? (
                                                    updatingStatus ? 'Updating...' : ((selectedItem?.status === 1 || selectedItem?.status === undefined) ? 'Disable' : 'Enable')
                                                ) : 'Create Lead'}
                                            </button>
                                        </div>
                                    </div>
                                </DashboardBox>
                            </div>
                        )}
        </div>

        </div>
    )
}

export default Offers
