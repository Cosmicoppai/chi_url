import React from 'react'
import Login from "./Mycomponents/pages/signuppages/login";
import Signup from "./Mycomponents/pages/signuppages/signup"
import Verifymail from "./Mycomponents/pages/signuppages/verifymail";
import Home from "./Mycomponents/pages/Homepages/home";
import UserPage from "./Mycomponents/pages/userpages/userpage";
import Nav from "./Mycomponents/components/nav";
import Footer from "./Mycomponents/components/footer"
import { BrowserRouter as Router, Route, Switch} from "react-router-dom";

function App() {
  return (
    <>
    
        <Router>
        <Nav />
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/signup" exact component={Signup} />
            <Route path="/login" exact component={Login} />
            <Route path="/user"  component={UserPage} />
            <Route path="/verify" exact component={Verifymail} />
          </Switch>
          <Footer />
        </Router>
      
      
    </>
  )
}

export default App

