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

    const [email, setEmail] = useState('');
    const [passWord, setpassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [redirectlogin, setRedirectlogin] = useState(false);
    const [redirectverify, setRedirectverify] = useState(false);
    const [emailError, setEmailerror] = useState();
    const [emailregexError, setEmailregexerror] = useState();
    const [alreadyerror, setAlreadyrror] = useState();
    const [passworderror, setPassworderror] = useState();


    let button = emailError === false && passworderror === false;

    const loginClick = async (e) => {
        e.preventDefault();
        setLoading(true);
        await axios({
            url: "get_token",
            method: "POST",
            data: 'grant_type=password&email=' + email + '&password=' + passWord,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;application/json',
                'Access-Control-Allow-Origin': '*',
                'withCredentials': 'true'
            }
        }).then((resp) => {
            setLoading(false);
            localStorage.setItem("token", resp.data.access_token)
            localStorage.setItem("veryEmail", resp.data.access_token)
            localStorage.setItem("active", resp.data.is_active)
            if (resp.data.is_active === true) {
                setRedirectlogin(true);
            }
            else {
                setRedirectverify(true);
            }
        })
            .catch((error) => {
                setLoading(false);
                if (error.response.status === 400) {
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
    const emailHandler = (e) => {
        const Email = e.target.value;
        setEmail(Email);
        const passtest = (emailParameter) => {
            let strongemail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return strongemail.test(String(emailParameter).toLowerCase());
        };
        if (Email === '') {
            setEmailerror(true);
            setEmailregexerror(false);
        }
        else {
            setEmailerror(false);
        }
        if (passtest(Email)) {
            setEmailregexerror(false);
        }
        else {
            setEmailregexerror(true);
        }

    }


    return (
        <>
            <Nav />
            <div className="container bg-dark text-light border border-dark w-50">
                <form className="container text-center " style={mystyle}>
                    <h1 style={{ fontFamily: 'Droid Sans' }}>Login</h1>
                    <hr />
                    <label htmlFor="exampleInputemailid mt-5" className="form-label mt-3"
                    ><h5>Email Id</h5></label
                    >
                    <input
                        type="text"
                        className="form-control"
                        id="exampleInputemailid"
                        value={email}
                        onChange={(e) => { emailHandler(e) }}
                    />
                    {emailError && (
                        <p className="text-danger " role="alert">
                            Email is required!
                        </p>
                    )}
                    {emailregexError && (
                        <p className="text-danger " role="alert">
                            You have entered an invalid e-mail.
                        </p>
                    )}
                    <label htmlFor="exampleInputPassword1 " className="form-label mt-3"
                    ><h5>Password</h5></label>
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
                            Invalid Password or Email!!!
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
