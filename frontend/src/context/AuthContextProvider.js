import authContext from "./AuthContext.js";
import React, { useState, useEffect } from "react";

export default function AuthContextProvider({children}){
     //get data from localhost and pass into value props
    const [userData, setUserData]= useState(null)
    useEffect(()=>{
        const fetchUserData = async()=>{
            const storedUserData = await(localStorage.getItem("chatUserDetails"));
            if(storedUserData) {
                setUserData(JSON.parse(storedUserData));
            }else{
                setUserData(null)
            }
        }
        fetchUserData()
       
    }, [])
    
    return(
        <authContext.Provider value={{userData, setUserData}}>
            {children}
        </authContext.Provider>
    )
}
