import path from "path"
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
const __dirname = path.resolve()
dotenv.config();
const DEV = process.env.DEV
const corsOptions = {
    origin: DEV, // Frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // Allow credentials (cookies) to be sent
    allowedHeaders: ['Content-Type', 'Authorization'],
};
// const allowedOrigins = [
//     'http://localhost:3001',
//     'https://wisper.onrender.com'
// ];

// const corsOptions = {
//     origin: function (origin, callback) {
//         if (!origin || allowedOrigins.indexOf(origin) !== -1) {
//             callback(null, true);
//         } else {
//             callback(new Error('Not allowed by CORS'));
//         }
//     },
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     credentials: true, // Allow credentials (cookies) to be sent
//     allowedHeaders: ['Content-Type', 'Authorization'],
// };

app.use(cors(corsOptions));
const Port = process.env.PORT || 3002
app.use(express.json()) // for parsing application/json
app.use(cookieParser())// for parsing cookies 

//Routes
app.use("/api", userRoute)
app.use("/page", pageRoute)
app.use("/message", messageRoute)

app.use(express.static(path.join(__dirname,"/frontend/build")))

app.get("*", (req, res)=>{
    res.sendFile(path.join(__dirname, "/frontend/build/index.html"))
})

server.listen(Port,()=>{
    connect()
    console.log("server running on port "+Port)
})