import jwt from "jsonwebtoken"

const verify = (req,res,next)=>{
    try{

        const token = req.cookies.chatAppToken;
        if(!token){
            res.json({status: 400, message:"Please login first"})
        }else{
            const verified = jwt.verify(token, process.env.secretKey)
            if(verified){
                res.json({status: 200, message: "Token Verified"})
                next();
            }else{
                res.json({status: 400, message:"invalid Token"})
            }
        }
    }catch(err){
        console.log(err)
        res.json({status: 500, message: "Internal server error"})
        
    }
}
export {verify}