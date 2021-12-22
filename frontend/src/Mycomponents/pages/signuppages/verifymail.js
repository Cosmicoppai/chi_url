import axios from 'axios';
import React from 'react'
import { Link } from 'react-router-dom';
import Footer from "../components/footer"

const Verifymail = () => {
    localStorage.removeItem('token');
    const emailVerification = async () => {
        
        const token = localStorage.getItem("verifyMail");
        await axios.get('send-code', {
            headers: {
                'Authorization': ` Bearer ${token}`,
                'Accept': 'application/json'
            }
        })
            .then(resp => {
                // console.log(resp);
            localStorage.clear()
                if (resp.status === 200) {
                    document.getElementById('verifyMail').style.display ='none'
                    document.getElementById('alertBar').style.display ='block'
                }
            })
            .catch(error => {
                // console.error(error);
            })
    }

    let mystyle = {
        marginTop: "150px",
        marginBottom: "350px",
    }


    return (
        <>
            <nav className="navbar navbar-expand-md fixed-top navbar-dark bg-dark mb-4">
                <div className="container-fluid ">
                    <Link to="/verify" className="navbar-brand  "  > <h2>小URL</h2></Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-2 mb-md-0 text-end">
                        </ul>
                    </div>
                </div>

            </nav>
            <div className="d-flex justify-content-center text-center flex-column" id='verifyMail' style={mystyle}>
                <h2> Please Verify your email</h2>
                <p>Please click on the send button to recieve the
                    verification link on your registered email id.</p>
                <button type="button" className="btn btn-dark w-25 mx-auto mb-5"
                    onClick={emailVerification}>Send</button>
            </div>
            <div className="alert alert-dark bg-transparent d-flex justify-content-center text-center flex-column " id='alertBar' role="alert" >
            <h4>Please click on the link within 15 minutes to verify your account and login again to use our services!!!</h4>
                <a type="button" style={{color:'black'}}  href="/login" className="btn btn-lg btn-light ms-2">Go to login page</a>
            </div>
            <Footer />
        </>
    )
}

export default Verifymail