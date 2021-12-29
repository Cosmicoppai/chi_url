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

    const [userName, setusername] = useState('');
    const [userNamereg, setusernamereg] = useState('');
    const [passWord, setpassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [redirectlogin, setRedirectlogin] = useState(false);
    const [redirectverify, setRedirectverify] = useState(false);
    const [usernameerror, setUsernamerror] = useState();
    const [passworderror, setPassworderror] = useState();
    const [alreadyerror, setAlreadyrror] = useState();


    let button = usernameerror === false && passworderror === false;

    const loginClick = async (e) => {
        e.preventDefault();
        setLoading(true);
        await axios({
            url: "get_token",
            method: "POST",
            data: 'grant_type=password&username=' + userNamereg + '&password=' + passWord,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;application/json',
                'Access-Control-Allow-Origin': '*',
                'withCredentials': 'true'
            }
        }).then((resp) => {
            setLoading(false);
            localStorage.setItem("token", resp.data.access_token)
            localStorage.setItem("verifyMail", resp.data.access_token)
            localStorage.setItem("active", resp.data.is_active)
            function redirect(){
                if (resp.data.is_active === true) {
                    setRedirectlogin(true);
                }
                else {
                    setRedirectverify(true);
                }
            }
            setTimeout(() => {
                redirect()
            }, 3000);
        })
            .catch((error) => {
                setLoading(false);
                if (error.response.status === 403) {
                    setAlreadyrror(true)
                }
            })


    }
    if (redirectlogin) {
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
        setusername(Name);
        const NameValue = Name.toLowerCase()
        setusernamereg(NameValue)
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
            <div className="container bg-dark text-light border border-dark w-50">
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
                        value={userName}
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
                    {alreadyerror && (
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
