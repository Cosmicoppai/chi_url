import React from 'react'
import Login from "./Mycomponents/pages/signuppages/login";
import Signup from "./Mycomponents/pages/signuppages/signup"
import Verifymail from "./Mycomponents/pages/signuppages/verifymail";
import Home from "./Mycomponents/pages/Homepages/home";
import UserPage from "./Mycomponents/pages/userpages/userpage";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import ErrorPage from './Mycomponents/pages/Homepages/errorPage';


function App() {
  function VerifyRoute({ children }) {
    const active = localStorage.getItem("active");
    let activeStatus
    if(active === null){
      activeStatus = false;
    }
    else{
      activeStatus = active;
    }
    
    return activeStatus   ? children : <Navigate to="/" />;
  }
  function UserRoute({ children }) {
    const auth = localStorage.getItem("token");
    return auth   ? <Navigate to="/user" /> : children;
  }
  function ProtectedRoute({ children }) {
    const auth = localStorage.getItem("token");
    return auth  ? children : <Navigate to="/" />;
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
            <UserRoute>
              <Signup />
            </UserRoute>
            } />
          <Route path="/login" element={
             <UserRoute>
              <Login />
            </UserRoute>
            } />
          <Route path="/verify" element={
            <VerifyRoute>
              <Verifymail />
            </VerifyRoute>} />
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
