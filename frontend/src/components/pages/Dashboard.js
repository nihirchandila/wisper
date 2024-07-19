import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import LeftSidebar from "../LeftSidebar.js";
import ChatArea from "../ChatArea.js";
import OnlineArea from "../OnlineArea.js";
// import authContext from "../../context/AuthContext.js";
import useConversation from "../../zustand/useConversation.js";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Dashboard() {
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const { setSelectedConversation, mobileStyle, setMobileStyle } = useConversation();
  const navigate = useNavigate();
  const[userData, setUserData] = useState([])
  // const { userData, setUserData } = useContext(authContext);

  const error = (message) => {
    toast.error(message, {
      position: "top-center",
      theme: "colored"
    });
  };

  // Load userData from localStorage when the component mounts
  useEffect(() => {
    const storedUserData = localStorage.getItem("chatUserDetails");
    
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  },[]);

  useEffect(() => {
    if (!userData) {
      navigate("/?login=error");
    }
  }, [userData]);


  const handleLogout = async () => {
    axios({
      url: "/api/logout",
      method: "post",
      data: {},
      withCredentials: true
    })
    .then((res) => {
      if (res.data.status === 200) {
        setSelectedConversation(null);
        localStorage.removeItem("chatUserDetails");
        setUserData(null);
        setMobileStyle({ chat: true, conversation: false, online: false }) 
        navigate("/");
      } else {
        error(res.data.message);
      }
    })
    .catch((err) => {
      error("There is some error, please try again later ");
    });
  };

  return (
    <>
      <div className="chat-page">
        <div className="row height-vh">
          <LeftSidebar handleLogout={handleLogout} />
          <ChatArea />
          <OnlineArea />
        </div>
        <div className="mobile-nav">
          <div className="row">
            <div className="col-md-4 col-sm-4 col-4 nav-item" onClick={() => { setMobileStyle({ chat: true, conversation: false, online: false }) }}>
              <img src="/images/chat-icon.png" />
              <span>All Chats</span>
            </div>
            <div className="col-md-4 col-sm-4 col-4 nav-item" onClick={() => { setMobileStyle({ chat: false, conversation: false, online: true }) }}>
              <img src="/images/online-users.png" />
              <span>Online</span>
            </div>
            <div className="col-md-4 col-sm-4 col-4 nav-item" onClick={handleLogout}>
              <img src="/images/logout.png" />
              <span>Logout</span>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
