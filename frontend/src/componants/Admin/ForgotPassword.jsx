import '/src/App.css'
import React, { useState, useEffect } from "react";
//import { useNavigate } from 'react-router-dom'
import apiClient from '../../utils/ApiClient';
import Swal from 'sweetalert2';
import LoadingButton from '../Main/LoadingButton';

function ForgotPassword({ email, onSwitchForm }) {

    //const navigate = useNavigate();
    const [erroeMessage, setErroeMessage] = useState(false);
    const [submitButFlag,setSubmitButFlag] = useState(false)

    const [formData, setFormData] = useState({ email: email || "" });


  useEffect(() => {
    setFormData({ email: email || "" });
  }, [email]);

    const handleChange = (e) => {
        setErroeMessage("");
        setFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

    
        const {email} = formData;
        if (!email) {
            alert("Please fill the Email fields.");
            return;
        }

        try {
            setSubmitButFlag(true)
            const payload = {
                email: email,
            };

            const response = await apiClient.post("/admin/send_email_reset_password",payload);
            console.log("SANTHOSSH RESP : "+response?.result);
            if (response?.result?.status === 1) 
            {
                Swal.fire({
                    icon: 'success',
                    title: 'Successfully Send the Email!',
                    text: 'Forgot Password Email sent to your email, please check.',
                    confirmButtonText: 'LOGIN',
                    }).then((result) => {
                    if (result.isConfirmed) {
                        console.log('santhosh User clicked OK');
                         onSwitchForm(0)
                    }
                });
            } 
            else 
            {
                console.warn("No records found or status");
                setErroeMessage("This user does not exist on this system.")
            }
        }
        catch (error) {
            console.error("Error:", error);
        }
        finally
        {
            setSubmitButFlag(false)
        }
    }



  return (
    <div className='reg-form-view'>
        <p className='p-reg-title'>Forgot Password</p>
        <p className='p-reg-sub-title'>Change your password and Enjoy the System</p>
        <div className='input-div-view'>
            <input type="email" placeholder="Email" name="email" value={formData.email}   onChange={handleChange} required />
        </div>
        <LoadingButton onClick={handleSubmit} isLoading={submitButFlag} text={"Submit"} />
        <button className='button-reg-click-title' onClick={() => onSwitchForm(0)}>Do you want to sign in?</button>
        <div className='p-reg-click-title' >{erroeMessage}</div>

    </div>
  )
}

export default ForgotPassword
