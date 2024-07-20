import React, { useState } from 'react'
import { Link, useNavigate} from 'react-router-dom'
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function SignUpForm() {
    const navigate = useNavigate()
    const [buttonLoader, setLoader] = useState("Submit")
    const {register,handleSubmit,formState: { errors },} = useForm();
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
    const onSubmit = (data)=>{

        setLoader(()=>{
            return(<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 150"><path fill="none" stroke="#fff" 
                stroke-width="15" stroke-linecap="round" stroke-dasharray="300 385" stroke-dashoffset="0"
                d="M275 75c0 31-27 50-50 50-58 0-92-100-150-100-28 0-50 22-50 50s23 50 50 50c58 0 92-100 150-100 24 0 50 19 50 50Z">
                <animate attributeName="stroke-dashoffset" calcMode="spline" dur="2" values="685;-685" keySplines="0 0 1 1"
                repeatCount="indefinite"></animate></path></svg>)
        })

        //check for confirm password and password
        if(data.cpassword!==data.password){
        //show errpr taost if unmatched
            error("The confirm password does not match.")
            setLoader("Submit")
        }
        else{
            //hit api to submit details if matched
            axios({
                url: "/api/register/",
                method: "post",
                data: data
            }).then((res)=>{
                if(res.data.status==200){
                    success(res.data.message)
                    setTimeout(() => {
                        navigate("/")
                    }, 5000);
                }else if(res.data.status==400){
                    error(res.data.message)
                }else{
                    error(res.data.message)
                }
                setLoader("Submit")
            }).catch((err)=>{
                error("There is some error, please try again later.")
                setLoader("Submit")
            })

        }

        
    }
    return (
        <>
            <ToastContainer />

            <div className="login-form account-form">
                <h3>Sign Up to your account</h3>
                <span>Already have an account? <Link to="/">Log In</Link></span>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input type="text" name="fullname" className="form-control" id="name" placeholder="Enter Full Name" {...register('fullname', { required: "Please enter fullname" })}/>
                        <p className="errors">{errors?.fullname && errors.fullname.message}</p>
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" className="form-control" id="email" placeholder="Enter Your Email" {...register('email', { required: "Please enter your email" })}/>
                        <p className="errors">{errors?.email && errors.email.message}</p>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" className="form-control" id="password" name="password" {...register('password', { required: "Please enter password" })} placeholder="Password" />
                        <p className="errors">{errors?.password && errors.password.message}</p>
                    </div>
                    <div className="form-group">
                        <label htmlFor="cpassword">Confirm Password</label>
                        <input type="password" className="form-control" id="cpassword" name="cpassword" {...register('cpassword', { required: "Please reneter password" })} placeholder="Confirm Password" />
                        <p className="errors">{errors?.cpassword && errors.cpassword.message}</p>
                    </div>
                    <div className="gender-field">
                        <label className="d-block">Gender</label>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="inlineRadioOptions" id="male" value="male" {...register("gender", { required: "Please select Gender" })} />
                            <label className="form-check-label" htmlFor="male">Male</label>
                            </div>
                            <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="inlineRadioOptions" id="female" value="female"  {...register("gender", { required: "Please select Gender" })}/>
                            <label className="form-check-label" htmlhtmlFor="female">Female</label>
                        </div>
                        <p className="errors">{errors?.gender && errors.gender.message}</p>

                    </div>
                    <button className="btn btn-primary submit">{buttonLoader}</button>
                </form>
            </div>
        </>
    )
}
