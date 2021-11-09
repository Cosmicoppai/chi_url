import  React from 'react'
import Login from "./Mycomponents/pages/signuppages/login";
import Signup from "./Mycomponents/pages/signuppages/signup"
import Verifymail from "./Mycomponents/pages/signuppages/verifymail";
import Home from "./Mycomponents/pages/Homepages/home";
import UserPage from "./Mycomponents/pages/userpages/userpage";
import { BrowserRouter as Router,  Navigate ,Route,Routes} from "react-router-dom";


function App() {
  
  function ProtectedRoute({ children }) {
    const auth = localStorage.getItem("token");
    return auth ? children : <Navigate to="/home" />;
  }
  return (
    <>
      <Router>
      
        <Routes>
        <Route path="/"  render={() => {
            const user = localStorage.getItem("token");
            return (
              user ?
                <Navigate to="/user" /> :
                <Navigate to="/home" />
            )
          }} />
          <Route path="/home" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify" element={
          <ProtectedRoute>
          <Verifymail />
        </ProtectedRoute>} />
          <Route path="/user" element={
          <ProtectedRoute>
              <UserPage />
            </ProtectedRoute>}  />
         </Routes>
      </Router>


    </>
  )
}

export default App
