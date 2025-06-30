import React, { useState } from 'react'
import ImageCropUpload from './ImageCropUpload';

function ImageUploadPopupCommon({ onClose,userType, onImageUploaded }) {
  const [uploadStatus, setUploadStatus] = useState(null);

  const handleUploadComplete = (success, data) => {
    if (success) {
      setUploadStatus("Upload image api successful!");
      console.log("Uploaded data:", data);
      
      ///updateProfileImage(data);
      // Notify parent
      if (onImageUploaded) {
        onImageUploaded(data);  // Pass uploaded image data to parent
      }

    } 
    else {
      setUploadStatus("Upload failed. Please try again.");
      console.error("Upload error:", data);
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

export default ImageUploadPopupCommon