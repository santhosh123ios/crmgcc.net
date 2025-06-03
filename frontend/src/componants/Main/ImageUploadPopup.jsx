import React, { useState } from 'react'
import ImageCropUpload from './ImageCropUpload';
import apiClient from '../../utils/ApiClient';

function ImageUploadPopup({ onClose,userType }) {
  const [uploadStatus, setUploadStatus] = useState(null);

  const handleUploadComplete = (success, data) => {
    if (success) {
      setUploadStatus("Upload image api successful!");
      console.log("Uploaded data:", data);

      ///update_profile_image
      
      updateProfileImage(data);

      
    } 
    else {
      setUploadStatus("Upload failed. Please try again.");
      console.error("Upload error:", data);
    }
  };

  const updateProfileImage = async (data_image) => {
      //(true); // Show loader
      try {

          const payload = {
              profile_img: data_image,
          };

          console.log("SANTYHU data URL :", userType);
          console.log("SANTHOSH USR IS data : "+ data_image);
          
          //console.log("SANTHOSH Vendor ID:", payload);
          const data = await apiClient.post("/"+userType+"/update_profile_image", payload);

          //if (data && data.result?.data.status === 1) {
          if (data?.result?.status === 1) {
            // ✅ Close the popup after a short delay (optional)
            setTimeout(() => {
                if (onClose) onClose();
            }, 500); // or 1000ms if you want a pause
          }
      } catch (err) {
          console.error("Something went wrong fetching vendors", err);
      }
      finally {
          //setisLoading(false); // Hide loader
      }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <ImageCropUpload url={"/"+userType+"/upload"} onUploadComplete={handleUploadComplete} />
        {uploadStatus && <p>{uploadStatus}</p>}
        <div className="popup-actions">
          <button onClick={onClose} className="popup-button-cancel">Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default ImageUploadPopup;