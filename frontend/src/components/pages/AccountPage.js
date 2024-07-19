import React, { useContext, useEffect } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AccountPage() {
  const searchParams = new URLSearchParams(useLocation().search)
  const error = searchParams.get("login")
  useEffect(()=>{
    if(error){
      toast.error("Please Login First", {
        position: "top-center",
        theme: "colored"
      });
    }
  })
  
  return (
    <>
      <div className="home-page">
        <div className="row padding-0">
            <div className="col-lg-3 col-md-5 padding-0 form-wrap">
              <img className="logo" src="./images/wisper-logo.png"/>
              <Outlet/>
            </div>
            <div className="col-lg-9 col-md-7 padding-0">
              <div className="d-flex padding-0 d-block-sm">
                <div className="login-intro">
                  <h2>Wisper: Your Ultimate Anonymous Chatting Platform!</h2>
                  <p>Wisper allows you to connect and chat with others anonymously. Create an account and choose any random anonymous name during signup, and start engaging in conversations without revealing your identity. <br/>Perfect for those who value privacy and want to express themselves freely. Join Wisper today and experience the world of anonymous chatting!</p>
                </div>
                <div className="login-image">
                  <img src="./images/image-login.png"/>
                </div>
              </div>
            </div>
        </div>
      </div>
    </>
  )
}
