import React, {useState, useEffect} from "react"
import axios from "axios"
import useConversation from "../zustand/useConversation.js"

const useSendMessage=()=>{
    const [mesLoading, setLoading] = useState(false);
    const [mesScroll,setScroll] = useState(false)
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL
    const { selectedConversation, messages, setMessages } = useConversation()

    const error = (error)=>{
        toast.error(error, {
            position: "top-center",
            theme: "colored"
        });
    }
    const sendMessage = (message)=>{
        setScroll(false)
        setLoading(true);
        axios({
            url: "/message/send/"+selectedConversation?._id,
            method: "post",
            data: {message},
            withCredentials: true //Ensure cookies are sent with the request
        })
        .then((res)=>{
            setLoading(false)
            setMessages([...messages, res.data.data])
            setScroll(true)
        })
        .catch((err)=>{
            console.log(err)
            setLoading(false)
            error("There is some error in sending message, Please try again later.")
        })
    }
    return{sendMessage, mesLoading, mesScroll}
}
export default useSendMessage