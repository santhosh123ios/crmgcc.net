import React from 'react'
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
const baseUrl = import.meta.env.VITE_API_BASE_URL;

function VerifyEmail() {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
       
        const token = params.get("exp");

        if (token) 
        {
            verifyEmail(token);
        } 
        else 
        {
            console.error("Missing ID or token");
        }
    }, [location]);

    const verifyEmail = async (token) => {
    try {
      const response = await fetch(`${baseUrl}/admin/email-verification`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // pass JWT properly
        }
      });

      if (!response.ok) {
        throw new Error("Failed to verify email");
      }

      const data = await response.json();
      console.log("Verification success:", data);
      // Optionally redirect or show a message
       navigate("/login");
    } catch (error) {
      console.error("Verification error:", error);
    }
  };


  return (
    <div>
      Verifying the email, Please wait.....
    </div>
  )
}

export default VerifyEmail
