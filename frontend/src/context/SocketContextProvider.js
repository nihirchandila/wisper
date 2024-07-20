import React, { useState, useEffect, useContext } from 'react';
import SocketContext from './SocketContext';
import io from "socket.io-client";
import authContext from './AuthContext.js';

export default function SocketContextProvider({ children }) {
    const {userData} = useContext(authContext)
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);

      //for testing how to get env in react on server
  const DEV = process.env.DEV
  console.log("DEV"+DEV)
  const ReactDEV = process.env.REACT_APP_DEV
  console.log("REACT_APP_DEV "+ReactDEV)
  //manually set dev url
    const dev = "http://localhost:3001"


    useEffect(()=>{
        if(userData){
            // console.log(userData)
            const socket = io(dev,{
                query: {
                    userId:userData.id 
                }
            })
            setSocket(socket);
            //get Online Users
            socket.on("getOnlineUsers", (users)=>{setOnlineUsers(users)})

            return () => socket.close();
        }else{
            if (socket) {
				socket.close();
				setSocket(null);
			}
        }
    },[userData])

    


    return (
        <SocketContext.Provider value={{ socket, onlineUsers }}>
            {children}
        </SocketContext.Provider>
    );
}
