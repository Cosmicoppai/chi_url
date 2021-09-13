import axios from 'axios';
import React, { useState } from 'react'
import { Redirect } from 'react-router';

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
        return <Redirect to="/user" />
    }


    let mystyle = {
        marginTop: "150px",
        marginBottom: "350px",
    }
    return (
        <div className="d-flex justify-content-center text-center flex-column" style={mystyle}>
            <h2> Please Verify your email</h2>
            <p>Please click on the send button to recieve the
                verification link on your registered email id.</p>
            <button type="button" className="btn btn-dark w-25 mx-auto mb-5"
                onClick={emailVerification}>Send</button>
        </div>
    )
}

export default Verifymail
