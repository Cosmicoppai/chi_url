import  React,{useEffect} from 'react'
import Login from "./Mycomponents/pages/signuppages/login";
import Signup from "./Mycomponents/pages/signuppages/signup"
import Verifymail from "./Mycomponents/pages/signuppages/verifymail";
import Home from "./Mycomponents/pages/Homepages/home";
import UserPage from "./Mycomponents/pages/userpages/userpage";
import { BrowserRouter as Router,  Navigate ,Route,Routes} from "react-router-dom";
import ErrorPage from './Mycomponents/pages/Homepages/errorPage';


function App() {
  function ProtectedRoute({ children }) {
    const auth = localStorage.getItem("token");
    return auth ? children : <Navigate to="/" />;
  }
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
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
            <Route path='*' element={<ErrorPage />} />
         </Routes>
      </Router>


    </>
  )
}

export default App