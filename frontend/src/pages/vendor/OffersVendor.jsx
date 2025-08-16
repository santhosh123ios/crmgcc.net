import React, {useState,useEffect} from 'react'
import RoundButton from '../../componants/Main/RoundButton';
import { faPlus,faPaperclip,faPen,faToggleOn,faToggleOff } from '@fortawesome/free-solid-svg-icons';
import TitleView from '../../componants/Main/TitleView';
import apiClient from '../../utils/ApiClient';
import DashboardBox from '../../componants/Main/DashboardBox';
import TextView from '../../componants/Main/TextView';
import RightSidePopup from '../../componants/Main/RightSidePopup';
import InputText from '../../componants/Main/InputText';
import RoundButtonText from '../../componants/Main/RoundButtonText';
import ImageUploadPopupCommon from '../../componants/Main/ImageUploadPopupCommon';
import CommonButton from '../../componants/Main/CommonButton';
import LoadingButton from '../../componants/Main/LoadingButton';
import CommonDatePicker from '../../componants/Main/CommonDatePicker';
import { dateConvert } from '../../utils/dateConvert';

const baseUrl = import.meta.env.VITE_API_BASE_IMG_URL;


function OffersVendor() {

  const [loading, setLoading] = useState(true);
    const [detailPage, setDetailPage] = useState(false);
    const [selectedPosOffer, setselectedPosOffer] = useState();
    const [selectedOffer, setSelectedOffer] = useState({});
    const [offers, setOffers] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [showImagePopup, setShowImagePopup] = useState(false);
    const [imageUploadType, setImageUploadType] = useState(0);
    const [submitButFlag, setSubmitButFlag] = useState(false);
    const [imageUploadStatus, setImageUploadStatus] = useState("Product Image");
    const [productImage, setProductImage] = useState("");

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    const [startDateSelected, setStartDateSelected] = useState(new Date());
    const [endDateSelected, setEndDateSelected] = useState(new Date());
    

    
    const [formData, setFormData] = useState({
        search: "",

        title: "",
        description: "",
        discount: "",
        discount_code: "",
    });

    const [formDataEdit, setFormDataEdit] = useState({
        title: "",
        description: "",
        discount: "",
        discount_code: "",
    });


    const handleProductListClick = (index) => {

      console.log("Clicked index:", index);
      if (selectedPosOffer == index )
      {
        setDetailPage(false)
        setselectedPosOffer()
      }
      else
      {
        setFormDataEdit(offers[index]);
        setselectedPosOffer(index)
        setSelectedOffer(offers[index])
        setStartDateSelected(offers[index].start_date)
        setEndDateSelected(offers[index].end_date)
        setDetailPage(true)
      }
    };

    const handleImageButton = () => {
        setImageUploadType(0)
        setShowImagePopup(true)
        
    };

    const handleSubmitEdit = () => {
        updateOfferDetails()
    };

    const handleimageChange = () => {
        setShowImagePopup(false)
    };

    const handleEditProdImage = () => {
        console.log("EDIT IMAGE BUTTON ACTION")
        setImageUploadType(1)
        setShowImagePopup(true)
    };

    const handleChangeProdStatus = () => {
        console.log("SAVE BUTTON ACTION")
        console.log(selectedOffer?.status)
        if(selectedOffer?.status == 1)
        {
            updateOfferStatus(0)
        }
        else
        {
            updateOfferStatus(1)
        }  
    };

    

    const handleImageUploaded = (data) => {
        if (imageUploadType==0)
        {
            setShowImagePopup(false)
            setImageUploadStatus("Product Image Uploaded ✅")
            setProductImage(data);
        }
        else
        {
            updateOfferImage(data)
            setShowImagePopup(false)
        }
    };

    const onDeleteProduct = () => {
        console.log("SAVE BUTTON ACTION")
        deleteOffer()
    };

    useEffect(() => {
        fetchOffers();
    },[]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
        ...prev,
        [name]: value,
        }));
    };

    const handleChangeEdit = (e) => {
        const { name, value } = e.target;
        setFormDataEdit(prev => ({
            ...prev,
            [name]: value,
        }));
    };

     ///API CALLING
    const fetchOffers = async () => {
        setLoading(true);
        try {
        const response = await apiClient.get("/vendor/get_offers");
        if (response?.result?.status === 1) 
        {
            console.warn("Get Offer successfully");
            setOffers(response.result.data);
            if(detailPage)
            {
                setFormDataEdit(response.result.data[selectedPosOffer]);
                setSelectedOffer(response.result.data[selectedPosOffer])
            }
        } 
        else {
            console.warn("No Transaction found or status != 1");
        }
        } catch (error) {
        console.error("Failed to fetch Transaction:", error);
        } finally {
        setLoading(false);
        }
    };

    const addOffer = async () => {

      console.log(dateConvert(startDate))

        //setisLoading(true); // Show loader
        try {

            const payload = {
            title: formData.title,
            description: formData.description,
            discount: formData.discount,
            discount_code: formData.discount_code,
            image: productImage,
            start_date: dateConvert(startDate),
            end_date: dateConvert(endDate) 
            };

            console.log("SANTHOSH Vendor ID:", payload);
            const data = await apiClient.post("/vendor/add_offers", payload);

            //if (data && data.result?.data.status === 1) {
            if (data?.result?.status === 1) {
                //setVendors(data.result.data);
                setShowPopup(false)
                fetchOffers();
            }

        } catch (err) {
            console.error("Something went wrong fetching vendors", err);
        }
        finally {
            //setisLoading(false); // Hide loader
        }
    };


    const updateOfferStatus = async (status) => {
        //setisLoading(true); // Show loader
        console.log(status)
        try {

            const payload = {
                id: selectedOffer?.id,
                status: status
            };
            console.log(payload)
            const data = await apiClient.post("/vendor/update_offer_status", payload);

            //if (data && data.result?.data.status === 1) {
            if (data?.result?.status === 1) {
                //setVendors(data.result.data);
                ///setShowPopup(false)
                fetchOffers();
            }

        } catch (err) {
            console.error("Something went wrong fetching vendors", err);
        }
        finally {
            //setisLoading(false); // Hide loader
        }
    };

    const updateOfferImage = async (image) => {
        //setisLoading(true); // Show loader
        try {
            const payload = {
                id: selectedOffer?.id,
                image: image
            };
            console.log(payload)
            const data = await apiClient.post("/vendor/update_offer_image", payload);

            if (data?.result?.status === 1) {
                fetchOffers();
            }

        } catch (err) {
            console.error("Something went wrong fetching vendors", err);
        }
        finally {
            //setisLoading(false); // Hide loader
        }
    };

    const deleteOffer = async () => {
        //setisLoading(true); // Show loader
        try {
            const payload = {
                id: selectedOffer?.id
            };
            console.log(payload)
            const data = await apiClient.post("/vendor/delete_offer", payload);

            if (data?.result?.status === 1) {
                fetchOffers();
            }

        } catch (err) {
            console.error("Something went wrong fetching vendors", err);
        }
        finally {
            //setisLoading(false); // Hide loader
        }
    };


    const updateOfferDetails = async () => {
        setSubmitButFlag(true); // Show loader
        try {
            const payload = {
                id: selectedOffer?.id,
                title: formDataEdit.title,
                description: formDataEdit.description,
                discount: formDataEdit.discount,
                discount_code: formDataEdit.discount_code,
                start_date: dateConvert(startDateSelected),
                end_date: dateConvert(endDateSelected),
            };
            console.log(payload)
            const data = await apiClient.post("/vendor/update_offer_details", payload);

            if (data?.result?.status === 1) {
                fetchOffers();
            }

        } catch (err) {
            console.error("Something went wrong fetching vendors", err);
        }
        finally {
             setSubmitButFlag(false); // Hide loader
        }
    };


    ////
    ///const items = Array.from({ length: 35 }, (_, i) => `Item ${i + 1}`);

  return (
        <div className='content-view'>
            <div style={{
                display: 'flex',
                justifyContent: 'start',
                alignItems: 'center',
                marginBottom:'10px',
                width:'100%'
                }}>
                <div>
                    <TitleView text={"Offers"} />
                </div>
                 <div style={{margin:'5px'}}/>
                <div style={{width:'80px'}}>
                    <RoundButton icon={faPlus} onClick={() => setShowPopup(true) }/>          
                </div>
                
            </div>

            <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'row'
                }}>


                    <div style={{
                    width: detailPage?'70%':'100%',
                    height: '100%',
                    backgroundColor: '#00000', 
                        }}>
                            <div className="grid-container">
                                {loading ? (
                                <div className="loader-container">
                                    <div className="spinner" />
                                </div>
                                ) : (
                                    offers.map((proItems, index) => (
                                        <div className="user-list-item-product" key={index}>
                                            <DashboardBox>
                                                    <div className= {selectedPosOffer == index ? "user-list-item-product-inside-selected":"user-list-item-product-inside"} onClick={() => handleProductListClick(index)}>
                                                    
                                                        <img className="prod-image" src={proItems?.image ? baseUrl+proItems?.image : "/public/dummy.jpg"} alt={proItems?.image} />
                                                        {/* <img className="prod-image" src={prodImg ? prodImg : "/public/dummy.jpg"} alt={proItems.lead_name} /> */}
                                                        <div style={{margin:'5px'}}/>
                                                        <div className="user-info-leads">
                                                            <TextView type='darkBold' text={proItems?.title} overflow ={true} />
                                                            <TextView type='dark' text={proItems?.description} overflow ={true}/>
                                                            
                                                            <div style={{ display: 'flex', justifyContent: 'start', alignItems: 'center', padding: '0px', margin: '0px'}}>
                                                                <TextView type='dark' text={"Discount : "+proItems?.discount+"%"}/>
                                                                
                                                            </div>
                                                        </div>
                                                        
                                                        {proItems?.status == 0 && (
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
                                )}
                            </div>


                    </div>

                    <div style={{
                    width: detailPage?'30%':'0%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    paddingLeft:'10px'
                        }}>
                        <DashboardBox>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height:'100%',width:'100%' }}>
                                <div className="product-details-inside" >
                                    <div style={{position: 'relative', width:'200px', maxWidth:'500px',justifyContent:'center', alignItems:'center'}}>
                                        <img className="offer-image" src={selectedOffer?.image ? baseUrl+selectedOffer.image : "/public/dummy.jpg"} alt={selectedOffer.image} />

                                        <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'row',justifyContent: 'center', alignItems: 'center', zIndex: 1}}>
                                            <RoundButton icon={faPen} onClick={() => handleEditProdImage()} shadow={true} />
                                            <div style={{margin:'5px'}}/>
                                            <RoundButton icon={selectedOffer?.status===1?faToggleOn:faToggleOff} iconColor= "white" onClick={() => handleChangeProdStatus()} shadow={true} style={{backgroundColor: selectedOffer?.status===1? '#4CAF50' : '#f54b4b' }}/>
                                        </div>
                                    </div>

                                    <InputText placeholder={"Title"} name={"title"} value={formDataEdit.title} onChange={handleChangeEdit}></InputText>
                                    <InputText placeholder={"Description"} name={"description"} value={formDataEdit.description} onChange={handleChangeEdit}></InputText>
                                    <div style={{
                                        width: '100%',
                                        display: 'flex',
                                        flexDirection: 'row',
                                        gap: '10px',
                                        marginTop: '0px',
                                        justifyContent: 'space-between',
                                        padding: '0px',
                                    }}>
                                        <InputText placeholder={"Discount (%)"} name={"discount"} value={formDataEdit.discount} onChange={handleChangeEdit}></InputText>
                                        <InputText placeholder={"Discount Code"} name={"discount_code"} value={formDataEdit.discount_code} onChange={handleChangeEdit}></InputText>
                                    </div>

                                    <div style={{
                                        width: '100%',
                                        display: 'flex',
                                        flexDirection: 'row',
                                        gap: '0px',
                                        marginTop: '0px',
                                        justifyContent: 'space-between',
                                        padding: '0px',
                                    }}>
                                        <CommonDatePicker
                                            label="Start Date"
                                            selectedDate={startDateSelected}
                                            onChange={date => setStartDateSelected(date)}
                                        />


                                        <CommonDatePicker
                                            label="End Date"
                                            selectedDate={endDateSelected}
                                            onChange={date => setEndDateSelected(date)}
                                        />
                                    </div>
                                    
                                    <div style={{margin:'1px'}}></div>
                                    <LoadingButton onClick={handleSubmitEdit} isLoading={submitButFlag} text={"Save"} />
                                    <CommonButton text="Delete" color="var(--red)" onClick={onDeleteProduct} />

                                    
                                    
                                </div>
                            </div>
                        </DashboardBox> 
                    </div>

            </div>

            <RightSidePopup isOpen={showPopup} onClose={() => setShowPopup(false)} 
                onSubmit={() => {
                addOffer();
                }}
                >
                <TextView type="darkBold" text={"Create your Offer"}/>
                <div style={{marginTop:'20px'}}></div>

                <InputText placeholder={"Title"} name={"title"} onChange={handleChange} maxLength={30}></InputText>
                <InputText placeholder={"Description"} name={"description"} onChange={handleChange} maxLength={150}></InputText>

                <InputText placeholder={"Discount (%)"} name={"discount"} onChange={handleChange}></InputText>
                <InputText placeholder={"Discount Code"} name={"discount_code"} onChange={handleChange}></InputText>
                
                 <CommonDatePicker
                    label="Start Date"
                    selectedDate={startDate}
                    onChange={date => setStartDate(date)}
                 />


                 <CommonDatePicker
                    label="End Date"
                    selectedDate={endDate}
                    onChange={date => setEndDate(date)}
                 />

                <RoundButtonText icon={faPaperclip} text={imageUploadStatus} onClick={handleImageButton}/>

                
            </RightSidePopup>

             {showImagePopup && (
            <ImageUploadPopupCommon onClose={() => handleimageChange()} userType={"vendor"} onImageUploaded={handleImageUploaded} />
        )}
        </div>
    )
}

export default OffersVendor
