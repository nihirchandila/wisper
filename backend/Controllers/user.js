import userSchema from "../Schemas/user.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import mongoose from "mongoose";

const signup = async(req,res)=>{
    try{
        const {fullname, email, password, gender}= req.body;
        const findUsername = await userSchema.find({email: email})   
        if(findUsername.length>0){
            res.json({status: 400, message: "User already exist"})
        }else{
            //hash password
            const hash = await bcrypt.hash(password, 10)
            //get profile image
            const boyProfile = `https://avatar.iran.liara.run/public/boy?username=[${fullname}]`
            const girlProfile = `https://avatar.iran.liara.run/public/girl?username=[${fullname}]`
            const data = {
                fullname: fullname,
                email: email,
                password: hash,
                gender: gender,
                image: gender=="male"?boyProfile: girlProfile
            }
            const saveUser = await new userSchema(data).save()
            if(saveUser){
                res.json({status: 200, message: "User Registered Sucessfully"})
            }
        }
    }
    catch(err){
        console.log(err)
        res.json({status: 400, message: "There is some error, please try again later"})
    }
}
const login = async(req,res)=>{
    try{
        const {email, password}= req.body;
        const findUser = await userSchema.find({email: email})
        if(findUser.length>0){
            //verify password with bcrypt
            const hashedPass = await bcrypt.compare(password, findUser[0].password)
            if(!hashedPass){
                res.json({status: 400, message: "Email or Password is incorrect"})
            }else{
            //generate token 
            const token = await jwt.sign({userId: findUser[0]._id}, process.env.secretKey, 
                {expiresIn: 60*60*24}
            )
            const data = {
                id: findUser[0]._id,
                fullName : findUser[0].fullname,
                email : findUser[0].email,
                gender: findUser[0].gender,
                image: findUser[0].image
            }
            //send cookie
            res.cookie('chatAppToken', token, 
                {
                    httpOnly: true,  // Helps mitigate XSS attacks by preventing access to the cookie via JavaScript
                    maxAge: 24 * 60 * 60 * 1000, // 24 hours
                    sameSite: "strict", // Helps prevent CSRF attacks
                    secure: process.env.NODE_ENV === 'production' // Only send the cookie over HTTPS in production
                }
            )   
            //send response
            res.json({status: 200, message: "Login successful", data: data})
            }
            
        }else{
            res.json({status: 400, message: "Email or Password is incorrect"})
        }
    }
    catch(err){
        res.json({status: 400, message: "There is some error, please try again"})
    }
}

const logout = async(req,res)=>{
    try{
        await res.cookie("chatAppToken", "", {maxAge: 0})
        res.json({status: 200, message: "Logged out successfully"})
    }
    catch{
        res.json({status: 400, message: "There is some error, please try again"})
    }
}

const sidebarUsers = async(req,res)=>{
    try{
        const userId = req.user._id
        const getUsers = await userSchema.find({_id:{$ne: userId} }).select("-password")
        res.json({status: 200, data: getUsers})
    }
    catch(err){
        console.log(err)
        res.json({status: 400, message:"There is some error please try again later"})
    }
}

const search = (req,res)=>{
    const searchTerm = req.body.search;
    userSchema.find({fullname: { $regex: searchTerm, $options: "i" }})
    .then((response)=>{
        res.json({status:200, data: response});
    }).catch((err)=>{
        res.json({status:400, data: "There is some error, please try again later"});
    })
}


export {signup, login, logout, sidebarUsers, search}