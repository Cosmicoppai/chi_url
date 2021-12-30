import React from 'react'
import Login from "./Mycomponents/pages/signuppages/login";
import Signup from "./Mycomponents/pages/signuppages/signup"
import Verifymail from "./Mycomponents/pages/signuppages/verifymail";
import Home from "./Mycomponents/pages/Homepages/home";
import UserPage from "./Mycomponents/pages/userpages/userpage";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import ErrorPage from './Mycomponents/pages/Homepages/errorPage';


function App() {
  function NotActiveRoute({ children }) {
    const auth = localStorage.getItem("token");
    const active = localStorage.getItem("active");
    console.log("NotActive", active)
    return auth && (active == 'false')? children : <Navigate to="/" />;
  }
  function ActiveRoute({ children }) {
    const auth = localStorage.getItem("token");
    const active = localStorage.getItem("active");
    console.log(active)
	  console.log("userPage", auth && active)
    return auth && (active == 'true') ? children : <Navigate to="/verify" />;
  }
  function HomeRoute({ children }) {
    const auth = localStorage.getItem("token");
    return !auth ? children : <Navigate to="/user" />
  }
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={
            <HomeRoute>
              <Home />
            </HomeRoute>} />
          <Route path="/signup" element={
            <HomeRoute>
              <Signup />
            </HomeRoute>
            } />
          <Route path="/login" element={
             <HomeRoute>
              <Login />
            </HomeRoute>
            } />
          <Route path="/verify" element={
            <NotActiveRoute>
              <Verifymail />
            </NotActiveRoute>} />
          <Route path="/user" element={
            <ActiveRoute>
              <UserPage />
            </ActiveRoute>} />
          <Route path='*' element={<ErrorPage />} />
        </Routes>
      </Router>


    </>
  )
}

export default App
