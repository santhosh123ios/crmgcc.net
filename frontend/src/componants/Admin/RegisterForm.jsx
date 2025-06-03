import React from 'react'
import { useState,useEffect } from 'react';
import { LuEye, LuEyeClosed } from "react-icons/lu";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
const baseUrl = import.meta.env.VITE_API_BASE_URL;

//import axios from 'axios';

function RegisterForm({ onSwitchForm }) {

   const navigate = useNavigate();
   const [show, setShow] = useState(false);
   const [userType, setUserType] = useState(2);
   const [erroeMessage, setErroeMessage] = useState("");
   const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    user_type: 2
  });

    useEffect(() => {
        setFormData((prev) => ({
        ...prev,
        user_type: userType
        }));
    }, [userType]);

  const handleChange = (e) => {
        setErroeMessage("");
        setFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
        }));
  };

   const handleSubmit = async (e) => {
        e.preventDefault();

    
    const { name, phone, email, password } = formData;
    if (!name || !phone || !email || !password) {
        alert("Please fill in all required fields.");
        return;
    }

    try {
        const response = await fetch(`${baseUrl}/admin/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        });

        if (response.ok) 
        {
            const text = await response.text();
            const data = text ? JSON.parse(text) : {};
            console.log("Success:", data);
            setErroeMessage("");

            const respEmail = await fetch(`${baseUrl}/admin/send-email-verification`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
            user_id: data.result.data.id,  // or email, depending on your backend
            email: data.result.data.email,
            user_type:data.result.data.user_type,
            }),
            });

            if(respEmail.ok) 
            {
                const text = await respEmail.text();
                const dataEmail = text ? JSON.parse(text) : {};
                console.log("Success Send Email Verification : ", dataEmail);
                Swal.fire({
                    icon: 'success',
                    title: 'Success Send Email Verification!',
                    text: 'Email verification sent to your email, please check.',
                    confirmButtonText: 'LOGIN',
                    }).then((result) => {
                    if (result.isConfirmed) {
                        console.log('santhosh User clicked OK');
                        navigate("/login");
                    }
                });
            }
            else
            {
                console.error("Server returned an error:", respEmail.status);
            }
        
        } 
        else 
        {
            const text = await response.text();
            const data = text ? JSON.parse(text) : {};
            const message = data?.error?.[0]?.message || "Registration failed.";
            setErroeMessage(message);
            console.error("Server returned an error:", response.status);
        }

    } catch (error) {
        console.error("Error:", error);
    }
         
  };

  return (
    <div className='reg-form-view'>
        <div className='swtch-div-view'>
              <div  className={userType === 2 ? 'swtch-div-view-tab-selected' : 'swtch-div-view-tab'}
               onClick={() => setUserType(2)} required>Member</div>

              <div className={userType === 3 ? 'swtch-div-view-tab-selected' : 'swtch-div-view-tab'}
               onClick={() => setUserType(3)} required>Vendor</div>
        </div>

        <p className='p-reg-title'>Create an account</p>
        <p className='p-reg-sub-title'>Sing up and earn points and rewards</p>
        
        <div className='input-div-view'>
            <input type="text" placeholder="Full Name" name="name"   onChange={handleChange} required />
        </div>

        <div className='input-div-view'>
            <input type="email" placeholder="Email" name="email"   onChange={handleChange} required />
        </div>

        <div className='input-div-view'>
            <input type="phone" placeholder="Phone" name="phone"   onChange={handleChange} required />
        </div>

        <div className='input-div-view-pwd'>
            <input  type={show ? 'text' : 'password'} placeholder="Password" name="password"   onChange={handleChange} required />
            <span className="eye-icon" onClick={() => setShow(!show)}>
        {show ? <LuEyeClosed /> : <LuEye />}
      </span>
        </div>

        <button className='button-div-view' onClick={handleSubmit}>
            Submit
        </button>

        <button className='button-reg-click-title' onClick={onSwitchForm}>Have any account? Sing in</button>

         <p className='p-reg-click-title' onClick={onSwitchForm}>{erroeMessage}</p>

    </div>
  )
}

export default RegisterForm
