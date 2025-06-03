import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
//import { getCroppedImg } from "./cropUtils"; // helper
import { v4 as uuidv4 } from "uuid";
import { getCroppedImg } from "../../utils/cropUtils";
import apiClient from '../../utils/ApiClient';

function ImageCropUpload({ onUploadComplete, url }) {

    const [image, setImage] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const onCropComplete = useCallback((_, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const onSelectFile = (e) => {
        if (e.target.files && e.target.files.length > 0) {
        const reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.addEventListener("load", () => {
            setImage(reader.result);
        });
        }
    };

    const showCroppedImage = useCallback(async () => {
    try {
      const cropped = await getCroppedImg(image, croppedAreaPixels, uuidv4());

      const formData = new FormData();
      formData.append("file", cropped);

      const response = await apiClient.post(url, formData);

      console.log("Upload successful", response);

      // ✅ Notify parent component
      if (onUploadComplete) {
        onUploadComplete(true, response.filename); // send success flag and data
      }
    } catch (e) {
      console.error(e);
      if (onUploadComplete) {
        onUploadComplete(false, e); // send failure flag and error
      }
    }
  }, [image, croppedAreaPixels, onUploadComplete]);
  return (
    <div>
      <input type="file" accept="image/*" onChange={onSelectFile} />

      {image && (
        <div style={{ position: "relative", width: "100%", height: 400 }}>
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
        </div>
      )}

      {image && (
        <button onClick={showCroppedImage} style={{ marginTop: 10 }}>
          Crop & Upload
        </button>
      )}

      
    </div>
  )
}

export default ImageCropUpload
