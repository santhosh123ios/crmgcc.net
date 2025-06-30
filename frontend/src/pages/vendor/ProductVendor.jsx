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

const baseUrl = import.meta.env.VITE_API_BASE_IMG_URL;

function ProductVendor() {


    const [loading, setLoading] = useState(true);
    const [detailPage, setDetailPage] = useState(false);
    const [selectedPosProd, setselectedPosProd] = useState();
    const [selectedProd, setSelectedProd] = useState({});
    const [products, setProducts] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [showImagePopup, setShowImagePopup] = useState(false);
    const [imageUploadType, setImageUploadType] = useState(0);
    const [submitButFlag, setSubmitButFlag] = useState(false);
    const [imageUploadStatus, setImageUploadStatus] = useState("Product Image");
    const [productImage, setProductImage] = useState("");
    

    
    const [formData, setFormData] = useState({
        search: "",

        title: "",
        description: "",
        price: "",
        offer_price: "",
    });

    const [formDataEdit, setFormDataEdit] = useState({
        title: "",
        description: "",
        price: "",
        offer_price: "",
    });


    const handleProductListClick = (index) => {

      console.log("Clicked index:", index);
      if (selectedPosProd == index )
      {
        setDetailPage(false)
        setselectedPosProd()
      }
      else
      {
        setFormDataEdit(products[index]);
        setselectedPosProd(index)
        setSelectedProd(products[index])
        setDetailPage(true)
      }
    };

    const handleImageButton = () => {
        setImageUploadType(0)
        setShowImagePopup(true)
        
    };

    const handleSubmitEdit = () => {
        updateProductDetails()
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
        console.log(selectedProd?.status)
        if(selectedProd?.status == 1)
        {
            updateProductStatus(0)
        }
        else
        {
            updateProductStatus(1)
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
            updateProductImage(data)
            setShowImagePopup(false)
        }
    };

    const onDeleteProduct = () => {
        console.log("SAVE BUTTON ACTION")
        deleteProduct()
    };

    useEffect(() => {
        fetchProducts();
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
    const fetchProducts = async () => {
        setLoading(true);
        try {
        const response = await apiClient.get("/vendor/get_product");
        if (response?.result?.status === 1) 
        {
            console.warn("Get Transaction successfully");
            setProducts(response.result.data);
            if(detailPage)
            {
                setFormDataEdit(response.result.data[selectedPosProd]);
                setSelectedProd(response.result.data[selectedPosProd])
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

    const addProduct = async () => {

        //setisLoading(true); // Show loader
        try {

            const payload = {
            title: formData.title,
            description: formData.description,
            price: formData.price,
            offer_price: formData.offer_price,
            image: productImage 
            };

            console.log("SANTHOSH Vendor ID:", payload);
            const data = await apiClient.post("/vendor/add_product", payload);

            //if (data && data.result?.data.status === 1) {
            if (data?.result?.status === 1) {
                //setVendors(data.result.data);
                setShowPopup(false)
                fetchProducts();
            }

        } catch (err) {
            console.error("Something went wrong fetching vendors", err);
        }
        finally {
            //setisLoading(false); // Hide loader
        }
    };


    const updateProductStatus = async (status) => {
        //setisLoading(true); // Show loader
        console.log(status)
        try {

            const payload = {
                id: selectedProd?.id,
                status: status
            };
            console.log(payload)
            const data = await apiClient.post("/vendor/update_product_status", payload);

            //if (data && data.result?.data.status === 1) {
            if (data?.result?.status === 1) {
                //setVendors(data.result.data);
                ///setShowPopup(false)
                fetchProducts();
            }

        } catch (err) {
            console.error("Something went wrong fetching vendors", err);
        }
        finally {
            //setisLoading(false); // Hide loader
        }
    };

    const updateProductImage = async (image) => {
        //setisLoading(true); // Show loader
        try {
            const payload = {
                id: selectedProd?.id,
                image: image
            };
            console.log(payload)
            const data = await apiClient.post("/vendor/update_product_image", payload);

            if (data?.result?.status === 1) {
                fetchProducts();
            }

        } catch (err) {
            console.error("Something went wrong fetching vendors", err);
        }
        finally {
            //setisLoading(false); // Hide loader
        }
    };

    const deleteProduct = async () => {
        //setisLoading(true); // Show loader
        try {
            const payload = {
                id: selectedProd?.id
            };
            console.log(payload)
            const data = await apiClient.post("/vendor/delete_product", payload);

            if (data?.result?.status === 1) {
                fetchProducts();
            }

        } catch (err) {
            console.error("Something went wrong fetching vendors", err);
        }
        finally {
            //setisLoading(false); // Hide loader
        }
    };


    const updateProductDetails = async () => {
        setSubmitButFlag(true); // Show loader
        try {
            const payload = {
                id: selectedProd?.id,
                title: formDataEdit.title,
                description: formDataEdit.description,
                price: formDataEdit.price,
                offer_price: formDataEdit.offer_price,
            };
            console.log(payload)
            const data = await apiClient.post("/vendor/update_product_details", payload);

            if (data?.result?.status === 1) {
                fetchProducts();
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
                    <TitleView text={"Products"} />
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
                                    products.map((proItems, index) => (
                                        <div className="user-list-item-product" key={index}>
                                            <DashboardBox>
                                                    <div className= {selectedPosProd == index ? "user-list-item-product-inside-selected":"user-list-item-product-inside"} onClick={() => handleProductListClick(index)}>
                                                    
                                                        <img className="prod-image" src={proItems?.image ? baseUrl+proItems.image : "/public/dummy.jpg"} alt={proItems.lead_name} />
                                                        {/* <img className="prod-image" src={prodImg ? prodImg : "/public/dummy.jpg"} alt={proItems.lead_name} /> */}
                                                        <div style={{margin:'5px'}}/>
                                                        <div className="user-info-leads">
                                                            <TextView type='darkBold' text={proItems?.title} overflow ={true} />
                                                            <TextView type='dark' text={proItems?.description} overflow ={true}/>
                                                            
                                                            <div style={{ display: 'flex', justifyContent: 'start', alignItems: 'center', padding: '0px', margin: '0px'}}>
                                                                <TextView type='dark' text={"Price : "+proItems?.offer_price}/>
                                                                <div style={{margin:'5px'}}/>
                                                                <TextView type='dark' text={proItems?.price} strike={true}/>
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
                                    <div style={{position: 'relative', width:'100%', maxWidth:'500px',justifyContent:'center', alignItems:'center'}}>
                                        <img className="prod-image" src={selectedProd?.image ? baseUrl+selectedProd.image : "/public/dummy.jpg"} alt={selectedProd.image} />

                                        <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'row',justifyContent: 'center', alignItems: 'center', zIndex: 1}}>
                                            <RoundButton icon={faPen} onClick={() => handleEditProdImage()} shadow={true} />
                                            <div style={{margin:'5px'}}/>
                                            <RoundButton icon={selectedProd?.status===1?faToggleOn:faToggleOff} iconColor= "white" onClick={() => handleChangeProdStatus()} shadow={true} style={{backgroundColor: selectedProd?.status===1? '#4CAF50' : '#f54b4b' }}/>
                                        </div>
                                    </div>

                                    <InputText placeholder={"Title"} name={"title"} value={formDataEdit.title} onChange={handleChangeEdit}></InputText>
                                    <InputText placeholder={"Description"} name={"description"} value={formDataEdit.description} onChange={handleChangeEdit}></InputText>

                                    <div style={{display:'flex', flexDirection:'row'}}>
                                        <div style={{width:'48%'}}>
                                            <InputText placeholder={"Price"} name={"price"} value={formDataEdit.price} onChange={handleChangeEdit}></InputText>
                                        </div>
                                        <div style={{width:'4%'}}>
                                        </div>

                                        <div style={{width:'48%'}}>
                                            <InputText placeholder={"Offer Price"} name={"offer_price"} value={formDataEdit.offer_price} onChange={handleChangeEdit}></InputText>
                                        </div>
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
                //setShowPopup(false);
                addProduct();
                }}
                >
                <TextView type="darkBold" text={"Create your Product"}/>
                <div style={{marginTop:'20px'}}></div>

                <InputText placeholder={"Title"} name={"title"} onChange={handleChange}></InputText>
                <InputText placeholder={"Description"} name={"description"} onChange={handleChange}></InputText>

                <div style={{display:'flex', flexDirection:'row'}}>
                    <div style={{width:'48%'}}>
                        <InputText placeholder={"Price"} name={"price"} onChange={handleChange}></InputText>
                    </div>
                    <div style={{width:'4%'}}>
                    </div>

                    <div style={{width:'48%'}}>
                        <InputText placeholder={"Offer Price"} name={"offer_price"} onChange={handleChange}></InputText>
                    </div>
                </div>

                <RoundButtonText icon={faPaperclip} text={imageUploadStatus} onClick={handleImageButton}/>

                
            </RightSidePopup>

             {showImagePopup && (
            <ImageUploadPopupCommon onClose={() => handleimageChange()} userType={"vendor"} onImageUploaded={handleImageUploaded} />
        )}
        </div>
    )
}

export default ProductVendor