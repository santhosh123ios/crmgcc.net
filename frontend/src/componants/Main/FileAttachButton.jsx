import React, { useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperclip } from "@fortawesome/free-solid-svg-icons";
import './Main.css';

function FileAttachButton({ onChange, accept = "*", text = "Attach File", className = "" }) {
    
  const fileInputRef = useRef();
//   const [fileName, setFileName] = useState("");

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      //setFileName("");
    } else {
      //setFileName("");
    }
    if (onChange) onChange(e);
  };

  return (
    <div className={`input-div-views-attach ${className}`} onClick={handleClick}>
      <span className="sub-title-text-dark">
        {/* {text} {fileName && `: ${fileName}`} */}
         {text}
      </span>
      <FontAwesomeIcon icon={faPaperclip} className="attach-icon" />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        className="file-input-hidden"
      />
    </div>
  );
}

export default FileAttachButton



// const [file, setFile] = useState(null);

// const handleFileChange = (e) => {
//     const selected = e.target.files[0];
//     setFile(selected);
//     console.log("Selected file:", selected);
// };

// <FileAttachButton onChange={handleFileChange} text="Upload Document" accept=".pdf,.jpg,.PNG" />