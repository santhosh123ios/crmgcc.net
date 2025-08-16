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

function MemberOffers() {
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

    // Generate offer code API call
    const generateOfferCode = async (offerId) => {
        setIsGeneratingCode(true);
        setOfferCodeError(null);
        setGeneratedOfferCode(null);
        
        try {
            const data = await apiClient.post("/member/generate_offer_code", {
                offer_id: offerId
            });
            
            if (data && data.result?.status === 1) {
                setGeneratedOfferCode(data.result.data);
            } else {
                setOfferCodeError(data?.message || "Failed to generate offer code");
            }
        } catch (err) {
            console.error("Error generating offer code:", err);
            setOfferCodeError(err?.response?.data?.message || "Something went wrong while generating offer code");
        } finally {
            setIsGeneratingCode(false);
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
        setShowDetails(false);
        setSelectedItem(null);
    };

    const handleItemClick = (item) => {
        setSelectedItem(item);
        setShowDetails(true);
    };

    const handleRedeemClick = () => {
        if (selectedItem && selectedItem.id) {
            generateOfferCode(selectedItem.id);
            setShowRedeemPopup(true);
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
                                style={{ cursor: 'pointer' }}
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
                                style={{ cursor: 'pointer' }}
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
                            width: showDetails ? '65%' : '100%',
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
                                width: '35%',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                padding: '2px',
                                transition: 'width 0.3s ease'
                            }}>
                                <DashboardBox>
                                    <div className="comp-item-inside">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', width: '100%' }}>
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
                                                    maxWidth: '180px', 
                                                    height: '180px', 
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
                                                <div style={{ marginTop: '5px' }}>
                                                    <TextView type='darkBold' text="Terms & Conditions" style={{ marginBottom: '5px' }} />
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
                                                <div style={{ marginTop: '5px' }}>
                                                    <TextView type='darkBold' text="Terms & Conditions" style={{ marginBottom: '5px' }} />
                                                    <TextView type='dark' text={selectedItem.terms_conditions || 'Standard terms and conditions apply. Please read carefully before proceeding with this product.'} />
                                                </div>
                                            </div>
                                        )}

                                        <div style={{ marginTop: '15px' }}>
                                            <button 
                                                onClick={activeTab === 'offers' ? handleRedeemClick : undefined}
                                                style={{
                                                    width: '100%',
                                                    padding: '1px',
                                                    backgroundColor: 'var(--highlight-color)',
                                                    color: '#000',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    fontWeight: '600'
                                                }}
                                            >
                                                {activeTab === 'offers' ? 'Redeem Now' : 'Create Lead'}
                                            </button>
                                        </div>
                                    </div>
                                </DashboardBox>
                            </div>
                        )}

                        {/* Redeem Popup */}
                        {showRedeemPopup && (
                            <SimplePopup onClose={() => setShowRedeemPopup(false)}>
                                <div style={{ padding: '20px', textAlign: 'center', maxWidth: '400px' }}>
                                    <div style={{ marginBottom: '20px' }}>
                                        <TextView type='darkBold' text="Redeem Offer" style={{ fontSize: '24px' }} />
                                    </div>
                                    
                                    {/* Loading State */}
                                    {isGeneratingCode && (
                                        <div style={{ marginBottom: '20px' }}>
                                            <div className="spinner" style={{ margin: '0 auto' }}></div>
                                            <TextView type='dark' text="Generating offer code..." style={{ marginTop: '10px' }} />
                                        </div>
                                    )}
                                    
                                    {/* Error State */}
                                    {offerCodeError && (
                                        <div style={{ 
                                            marginBottom: '20px', 
                                            padding: '15px', 
                                            backgroundColor: '#f8d7da', 
                                            border: '1px solid #f5c6cb', 
                                            borderRadius: '8px',
                                            color: '#721c24'
                                        }}>
                                            <TextView type='darkBold' text="Error" style={{ marginBottom: '5px' }} />
                                            <TextView type='dark' text={offerCodeError} />
                                        </div>
                                    )}
                                    
                                    {/* Success State - QR Code and Encrypted Code */}
                                    {generatedOfferCode && !offerCodeError && (
                                        <>
                                            {/* QR Code */}
                                            <div style={{ marginBottom: '20px' }}>
                                                <div style={{ 
                                                    display: 'inline-block', 
                                                    padding: '20px', 
                                                    backgroundColor: '#f8f9fa', 
                                                    borderRadius: '12px',
                                                    border: '2px solid #e9ecef'
                                                }}>
                                                    <QRCodeCanvas 
                                                        value={generatedOfferCode.encrypted_code} 
                                                        size={150} 
                                                        bgColor="transparent" 
                                                        fgColor="#000000" 
                                                    />
                                                </div>
                                            </div>
                                            
                                                                                        {/* Encrypted Code */}
                                            <div style={{ marginBottom: '20px' }}>
                                                <TextView type='darkBold' text="Offer Code" style={{ marginBottom: '10px' }} />
                                                <div style={{ 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    justifyContent: 'center',
                                                    gap: '10px',
                                                }}>
                                                    <div style={{ 
                                                        padding: '8px 12px', 
                                                        backgroundColor: '#f8f9fa', 
                                                        borderRadius: '6px',
                                                        border: '1px solid #dee2e6',
                                                        fontFamily: 'monospace',
                                                        fontSize: '16px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        height: '20px'
                                                    }}>
                                                        <TextView type='dark' text={generatedOfferCode.encrypted_code} />
                                                    </div>
                                                    <button 
                                                        onClick={copyEncryptedCode}
                                                        style={{
                                                            backgroundColor: copyStatus === 'Copied!' ? '#28a745' : copyStatus === 'Failed' ? '#dc3545' : '#28a745',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '6px',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '5px',
                                                            height: '40px',
                                                            margin: '10px',
                                                            textAlign: 'center',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                        }}
                                                    >
                                                        <FontAwesomeIcon icon={faCopy} />
                                                        {copyStatus}
                                                    </button>
                                                </div>
                                            </div>
                                            
                                            {/* Valid Until */}
                                            {generatedOfferCode.offer_details && (
                                                <div style={{ 
                                                    marginBottom: '20px', 
                                                    padding: '10px', 
                                                    backgroundColor: '#f8f9fa', 
                                                    borderRadius: '6px',
                                                    textAlign: 'center'
                                                }}>
                                                    <TextView type='dark' text={`Valid until: ${new Date(generatedOfferCode.offer_details.end_date).toLocaleDateString()}`} />
                                                </div>
                                            )}
                                            
                                            {/* Instructions */}
                                            <div style={{ marginBottom: '20px' }}>
                                                <TextView type='dark' text="Show this QR code to the vendor or use the offer code above to redeem your offer." style={{ 
                                                    fontSize: '14px', 
                                                    lineHeight: '1.5',
                                                    color: '#666'
                                                }} />
                                            </div>
                                        </>
                                    )}
                                    
                                    {/* Fallback - Show original discount code if no generated code */}
                                    {!generatedOfferCode && !isGeneratingCode && !offerCodeError && selectedItem?.discount_code && (
                                        <>
                                            {/* QR Code */}
                                            <div style={{ marginBottom: '20px' }}>
                                                <div style={{ 
                                                    display: 'inline-block', 
                                                    padding: '20px', 
                                                    backgroundColor: '#f8f9fa', 
                                                    borderRadius: '12px',
                                                    border: '2px solid #e9ecef'
                                                }}>
                                                    <QRCodeCanvas 
                                                        value={selectedItem.discount_code} 
                                                        size={150} 
                                                        bgColor="transparent" 
                                                        fgColor="#000000" 
                                                    />
                                                </div>
                                            </div>
                                            
                                            {/* Discount Code */}
                                            <div style={{ marginBottom: '20px' }}>
                                                <TextView type='darkBold' text="Discount Code" style={{ marginBottom: '10px' }} />
                                                <div style={{ 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    justifyContent: 'center',
                                                    gap: '10px',
                                                }}>
                                                    <div style={{ 
                                                        padding: '8px 12px', 
                                                        backgroundColor: '#f8f9fa', 
                                                        borderRadius: '6px',
                                                        border: '1px solid #dee2e6',
                                                        fontFamily: 'monospace',
                                                        fontSize: '16px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        height: '20px'
                                                    }}>
                                                        <TextView type='dark' text={selectedItem.discount_code} />
                                                    </div>
                                                    <button 
                                                        onClick={copyDiscountCode}
                                                        style={{
                                                            backgroundColor: copyStatus === 'Copied!' ? '#28a745' : copyStatus === 'Failed' ? '#dc3545' : '#28a745',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '6px',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '5px',
                                                            height: '40px',
                                                            margin: '10px',
                                                            textAlign: 'center',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                        }}
                                                    >
                                                        <FontAwesomeIcon icon={faCopy} />
                                                        {copyStatus}
                                                    </button>
                                                </div>
                                            </div>
                                            
                                            {/* Instructions */}
                                            <div style={{ marginBottom: '20px' }}>
                                                <TextView type='dark' text="Show this QR code to the vendor or use the discount code above to redeem your offer." style={{ 
                                                    fontSize: '14px', 
                                                    lineHeight: '1.5',
                                                    color: '#666'
                                                }} />
                                            </div>
                                        </>
                                    )}
                                    
                                    {/* Close Button */}
                                    <button 
                                        onClick={() => {
                                            setShowRedeemPopup(false);
                                            setGeneratedOfferCode(null);
                                            setOfferCodeError(null);
                                            setIsGeneratingCode(false);
                                        }}
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            backgroundColor: 'var(--highlight-color)',
                                            color: '#000',
                                            border: 'none',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontWeight: '600'
                                        }}
                                    >
                                        Close
                                    </button>
                                </div>
                            </SimplePopup>
                        )}
        </div>

        </div>
    )
}

export default MemberOffers
