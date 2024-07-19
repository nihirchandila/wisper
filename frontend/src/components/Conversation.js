import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { useNavigate } from 'react-router-dom'
import useConversation from '../zustand/useConversation.js'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment'


export default function Conversation() {
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
    const {selectedConversation, setSelectedConversation, mobileStyle, setMobileStyle, messages} = useConversation()
    const navigate = useNavigate()
    const [conversations, setConversations] = useState([])
    const [loading, setLoading] = useState(true)
    const [mesLoading, setMesLoading] = useState(true)
    const [sidebarMessages, setSidebarMessages] = useState([])

    // const isSelected = selectedConversation?selectedConversation: null

    //toast error
    const error = (message)=>{
        toast.error(message, {
            position: "top-center",
            theme: "colored"
        });
    }

    const getData = () => {
        axios({
            url: apiBaseUrl+"/api/sidebarUsers",
            method: "post",
            data: {},
            withCredentials: true, // Ensure cookies are sent with the request
        }).then((res) => {
            if(res.data.status!==200){
                navigate("/?login=error")
                return
            }else{
                //to get data(status 200)
                setConversations(res.data.data)
                setLoading(false)
            }
            
        }).catch((err) => {
            setLoading(false)

        })
    }
    //axios to get messages
    const getMessages = ()=>{
        setMesLoading(true)
        axios({
            url: apiBaseUrl+"/message/getConversaiton",
            method: "post",
            data: {},
            withCredentials: true, // Ensure cookies are sent with the request
        })
        .then((res)=>{
            if(res.data.status==200){
                setSidebarMessages(res.data.data)
                setMesLoading(false)
            }else{
                error("There is some error, Please try again later.")
                setLoading(false)
            }
        }).catch((err)=>{
            error("There is some error, Please try again later.")
            setMesLoading(false)
        })
    }
    useEffect(() => {
        getData()
    }, [])
    useEffect(()=>{
        getMessages()
    },[conversations, messages])
    
    // search function
    const handleSearch = (e)=>{
        setLoading(true)
        setTimeout(()=>{
            const searchValue = e.target.value
            axios({
                url: apiBaseUrl+"/api/search",
                method: "post",
                data: {search: searchValue}
            })
            .then((res)=>{
                if(res.data.status===200){
                    setConversations(res.data.data)
                    setLoading(false)
                }else{
                    error("There is some error please try again later")
                    setLoading(false)
                }
            })
            .catch((err)=>{
                error("There is some error please try again later")
                setLoading(false)
            }) 
        },1500)
    }
    //trim messages to show in conversation sidebar
    const truncateText = (text, maxLength) => {
        return text.length > maxLength ? text.substring(0, maxLength)+"..." : text;
    };
    //skeleton function
    const skeletonContent = () => {
        const skeletons = [];
        for (let i = 0; i < 10; i++) {
            skeletons.push(
                <div key={i} className='d-flex align-items-center mb-2 mt-1 p-2'>
                    <Skeleton circle={true} variant="circular" width={30} height={30} />
                    <div style={{ marginLeft: "10px", width: "100%" }}>
                        <Skeleton variant="rectangular" width="40%" height={10} />
                        <Skeleton variant="rounded" width="70%" height={10} style={{ marginTop: "5px" }} />
                    </div>
                </div>
            );
        }
        return skeletons;
    };
    
    const conversationContent = () => {
        return (
            conversations.length > 0 ? conversations.map((item) => {
                const activeClass = selectedConversation?._id === item._id ? "active-user" : "";
                return (
                    <div key={item._id} onClick={() => { setSelectedConversation(item); setMobileStyle({ chat: false, conversation: true, online: false }) }} className={`user d-flex ${activeClass}`}>
                        <img className="user-image" src={item.image} />
                        <div className="user-chat-info">
                            <div className="d-flex justify-content-between">
                                <strong>{item.fullname}</strong>
                                {/* <p className="chat-time">yesterday</p> */}
                            </div>
                            {/* <span className="message">JEssir typing... </span> */}
                            {/* <span className="unseen-mes-num">1</span> */}
                            {sidebarMessages.map((rec, index) => {
                                if (rec.participants.includes(item._id)) {
                                    const lastMessageIndex = rec.messages.length - 1;
                                    const lastMessage = rec.messages[lastMessageIndex].message;
                                    return (
                                        <div key={`${item._id}-${rec._id}-${index}`} className="d-flex justify-content-between align-items-end">
                                            <p>{truncateText(lastMessage, 30)}</p>
                                            <p className="chat-time">{moment(rec.messages[lastMessageIndex].createdAt).format("h:mm a")}</p>
                                        </div>
                                    );
                                } else {
                                    return null;
                                }
                            })}
                        </div>
                    </div>
                )
            }) : <h3>No User Found</h3>
        )
    }
    


    return (
        <>
            <div className={`col-lg-4 col-md-12 sidebar-users height-100 ${mobileStyle.chat?"":"hide-to-small"}`}>
                <div className="search-wrap d-flex align-items-center">
                    <img src="https://img.icons8.com/ios/50/search--v1.png" />
                    <input
                        type="text"
                        className=" search-field"
                        placeholder="Search"
                        onChange={handleSearch}
                    ></input>
                </div>
                <div className="users-wrap">
                    {
                        loading ? skeletonContent() : conversationContent()
                    }
                </div>
            </div>

        </>
    )
}
