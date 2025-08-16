import React from 'react'
import { useState,useEffect } from 'react';
import '/src/App.css'
import LoginForm from '../../componants/Admin/LoginForm'
import RegisterForm from '../../componants/Admin/RegisterForm'
import ForgotPassword from '../../componants/Admin/ForgotPassword'
import ResetPassword from '../../componants/Admin/ResetPassword';
import { useLocation } from "react-router-dom";


export default function LoginLayoutAdmin() {

  const location = useLocation();

  const [showLogin, setShowLogin] = useState(0);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("exp");
    const type = parseInt(params.get("type"), 10);
    localStorage.setItem("authToken", token);
    console.log("SANTHOSH TYPE IS : "+type)
    setShowLogin(type);


}, [location]);

  const renderComponent = () => {
    switch (showLogin) {
      case 0:
        return <LoginForm onSwitchForm={setShowLogin} setEmailId={setEmail} />;
      case 1:
        return <RegisterForm onSwitchForm={setShowLogin} />;
      case 2:
        return <ForgotPassword onSwitchForm={setShowLogin} email={email} />;
      case 3:
        return <ResetPassword onSwitchForm={setShowLogin} email={email} />;
      default:
        return <LoginForm onSwitchForm={setShowLogin} setEmailId={setEmail} />;
    }
  };

  return (
    <div className='img-bg'>
     <div className='img-bg-part-a'>
      {/* <ForgotPassword onSwitchForm={setShowLogin} /> */}
      {renderComponent()}
     </div>

     <div className='img-bg-part-b'>
      <div className='login-banner-view'>
        <img className='login-banner-img' 
        src="https://www.jobsoid.com/wp-content/uploads/2025/02/3-reasons-why-candidate-experience-is-important.png" 
        alt="My Image" />
      </div>
        
     </div>

    </div>
  )
}
