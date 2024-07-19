import mongoose from "mongoose";

const connect = ()=>{
    mongoose.connect(process.env.MONGO_DB_URI)
    .then(()=>{
        console.log("db connected succesfully")
    }).catch((err)=>{
        console.log(err)
    })
}

export default connect