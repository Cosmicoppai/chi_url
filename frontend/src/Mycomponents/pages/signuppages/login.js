import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import Nav from "../components/nav";
import Footer from "../components/footer"


const Login = () => {
    let mystyle = {
        marginTop: "130px",
        marginBottom: "220px",
        maxWidth: "500px"
    }

    const [usernameReg, setusernameReg] = useState('');
    const [username, setUsername] = useState('');
    const [passWord, setpassword] = useState('');
    const [usernameerror, setUsernamerror] = useState();
    const [passworderror, setPassworderror] = useState();
    const [loading, setLoading] = useState(false);
    const [redirectuser, setRedirectuser] = useState(false);
    const [redirectverify, setRedirectverify] = useState(false);
    const [statuscodeError, setStatuscodeerror] = useState();


    let button = usernameerror === false && passworderror === false;

    const loginClick = async (e) => {
        e.preventDefault();
        setLoading(true);
        await axios({
            url: "get_token",
            method: "POST",
            data: 'grant_type=password&username=' + username + '&password=' + passWord,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;application/json',
                'Access-Control-Allow-Origin': '*',
                'withCredentials': 'true'
            }
        }).then((resp) => {
            setLoading(false);
            localStorage.setItem("token", resp.data.access_token)
            localStorage.setItem("active", resp.data.is_active)
                if (resp.data.is_active === true) {
                    setRedirectuser(true);
                }
                else if (resp.data.is_active === false) {
                    setRedirectverify(true);
                }
        })
            .catch((error) => {
                setLoading(false);
                if (error.response.status === 403) {
                    setStatuscodeerror(true)
                }
            })


    }
    if (redirectuser) {
        return <Navigate to="/user" />
    }
    if (redirectverify) {
        return <Navigate to="/verify" />
    }
    const PassWordHandler = (e) => {
        const Pass = e.target.value;
        setpassword(Pass);
        if (Pass === '') {
            setPassworderror(true);
        }
        else {
            setPassworderror(false);
        }

    }
    const usernameHandler = (e) => {
        const Name = e.target.value;
        setusernameReg(Name);
        const NameValue = Name.toLowerCase()
        setUsername(NameValue)
        if (Name === '') {
            setUsernamerror(true);
        }
        else {
            setUsernamerror(false);
        }

    }

    return (
        <>
            <Nav />
            <div className="container bg-dark text-light border border-dark w-xl-50 w-lg-50 w-md-50 w-sm-70 w-75">
                <form className="container text-center " style={mystyle}>
                    <h1 style={{ fontFamily: 'Droid Sans' }}>Login</h1>
                    <hr />
                    <label htmlFor="exampleInputUsername mt-5" className="form-label mt-3"
                    ><h5>Username</h5></label
                    >
                    <input
                        type="text"
                        className="form-control  "
                        id="exampleInputUsername"
                        value={usernameReg}
                        onChange={(e) => { usernameHandler(e) }}
                    />
                    {usernameerror && (
                        <p className="text-danger " role="alert">
                            Username is required!
                        </p>
                    )}
                    <label htmlFor="exampleInputPassword1 " className="form-label mt-3"
                    ><h5>Password</h5></label
                    >
                    <input
                        type="password"
                        className="form-control"
                        id="exampleInputPassword1"
                        value={passWord}
                        onChange={(e) => { PassWordHandler(e) }}
                    />
                    {passworderror && (
                        <p className="text-danger " role="alert">
                            Password is required!
                        </p>
                    )}
                    {statuscodeError && (
                        <p className="text-danger h5" role="alert">
                            Invalid Username or Password!!!
                        </p>
                    )}
                    {!loading && (

                        <>
                            {!button && (
                                <button className="btn btn-light mt-3 px-4" type="submit" disabled>Log in</button>
                            )}
                            {button && (
                                <button className="btn btn-light mt-3 px-4" type="submit" onClick={loginClick}>Log in</button>
                            )}
                        </>
                    )}
                    {loading && (
                        <button className="btn btn-light mt-3 px-4" type="button" disabled>
                            <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true" />
                            Loading...
                        </button>
                    )}
                </form>
            </div>
            <Footer />
        </>
    )
}


export default Login
