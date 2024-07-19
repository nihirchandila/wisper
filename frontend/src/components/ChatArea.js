import React, { useEffect, useState, useRef, useContext } from 'react'
import Conversation from './Conversation'
import Skeleton from 'react-loading-skeleton'
import { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import useConversation from '../zustand/useConversation.js'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import authContext from '../context/AuthContext.js'
import useSendMessage from '../hooks/useSendMessage.js'
import SocketContext from '../context/SocketContext.js'
import useListenMessages from '../hooks/useListenMessage.js'
import moment from "moment"


export default function ChatArea() {
    const [message, setMessage] = useState("")
    useListenMessages()
    const userData = useContext(authContext)
    const[getUserData, setLocalUSerData] = useState([])
    const chatContainerRef = useRef(null);
    const { onlineUsers } = useContext(SocketContext);
    const [scroll,setScroll] = useState(false)
    const [loading, setLoading] = useState(false)
    const { selectedConversation, messages, setMessages, mobileStyle} = useConversation()
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL
    const {sendMessage, mesLoading, mesScroll} = useSendMessage()

    //toast error
    const error = (message)=>{
        toast.error(message, {
            position: "top-center",
            theme: "colored"
        });
    }
      // Load userData from localStorage when the component mounts
  useEffect(() => {
    const storedUserData = localStorage.getItem("chatUserDetails");    
    if (storedUserData) {
      setLocalUSerData(JSON.parse(storedUserData));
    }
  },[]);
    // for showing start a new conversation template
    const noMessages = () => {
        const userName = getUserData?getUserData.fullName:"" //check optional chaining chatgpt(?.)

        return (
            <div className="no-messages">
                <h2>Welcome {userName}</h2>
                <h3>Click on any chat to start a conversation</h3>
                <div className="logo-wrapper"><img className="logo-icon" src="/images/wisper-icon.png" /></div>
            </div>
        )

    }
    //skeleton for messages
    const skeletonContent = () => {
        const skeletons = []
        for (let i = 0; i < 4; i++) {
            skeletons.push(
                <div className="skeleton-messages">
                    <SkeletonTheme baseColor="#d9d9d9">
                        <Skeleton variant="rectangular" style={{ float: "left", marginBottom: "30px" }} width="55%" height={15} />

                        <Skeleton variant="rectangular" style={{ float: "right", marginBottom: "30px" }} width="55%" height={15} />
                    </SkeletonTheme>
                </div>
            );
        }
        return skeletons
    }
    //axios to get messages
    const getMessages = ()=>{
        setScroll(false)
        setMessages([])
        setLoading(true)
        axios({
            url: "/message/get/"+selectedConversation?._id,
            method: "post",
            data: {},
            withCredentials: true, // Ensure cookies are sent with the request
        })
        .then((res)=>{
            if(res.data.status==200){
                setMessages(res.data.data)
                setLoading(false)
                setScroll(true)
            }else{
                error("There is some error, Please try again later.")
                setLoading(false)
            }
        }).catch((err)=>{
            error("There is some error, Please try again later.")
            setLoading(false)
        })
    }
    //run get messages on change of anu selected person change and send Message state change
    useEffect(()=>{
        if(selectedConversation!=null){
            getMessages()
        }
    },[selectedConversation])
    useEffect(()=>{
            chatContainerRef.current?.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: 'smooth',
              });
    },[scroll, mesScroll, messages])

    //handle send message 
    const handleSend = (e)=>{
        e.preventDefault();
        if(message){
            sendMessage(message)
            setMessage("")
        }
    }

    //show messages template
    const showMessages = () => {
        const min = 0;
        const max = 1500000;
        const randomIntInRange = Math.floor(Math.random() * (max - min)) + min;


        return (
            <>
                <div className="user-info d-flex">
                    <img className="user-image" src={selectedConversation?.image} />
                    <div className="user-details">
                        <strong>{selectedConversation?.fullname}</strong>
                        <span>{onlineUsers.includes(selectedConversation?._id)?("Online"): ""}</span>
                    </div>
                </div>
                <div className= "messages chat-container " ref={chatContainerRef}>
                    {  
                    loading?skeletonContent(): 
                            (messages.length>0?
                                (messages.map((item, index)=>{
                                return(
                                selectedConversation._id==item.receiverId?
                                (<div key={`${randomIntInRange}-${index}`} className="sender message-wrap">
                                    <div className='d-flex'>
                                    <p>{item.message}</p>
                                    <img className="user-image" src={getUserData.image} />
                                    </div>
                                    <span>{moment(item.createdAt).format("h:mm a")}</span>

                                    
                                </div>): 
                                (
                                    <div key={`${index}-${item._id}`} className="receiver message-wrap">
                                        <div className='d-flex'>
                                            <img className="user-image" src={selectedConversation.image} />
                                            <p>{item.message}</p>
                                        </div>
                                        <span className="text-end">{moment(item.createdAt).format("h:mm a")}</span>
                                    </div>
                                )
                                )
                                })
                            ):(<h4 className="text-center">Please type a message to start a conversation</h4>)
                        )
                    }

                </div>
                <form className="send-message">
                    <input
                        type="text"
                        className="send-field"
                        placeholder="Type your message"
                        value={message}
                        onChange = {(e)=>{setMessage(e.target.value)}}
                    ></input>
                    <button onClick={handleSend}>
                        <img src="/images/send-icon.png" />
                    </button>
                </form>
            </>
        )
    }
    
    return (
        <>
            <div className={`col-lg-9 col-md-12 height-100 ${mobileStyle.online?"hide-to-small": ""}`}>
                <div className="chat-area height-100">
                    <div className="row height-100">
                        {/* conversation area */}
                        <Conversation />
                        {/* conversation area */}
                        <div className={`col-lg-8 col-md-12 conversation-wrapper ${mobileStyle.conversation ? '' : 'hide-to-small'}`}>
                            {/* messages section */}
                            {
                                selectedConversation ? showMessages() : noMessages()
                            }
                            {/* messages section */}
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}
