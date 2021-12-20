import React from 'react'
import Login from "./Mycomponents/pages/signuppages/login";
import Signup from "./Mycomponents/pages/signuppages/signup"
import Verifymail from "./Mycomponents/pages/signuppages/verifymail";
import Home from "./Mycomponents/pages/Homepages/home";
import UserPage from "./Mycomponents/pages/userpages/userpage";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import ErrorPage from './Mycomponents/pages/Homepages/errorPage';


function App() {
  function UserRoute({ children }) {
    const auth = localStorage.getItem("token");
    const active = localStorage.getItem("active");
    let activeStatus 
    if (acti)
    console.log("userRoute", active)
    return (auth && active) ? <Navigate to="/user" /> : children;
  }
  function ProtectedRoute({ children }) {
    const auth = localStorage.getItem("token");
    const active = localStorage.getItem("active");
    console.log("pr", active)
    return (auth && active) ? children : <Navigate to="/" />;
  }
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={
            <UserRoute>
              <Home />
            </UserRoute>} />
          <Route path="/signup" element={

              <Signup />
            } />
          <Route path="/login" element={
              <Login />
            } />
          <Route path="/verify" element={
            <UserRoute>
              <Verifymail />
            </UserRoute>} />
          <Route path="/user" element={
            <ProtectedRoute>
              <UserPage />
            </ProtectedRoute>} />
          <Route path='*' element={<ErrorPage />} />
        </Routes>
      </Router>


    </>
  )
}

export default App
