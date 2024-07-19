import jwt from "jsonwebtoken";
import userSchema from "../Schemas/user.js"
const verify = async(req,res,next)=>{
    try{
        const token = req.cookies.chatAppToken
        if(!token){
            res.json({status: 400, message:"Please login first"})
            return
        }else{
            const verified = jwt.verify(token, process.env.secretKey)
            if(verified){
                // res.json({status: 200, message: "Token Verified"})
                //get user details without password
                const user = await userSchema.findById(verified.userId).select("-password")
                if(!user){
                    return res.json({status: 400, message:"There is some issue, please try again later."})
                }
                req.user = user //pass userid to other middlewares or route handlers
                // console.log(req.user)
                next()
            }else{
                res.json({status: 400, message:"invalid Token"})
                return
            }
        }
    }
    catch{
        res.json({status: 500, message: "Internal server error"})
        return
    }
}

export {verify}