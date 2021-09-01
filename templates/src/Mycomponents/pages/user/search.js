import React, { useState } from 'react'
import axios from 'axios';

const HTTP_URL_VALIDATOR_REGEX = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;

export const Search = () => {
    const [link, setLink] = useState('');
    const [short, setShort] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const token = localStorage.getItem("token");


    const baseUrl = "http://127.0.0.1:8000/";
    // console.log(link);
    const handleSubmit = (e) => {
        e.preventDefault();
        if (checkLink(link)) {
            getLink(link);
            setLink('');
            setIsLoading(!isLoading);
        }
        // console.log(link);
    }

    // Link Validation Function
    const checkLink = (string) => {
        // Regex to check if string is a valid URL
        return string.match(HTTP_URL_VALIDATOR_REGEX);
    };

    // Function that calls the backend is valid
    const getLink = async () => {
        await axios.post('add_url', {
            url: link
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': 'true',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => {
                // console.log(response.data.shorturl); //check the resp
                setIsLoading(false);
                if (response.status === 201) {
                    setShort(response.data.shorturl);
                }
                else if (response.status === 401) {
                    <div class="alert alert-warning alert-dismissible fade show" role="alert">
                        <strong>Error!</strong> Incorrect username or password!
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                }
            })
            .catch((error) => {
                setIsLoading(false);
                // console.error(error); //check the error
            })

    }

    // Copy function used to copy url
    const copyfunction = (e) => {
        e.preventDefault();
        var copyText = document.getElementById("myInput");
        copyText.select();
        copyText.setSelectionRange(0, 99999);
        navigator.clipboard.writeText(copyText.value);
        alert("Copied the text: " + copyText.value);
    }


// stylesheet
let mystyle = {
    backgroundColor: "#F8F9FA",
    marginTop: "150px",
}


    return (
        <>
            <div className="container mb-5 " style={mystyle}>
                <form className="d-flex justify-content-center align-items-center text-center flex-column  " >
                    <div className="mb-3 px-5 w-75 " >
                        <label htmlFor="exampleInputurl" className="form-label"><h1>Paste the URL to be shortened</h1></label>
                        <input onSubmit={(e) => handleSubmit(e)} type="text" className="form-control " placeholder="Shorten your link" id="exampleInputurl" value={link} onChange={(e) => setLink(e.target.value)} />
                    </div>
                    {!isLoading && (
                        <button onClick={(e) => handleSubmit(e)} type="submit" className="btn btn-primary mb-1 px-5">Submit</button>
                    )}
                    {isLoading && (
                        <button className="btn btn-primary" type="button" disabled>
                            <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                            Loading...
                        </button>
                    )}
                </form>
                {short && (
                    <div className="d-flex justify-content-center align-items-center text-center flex-column w-100 ">
                        <h4><span type="text" className="badge  bg-dark px-5" id="myInput"> `{baseUrl}{short}`</span> </h4>
                        <button type="button" onclick={copyfunction} class="btn btn-outline-dark">Copy</button>
                    </div>
                )}
            </div>
        </>
    )
}
