import React, { useContext, useState, useEffect } from 'react';
import SocketContext from '../context/SocketContext.js';
import authContext from '../context/AuthContext.js';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useConversation from '../zustand/useConversation.js';

export default function OnlineArea() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const { userData } = useContext(authContext);
    const { onlineUsers } = useContext(SocketContext);
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
    const {mobileStyle} = useConversation()


    // toast error
    const error = (message) => {
        toast.error(message, {
            position: "top-center",
            theme: "colored"
        });
    };

    const getData = () => {
        setLoading(true);
        axios({
            url: "/api/sidebarUsers",
            method: "post",
            data: {},
            withCredentials: true, // Ensure cookies are sent with the request
        }).then((res) => {
            setLoading(false);
            if (res.data.status !== 200) {
                error("There is some error, please try again later");
            } else {
                // Get data (status 200)
                const response = res.data.data;
                // Ensure onlineUsers is an array
                if (onlineUsers.length > 0) {

                    const onlineUsersInIds = response.filter(item => onlineUsers.includes(item._id));
                    setData(onlineUsersInIds);
                } else {
                }
            }
        }).catch((err) => {
            setLoading(false);
            error("There is some error, please try again later");
        });
    };

    useEffect(() => {
        getData();
    }, [onlineUsers]);

    // Skeleton function
    const skeletonContent = () => {
        const skeletons = [];
        for (let i = 0; i < 4; i++) {
            skeletons.push(
                <div key={i} className='d-flex align-items-center mb-2 mt-1 p-2'>
                    <Skeleton circle={true} width={30} height={30} />
                    <div style={{ marginLeft: "10px", width: "100%" }}>
                        <Skeleton width="40%" height={10} />
                        <Skeleton width="70%" height={10} style={{ marginTop: "5px" }} />
                    </div>
                </div>
            );
        }
        return skeletons;
    };

    return (
        <>
            <div className={`col-lg-2 col-md-12 online-wrap height-100 ${mobileStyle.online?"":"hide-to-small"} `}>
                <div className="right-sidebar height-100">
                    <div className="right-sidebar-heading">
                        <h3>Online Users</h3>
                    </div>
                    <div className="online-users">
                        {loading ? (
                            skeletonContent()
                        ) : (
                            data.length>0?(
                                data.map((item) => (
                                <div key={item._id} className="user-info d-flex">
                                    <img className="user-image" src={item.image} alt={item.fullname} />
                                    <div className="user-details">
                                        <strong>{item.fullname}</strong>
                                        <span>Online</span>
                                    </div>
                                </div>
                            ))):(<h4>No user is online</h4>)
                        )}
                       
                    </div>
                </div>
            </div>
        </>
    );
}
