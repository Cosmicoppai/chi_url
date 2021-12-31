import React, { useState } from 'react';
import axios from 'axios';
import Nav from "../components/nav";
import Footer from "../components/footer"



const Signup = () => {
  let mystyle = {
    marginTop: "80px",
    marginBottom: "60px",
    maxWidth: "500px"
  }
  const [emailReg, setemailReg] = useState('');
  const [email, setemail] = useState('');
  const [usernameReg, setusernameReg] = useState('');
  const [username, setusername] = useState('');
  const [passwordReg, setpasswordReg] = useState('');
  const [confirmpassword, setconfirmpassword] = useState('');
  const [confirmpasswordregexerror, setConfirmpasswordregexerror] = useState();
  const [confirmpassworderror, setConfirmpassworderror] = useState();
  const [passworderror, setPassworderror] = useState();
  const [passwordregexerror, setPasswordregexerror] = useState();
  const [emailerror, setEmailerror] = useState();
  const [emailregexerror, setEmailregexerror] = useState();
  const [usernameerror, setUsernamerror] = useState();
  const [usernameregexerror, setUsernameregexrror] = useState();
  const [loading, setLoading] = useState(false);
  const [statusError, setstatusError] = useState(false);
  const [statuscodeError, setstatuscodeError] = useState('');

  let button = usernameerror === false && emailerror === false && passworderror === false &&
    confirmpassworderror === false && usernameregexerror === false && emailregexerror === false && passwordregexerror === false &&
    confirmpasswordregexerror === false;

  const signupClick = async (e) => {
    e.preventDefault();
    setLoading(true);

    await axios.post("add_user", {
      username: username,
      email: email,
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
        if (resp.status === 201) {
          setLoading(false);
          if (window.innerWidth < 600) {
            document.getElementById('mobilealertBar').style.display = 'block'
          }
          else {
            document.getElementById('alertBar').style.display = 'block'
          }
          setusernameReg('')
          setusername('')
          setemailReg('')
          setemail('')
          setpasswordReg('')
          setconfirmpassword('')
        }

      })
      .catch((confirmpasswordregexerror) => {
        setLoading(false);
        if (confirmpasswordregexerror.response.status === 403) {
          setstatusError(true)
          setstatuscodeError(confirmpasswordregexerror.response.data.detail)
        }
      })

  }

  const confirmPassWordHandler = (e) => {
    const confPass = e.target.value;
    setconfirmpassword(confPass);
    if (confPass === '') {
      setConfirmpassworderror(true);
      setConfirmpasswordregexerror(false)
    }
    else {
      setConfirmpassworderror(false);
    }
    if (passwordReg !== confPass) {
      setConfirmpasswordregexerror(true)
    } else {
      setConfirmpasswordregexerror(false)
    }

  }
  const PassWordHandler = (e) => {
    const Pass = e.target.value;
    setpasswordReg(Pass);
    const passtest = (PasswordParameter) => {
      let strongPassword = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})')
      return strongPassword.test(PasswordParameter)
    };

    if (Pass === '') {
      setPassworderror(true);
      setPasswordregexerror(false);
    }
    else {
      setPassworderror(false);
    }
    if (passtest(Pass)) {
      setPasswordregexerror(false);
    }
    else {
      setPasswordregexerror(true);
    }

  }
  const usernameHandler = (e) => {
    const Name = e.target.value;
    setusernameReg(Name);
    const NameValue = Name.toLowerCase()
    setusername(NameValue)
    if (Name === '') {
      setUsernamerror(true);
      setUsernameregexrror(false);
    }
    else {
      setUsernamerror(false);
    }
    if (Name.length < 12 && Name.length > 2) {
      setUsernameregexrror(false);
    }
    else {
      setUsernameregexrror(true);
    }

  }
  const emailHandler = (e) => {
    const Email = e.target.value;
    setemailReg(Email)
    const EmailValue = Email.toLowerCase()
    setemail(EmailValue);
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
      <div className="container bg-dark text-light border border-dark w-xl-50 w-lg-50 w-md-50 w-sm-75 w-100 ">
        <form className="container text-center  py-2 " style={mystyle}>
          <div className="alert alert-dark alert-dismissible fade show w-100 mx-auto" id='mobilealertBar' style={{ display: 'none' }} role="alert">
            <h6 className="alert-heading">A verification link has been sent to your email account</h6>
            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            <hr />
            <p className="mb-0">Please click on the link within 15 minutes to verify your account and login again to use our services!!!</p>
            <a type="button" href="/login" className="btn  btn-light ms-2" style={{ color: 'black' }}>Go to login page</a>
          </div>
          <div className="alert alert-dark alert-dismissible fade show w-75 mx-auto" id='alertBar' style={{ display: 'none' }} role="alert">
            <h4 className="alert-heading">A verification link has been sent to your email account</h4>
            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            <hr />
            <p className="mb-0">Please click on the link within 15 minutes to verify your account and login again to use our services!!!</p>
            <a type="button" href="/login" className="btn btn-lg btn-light ms-2" style={{ color: 'black' }}>Go to login page</a>
          </div>
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
            onChange={(e) => { emailHandler(e) }}
          />
          {emailerror && (
            <p className="text-danger" role="alert">
              Email is required!
            </p>
          )}
          {emailregexerror && (
            <p className="text-danger " role="alert">
              You have entered an invalid e-mail.
            </p>
          )}

          <label htmlFor="exampleInputUsername" className="form-label mt-3"
          ><h5>Username</h5>
          </label>
          <input
            name="usernameReg"
            type="text"
            className="form-control"
            id="exampleInputUsername"
            value={usernameReg}
            onChange={(e) => { usernameHandler(e) }}
          />
          {usernameerror && (
            <p className="text-danger " role="alert">
              Username is required!
            </p>
          )}
          {usernameregexerror && (
            <p className="text-danger " role="alert">
              Your username should consist of minimum 2 and maximum 11 characters.
            </p>
          )}
          <label htmlFor="exampleInputPassword" className="form-label mt-3"
          ><h5>Password</h5></label
          >
          <input
            name="passwordReg"
            type="password"
            className="form-control"
            id="exampleInputPassword"
            autocomplete="new-password"
            value={passwordReg}
            onChange={(e) => { PassWordHandler(e) }}
          />
          {passworderror && (
            <p className="text-danger " role="alert">
              Password is required!
            </p>
          )}
          {passwordregexerror && (
            <p className="text-danger " role="alert">
              Password must consist of minimum eight characters,at least one letter,number and special character
            </p>
          )}

          <label htmlFor="exampleInputPassword1" className="form-label mt-3"
          ><h5>Confirm Password</h5></label
          >
          <input
            name="confirmpassword"
            type="password"
            className="form-control"
            id="exampleInputPassword1"
            autocomplete="new-password"
            value={confirmpassword}
            onChange={(e) => { confirmPassWordHandler(e) }}
          />
          {confirmpassworderror && (
            <p className="text-danger " role="alert">
              Confirm Password is required!
            </p>
          )}
          {confirmpasswordregexerror && (
            <p className="text-danger" role="alert">
              Password does not match!
            </p>
          )}
          {statusError && (
            <p className="text-danger h5" role="alert">
              {statuscodeError}
            </p>
          )}

          {!loading && (
            <>
              {!button && (
                <button className="btn btn-light mt-4  px-4" type="submit" disabled>Sign up</button>
              )}
              {button && (
                <button className="btn btn-light mt-4  px-4" onClick={signupClick} type="submit">Sign up</button>
              )}
            </>
          )}
          {loading && (
            <button className="btn btn-light mt-4 px-4" type="button" disabled>
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

export default Signup
