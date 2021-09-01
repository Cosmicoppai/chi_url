import  React from 'react'
import Login from "./Mycomponents/pages/login";
import Signup from "./Mycomponents/pages/signup";
import Home from "./Mycomponents/pages/Home/home";
import UserPage from "./Mycomponents/pages/user/userpage";
import Nav from "./Mycomponents/components/nav";
import Footer from "./Mycomponents/components/footer"
import { BrowserRouter, Route } from "react-router-dom";

function App() {
  return (
    <>
     
        <BrowserRouter>
          <Nav/>
          <Route path="/" exact component={Home} />
          <Route path="/login" exact component={Login} />
          <Route path="/signup" exact component={Signup} />
          <Route path="/user" exact component={UserPage} />
        </BrowserRouter>
      <Footer />
    </>
  )
}

export default App

