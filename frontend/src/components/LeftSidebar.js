import React from 'react'


export default function LeftSidebar({handleLogout}) {
    return (
        <>
            <div className="col-md-1 l-sidebar pr-0 height-100">
                <div className="left-sidebar height-100">
                    <div className="logo-wrapper">
                        <img className="logo-icon" src="/images/wisper-icon.png"></img>
                    </div>
                    <div className="sidebar-nav">
                        {/* <ul className="mess-nav">
                            <li className="">
                                <a href="">
                                    <img src="/images/chat-icon.png" alt="" />
                                    <span>All Chats</span>
                                </a>
                            </li>
                            <li className="active-nav">
                                <a href="">
                                    <img src="/images/chat-icon.png" alt="" />
                                    <span>All Chats</span>
                                </a>
                            </li>
                        </ul> */}
                    </div>
                    <div className="logout-nav-wrap" onClick={(e)=>{e.preventDefault(); handleLogout()}}>
                        <ul className="logout-nav">
                            <li>
                                <a href="">
                                    <img src="/images/logout.png" alt="" />
                                    <span>Logout</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

        </>
    )
}
