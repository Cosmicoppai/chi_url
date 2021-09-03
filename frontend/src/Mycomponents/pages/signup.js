import React, { useState } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router';

const Signup = () => {
    let mystyle = {
        marginTop: "100px",
        marginBottom: "170px",
        maxWidth: "500px"
    }
    const [emailReg, setemailReg] = useState('');
    const [usernameReg, setusernameReg] = useState('');
    const [passwordReg, setpasswordReg] = useState('');
    const [loading, setLoading] = useState(false);
    const [redirect, setRedirect] = useState(false);
    

    const signupClick = async (e) => {
        e.preventDefault();
        setLoading(true);
        await axios.post("add_user", {
            username: usernameReg,
            email: emailReg,
            password: passwordReg
        },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Credentials': 'true',
                    'Accept': 'application/json'
                }
            })
            .then((resp) => {
                console.log(resp)
                if (resp.status === 201) {
                    setLoading(false);
                    setRedirect(true);
                }
                else {
                    return (
                        <div className="alert alert-danger alert-dismissible fade show" role="alert">
                            <strong>Error!</strong> You should check in on some of those fields below.
                            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"/>
                        </div>)
                }
            })
            .catch((error) => {
                setLoading(false);
                console.error(error);
            })
    }

    if (redirect) {
        return <Redirect to="/login" />
    }
    return (
        <form className="container text-center " style={mystyle}>
            <h1 style={{ fontFamily: 'Droid Sans' }}>Please Sign-up</h1>
            <label htmlFor="exampleInputEmail1" className="form-label mt-3"
            ><h5>Email Address</h5></label>
            <input
                type="email"
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                value={emailReg}
                onChange={(e) => { setemailReg(e.target.value) }}
            />
            <div id="emailHelp" className="form-text">
                We'll never share your email with anyone else.
            </div>


            <label htmlFor="exampleInputUsername" className="form-label mt-3"
            ><h5>Username</h5>
            </label>
            <input
                type="text"
                className="form-control"
                id="exampleInputUsername"
                value={usernameReg}
                onChange={(e) => { setusernameReg(e.target.value) }}
            />


            <label htmlFor="exampleInputPassword1" className="form-label mt-3"
            ><h5>Confirm Password</h5></label
            >
            <input
                type="password"
                className="form-control"
                id="exampleInputPassword1"
                value={passwordReg}
                onChange={(e) => { setpasswordReg(e.target.value) }}
            />
            {!loading && (
                <button className="btn btn-dark mt-3 px-4" onClick={signupClick} type="button">Sign up</button>
            )}
            {loading && (
                <button className="btn btn-dark mt-3 px-4" type="button" disabled>
                    <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"/>
                    Loading...
                </button>
            )}
        </form>
    )
}

export default Signup
