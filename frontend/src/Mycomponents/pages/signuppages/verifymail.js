import axios from 'axios';
import React, { useState } from 'react'
import { Navigate , Link} from 'react-router-dom';
import Footer from "../components/footer"

const Verifymail = () => {
    const [redirect, setRedirect] = useState(false);

    const emailVerification = async () => {
        const token = localStorage.getItem("token");
        await axios.get('send-code', {
            headers: {
                'Authorization': ` Bearer ${token}`,
                'Accept':'application/json'
            }
        })
            .then(resp => {
                console.log(resp);
                if (resp.status === 200) {
                    setRedirect(true)
                }
            })
            .catch(error => {
                console.error(error);
            })
    }
    if (redirect) {
        return <Navigate
         to="/user" />
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
        <div className="d-flex justify-content-center text-center flex-column" style={mystyle}>
            <h2> Please Verify your email</h2>
            <p>Please click on the send button to recieve the
                verification link on your registered email id.</p>
            <button type="button" className="btn btn-dark w-25 mx-auto mb-5"
                onClick={emailVerification}>Send</button>
        </div>
        <Footer/>
        </>
    )
}

export default Verifymail
