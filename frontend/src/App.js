import React from 'react'
import {BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./components/pages/Home.js"
import Dashboard from './components/pages/Dashboard.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./Style.css";
import LoginForm from './components/LoginForm.js';
import SignUpForm from './components/SignUpForm.js';
import AuthContextProvider from './context/AuthContextProvider.js';
import SocketContextProvider from './context/SocketContextProvider.js';

export default function App() {
  // const userData = AuthContextProvider()
  return (
    <>
    
    <BrowserRouter>
      <AuthContextProvider>
        <SocketContextProvider>
          <Routes>
            <Route path="/" element={<Home/>}>
              <Route path="/" element={<LoginForm/>}/>
              <Route path="/register" element={<SignUpForm/>}/>
            </Route>
            <Route path="/dashboard" element={<Dashboard/>}/>

          </Routes>
        </SocketContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
    </>
  )
}
