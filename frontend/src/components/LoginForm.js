import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';


export default function LoginForm() {
  const navigate = useNavigate()
  const [buttonLoader, setLoader] = useState("Login")

  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const success = (message) => {
      toast.success(message, {
          position: "top-center",
          theme: "colored"
      });
  };
  const error = (message)=>{
      toast.error(message, {
          position: "top-center",
          theme: "colored"
      });
  }
  const {register,handleSubmit,formState: { errors },} = useForm();
  const onSubmit = (data)=>{
    setLoader(()=>{
      return(<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 150"><path fill="none" stroke="#fff" 
          strokeWidth="15" strokeLinecap="round" strokeDasharray="300 385" strokeDashoffset="0"
          d="M275 75c0 31-27 50-50 50-58 0-92-100-150-100-28 0-50 22-50 50s23 50 50 50c58 0 92-100 150-100 24 0 50 19 50 50Z">
          <animate attributeName="stroke-dashoffset" calcMode="spline" dur="2" values="685;-685" keySplines="0 0 1 1"
          repeatCount="indefinite"></animate></path></svg>)
    })

    axios({
      url: "/api/login/",
      method: "post",
      data: data,
      withCredentials: true, // Ensure cookies are sent with the request

    })
    .then((res)=>{
      if(res.data.status==200){
          success(res.data.message)
          //set localstorage
          localStorage.setItem("chatUserDetails", JSON.stringify(res.data.data))
          setTimeout(() => {
              navigate("/dashboard")
          }, 2000);
      }else if(res.data.status==400){
          error(res.data.message)
      }else{
          error(res.data.message)
      }
      setLoader("Login")
    }).catch((err)=>{
        error("There is some error, please try again later.")
        setLoader("Login")
    })
  }
  return (
    <>
            <ToastContainer />

            <div className="login-form account-form">
                <h3>Log in to your account</h3>
                <span>Don't have an account? <Link to="/register">Sign Up</Link></span>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" className="form-control" id="email" {...register('email', {required: "Please enter your email"})}  placeholder="Enter Your Email " />
                        <p className="errors">{errors?.email && errors.email.message}</p>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input type="password" name= "password" {...register('password', {required: "Please enter password"})} className="form-control" id="password" placeholder="Enter your Password"/>
                        <p className="errors">{errors?.password && errors.password.message}</p>
                    </div>
                    <button className="btn btn-primary submit">{buttonLoader}</button>
                </form>
            </div>

        </>
  )
}
