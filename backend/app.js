import express from "express"
import cors from "cors"
import dotenv from "dotenv";
import connect from "./db/connection.js"
import cookieParser from "cookie-parser";
//import routes
import userRoute from "./Routes/user.js"
import pageRoute from "./Routes/pages.js"
import messageRoute from "./Routes/messages.js"
//import socket
import {app, server} from "./Socket/socket.js"


// const app = express()

//import 
//init values here
dotenv.config();
const corsOptions = {
    origin: 'http://localhost:3000', // Frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // Allow credentials (cookies) to be sent
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
const Port = process.env.PORT || 3002
app.use(express.json()) // for parsing application/json
app.use(cookieParser())// for parsing cookies 

//Routes
app.use("/api", userRoute)
app.use("/page", pageRoute)
app.use("/message", messageRoute)



server.listen(Port,()=>{
    connect()
    console.log("server running on port "+Port)
})