import React, { useState, useEffect, useContext } from 'react';
import SocketContext from './SocketContext';
import io from "socket.io-client";
import { useFetcher } from 'react-router-dom';
import authContext from './AuthContext.js';

export default function SocketContextProvider({ children }) {
    const {userData} = useContext(authContext)
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);

    useEffect(()=>{
        if(userData){
            // console.log(userData)
            const socket = io(process.env.REACT_APP_API_BASE_URL,{
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
