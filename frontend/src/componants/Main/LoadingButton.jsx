// components/LoadingButton.jsx
import React from "react";
import "./Main.css";

const LoadingButton = ({ onClick, isLoading, text }) => {
  return (
    <div className={isLoading? "button-div-view-load" : "button-div-view"} onClick={!isLoading ? onClick : null}>
      {isLoading ? (
        <div className="loader"></div>
      ) : (
        text
      )}
    </div>
  );
};

export default LoadingButton;


//  <LoadingButton onClick={handleSubmit} isLoading={submitButFlag} text={"Submit"} />