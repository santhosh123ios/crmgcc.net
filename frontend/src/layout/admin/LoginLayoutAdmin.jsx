import React from 'react'
import { useState } from 'react';
import '/src/App.css'
import LoginForm from '../../componants/Admin/LoginForm'
import RegisterForm from '../../componants/Admin/RegisterForm'


export default function LoginLayoutAdmin() {

  //const [selected, setSelected] = useState('register');

   const [showLogin, setShowLogin] = useState(true);
   const toggleForm = () => {
    setShowLogin(!showLogin);
   };

  // const renderContent = () => {
  //   switch (selected) {
  //     case 'login':
  //       return <LoginForm selected={selected} setSelected={setSelected} />;
  //     case 'register':
  //       return <RegisterForm selected={selected} setSelected={setSelected} />;
  //     default:
  //       return <LoginForm selected={selected} setSelected={setSelected} />;
  //   }
  // };

  return (
    <div className='img-bg'>
     <div className='img-bg-part-a'>
        {showLogin ? (
        <LoginForm onSwitchForm={toggleForm} />
      ) : (
        <RegisterForm onSwitchForm={toggleForm} />
      )}
     </div>

     <div className='img-bg-part-b'>
      <div className='login-banner-view'>
        <img className='login-banner-img' 
        src="https://blog.advantageclub.co/wp-content/uploads/2023/10/Point-based-rewards-system.webp" 
        alt="My Image" />
      </div>
        
     </div>

    </div>
  )
}
