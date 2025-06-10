import React,{useState} from 'react'
import apiClient from '../../utils/ApiClient';
import Swal from 'sweetalert2';
import { LuEye, LuEyeClosed } from "react-icons/lu";
import '/src/App.css'
import LoadingButton from '../Main/LoadingButton';

function ResetPassword({ onSwitchForm }) {

    const [erroeMessage, setErroeMessage] = useState("");
    const [show, setShow] = useState(false);
    const [submitButFlag,setSubmitButFlag] = useState(false)
    const [formData, setFormData] = useState({ password: "", confirmPassword: "" });

    const handleChange = (e) => {
        setErroeMessage("");
        setFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const {password,confirmPassword} = formData;
        if (!password || !confirmPassword) {
            //alert("Please fill the Password and Confirm Password fields.");
            Swal.fire({
                    icon: 'warning',
                    title: 'Wrong',
                    text: 'Please fill the Password and Confirm Password fields.',
                    confirmButtonText: 'OK',
                    }).then((result) => {
                    if (result.isConfirmed) {
                        console.log('santhosh User clicked OK');
                    }
            });
            return;
        }

        if (password != confirmPassword) {
            Swal.fire({
                    icon: 'warning',
                    title: 'Wrong',
                    text: 'The Password and Confirm Password is not matching.',
                    confirmButtonText: 'OK',
                    }).then((result) => {
                    if (result.isConfirmed) {
                        console.log('santhosh User clicked OK');
                    }
            });
            return;
        }

        try {
            setSubmitButFlag(true)
            const payload = {
                password: password,
            };

            const response = await apiClient.post("/admin/reset_password",payload);
            console.log(response);
            if (response?.result?.status === 1) 
            {
                Swal.fire({
                    icon: 'success',
                    title: 'Successfully',
                    text: 'Successfully Change your Password, Enjoiy the system.',
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
        <p className='p-reg-title'>Change Your Password</p>
        <p className='p-reg-sub-title'>Change your password and Enjoy the System</p>

        <div className='input-div-view-pwd'>
            <input  type={show ? 'text' : 'password'} placeholder="Password" name="password"   onChange={handleChange} required />
            <span className="eye-icon" onClick={() => setShow(!show)}>
                {show ? <LuEyeClosed /> : <LuEye />}
            </span>
        </div>

         <div className='input-div-view-pwd'>
            <input  type={show ? 'text' : 'password'} placeholder="confirm Password" name="confirmPassword"   onChange={handleChange} required />
            <span className="eye-icon" onClick={() => setShow(!show)}>
                {show ? <LuEyeClosed /> : <LuEye />}
            </span>
        </div>


       <LoadingButton onClick={handleSubmit} isLoading={submitButFlag} text={"Submit"} />
        <div className='p-reg-click-title' >{erroeMessage}</div>
    </div>
  )
}

export default ResetPassword
