import React, { useState } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router';

const Signup = () => {
    let mystyle = {
        marginTop: "80px",
        marginBottom: "60px",
        maxWidth: "500px"
    }
    const [emailReg, setemailReg] = useState('');
    const [usernameReg, setusernameReg] = useState('');
    const [passwordReg, setpasswordReg] = useState('');
    const [confirmpassword, setconfirmpassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [redirect, setRedirect] = useState(false);
    const [error, setError] = useState();

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
                            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" />
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
    
    const confirmPassWordHandler = (e) => {
        const confPass = e.target.value;
        setconfirmpassword(confPass);
        if (passwordReg !== confPass) {
            setError(true)
        } else {
            setError(false)
        }

    }
    return (
        <div className="container bg-dark text-light border border-dark w-75 ">
            <form className="container text-center  py-2 " style={mystyle}>
                <h1 className="mt-1" style={{ fontFamily: 'Droid Sans' }}>Please Sign-up</h1>
                <hr />
                <label htmlFor="exampleInputEmail1" className="form-label mt-3"
                ><h5>Email Address</h5></label>
                <input
                    name="emailReg"
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
                    name="usernameReg"
                    type="text"
                    className="form-control"
                    id="exampleInputUsername"
                    value={usernameReg}
                    onChange={(e) => { setusernameReg(e.target.value) }}
                />

                <label htmlFor="exampleInputPassword" className="form-label mt-3"
                ><h5>Password</h5></label
                >
                <input
                    name="passwordReg"
                    type="password"
                    className="form-control"
                    id="exampleInputPassword"
                    value={passwordReg}
                    onChange={(e) => { setpasswordReg(e.target.value) }}
                />
                <label htmlFor="exampleInputPassword1" className="form-label mt-3"
                ><h5>Confirm Password</h5></label
                >
                <input
                    name="confirmpassword"
                    type="password"
                    className="form-control"
                    id="exampleInputPassword1"
                    value={confirmpassword}
                    onChange={(e) => { confirmPassWordHandler(e) }}
                />
                {error && (
                    <div className="alert alert-warning " role="alert">
                        Password does not match!
                    </div>
                )}
                




                {!loading && (
                    <button className="btn btn-light mt-4  px-4" onClick={signupClick} type="button">Sign up</button>
                )}
                {loading && (
                    <button className="btn btn-light mt-4 px-4" type="button" disabled>
                        <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true" />
                        Loading...
                    </button>
                )}
            </form>
        </div>

    )
}

export default Signup