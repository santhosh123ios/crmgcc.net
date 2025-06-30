import React,{useState,useEffect} from 'react'
import DashboardBox from '../../componants/Main/DashboardBox'
import RoundButton from '../../componants/Main/RoundButton'
import { faPlus,faPen,faToggleOn,faToggleOff } from '@fortawesome/free-solid-svg-icons';
import InputText from '../../componants/Main/InputText';
import apiClient from '../../utils/ApiClient';
import CommonPopup from '../../componants/Main/CommonPopup';
import TextView from '../../componants/Main/TextView';

function SettingsGeneral() {


  const [showPopup, setShowPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [loadingCat, setLoadingCat] = useState(true);
  const [catEditId, setCatEditId] = useState(0);
  const [cat, setCat] = useState([]);
  
  const [formData, setFormData] = useState({
                search: "",
                catName:"",
                catEditName:""
  });

  useEffect(() => {
    getCategory();
  },[]);

  const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
      ...prev,
      [name]: value,
      }));
  };

  const handlePopupSubmit = () => {
       createCategory()
  };

  const handleEditPopupSubmit = () => {
    editCategory()
  };

  const handleUpdateCategory = (id,status) => {
    if (status==1)
    {
      updateCategory(id,0)
    }
    else
    {
      updateCategory(id,1)
    }
       
  };

  const handleEditCategory = (id,name) => {
    setCatEditId(id)
    setFormData(prev => ({
      ...prev,
      catEditName: name
    }));
    setShowEditPopup(true)
  }

  const handleCatListClick = (index) => {
        //setselectedPos(index)
        console.log("Clicked index:", index);
        //setSelectedLead(leads[index])
  };



  /////API CALL
  const createCategory = async () => {
      //(true); // Show loader
      try {

          const payload = {
              name: formData.catName,
          };

          console.log("SANTHOSH payload: "+payload)
          
          //console.log("SANTHOSH Vendor ID:", payload);
          const data = await apiClient.post("/admin/create_category", payload);

          //if (data && data.result?.data.status === 1) {
          if (data?.result?.status === 1) {
                getCategory();
                
          }
      } catch (err) {
          console.error("Something went wrong fetching vendors", err);
      }
      finally {
          //setisLoading(false); // Hide loader
      }
  };

  const getCategory = async () => {

      setLoadingCat(true);
      try {
      const response = await apiClient.get("/admin/get_categorys");
      if (response?.result?.status === 1) {
          console.warn("Get Transaction successfully");
          setCat(response.result.data);
          setLoadingCat(false)
          setShowEditPopup(false)

      } else {
          console.warn("No Transaction found or status != 1");
      }
      } catch (error) {
      console.error("Failed to fetch Transaction:", error);
      } finally {
      setLoadingCat(false);
      setShowPopup(false)
      }
  };

  const updateCategory = async (id,status) => {
      //(true); // Show loader
      try {

          const payload = {
              id: id,
              status:status
          };

          console.log("SANTHOSH payload: "+payload)
          
          //console.log("SANTHOSH Vendor ID:", payload);
          const data = await apiClient.post("/admin/update_category", payload);

          //if (data && data.result?.data.status === 1) {
          if (data?.result?.status === 1) {
                getCategory();
                
          }
      } catch (err) {
          console.error("Something went wrong fetching vendors", err);
      }
      finally {
          //setisLoading(false); // Hide loader
      }
  };


  const editCategory = async () => {
      //(true); // Show loader
      try {

          const payload = {
              id: catEditId,
              name: formData.catEditName
          };

          console.log("SANTHOSH payload: "+payload)
          
          //console.log("SANTHOSH Vendor ID:", payload);
          const data = await apiClient.post("/admin/edit_category", payload);

          //if (data && data.result?.data.status === 1) {
          if (data?.result?.status === 1) {
                getCategory();
                
          }
      } catch (err) {
          console.error("Something went wrong fetching vendors", err);
      }
      finally {
          //setisLoading(false); // Hide loader
      }
  };






  return (
    <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'row',
            padding: '0px',
            boxSizing:'border-box'
          }}>

            <div style={{
              width: '40%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              padding: '0px',
              marginRight:'5px'
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
                          paddingRight:'5px'
                          }}> 

                              <InputText 
                                  type="name"
                                  placeholder="Search category"
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
                          {loadingCat ? (
                          <div className="loader-container">
                              <div className="spinner" />
                          </div>
                          ) : (
                          cat.map((catItems, index) => (
                              <div style={{paddingLeft:'10px', paddingRight:'10px', paddingTop:'5px'}}  key={index}>
                                <DashboardBox>
                                  <div className={"user-list-item-leads-inside"} onClick={() => handleCatListClick(index)}>
                                    <div className="user-info-leads">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0px', margin: '0px'}}>
                                            <TextView type="darkBold" text={catItems?.name}/>
                                            <div style={{display:'flex',flexDirection:'row'}}>
                                                <RoundButton icon={faPen} onClick={() => handleEditCategory(catItems?.id, catItems?.name)} shadow={true} />
                                                <div style={{margin:'5px'}}/>
                                                <RoundButton icon={catItems?.status===1?faToggleOn:faToggleOff} iconColor= "white" onClick={() => handleUpdateCategory(catItems?.id, catItems?.status)} shadow={true} style={{backgroundColor: catItems?.status===1? '#4CAF50' : '#f54b4b' }}/>
                                            </div>
                                        </div>
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
              width: '60%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              padding: '0px',
            }}>
                <DashboardBox>
                    <div style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'row',
                        padding: '0px',
                        borderBlock:'boxSizing'}}>

                    </div>
                </DashboardBox>
            </div>

            {showPopup && (
              <CommonPopup onClose={() => setShowPopup(false)} onSubmit={handlePopupSubmit}>
                <TextView type="darkBold" text={"Create the Category"}/>
                
                <input
                  type="text"
                  name="catName"
                  value={formData.catName}
                  onChange={handleChange}
                  placeholder="Enter Category Name"
                  className="popup-input"
                />
              </CommonPopup>
            )}

            {showEditPopup && (
              <CommonPopup onClose={() => setShowEditPopup(false)} onSubmit={handleEditPopupSubmit}>
                <TextView type="darkBold" text={"Edit the Category"}/>
                
                <input
                  type="text"
                  name="catEditName"
                  value={formData.catEditName}
                  onChange={handleChange}
                  placeholder="Edit Category Name"
                  className="popup-input"
                />
              </CommonPopup>
            )}


            
    </div>
  )
}

export default SettingsGeneral