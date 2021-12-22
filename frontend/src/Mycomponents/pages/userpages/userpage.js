import { React, useState, useEffect } from 'react'
import axios from 'axios';
import Nav from "../components/nav";
import Footer from "../components/footer"
import './userpage.css'
import ErrorPage from '../Homepages/errorPage';


//eslint-disable-next-line
const HTTP_URL_VALIDATOR_REGEX = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;

const UserPage = () => {
    const [pagingStatus, setPagingstatus] = useState('');
    const [datas, setdatas] = useState([]);
    const [button, setbutton] = useState(false);
    const [datas1, setdatas1] = useState([]);
    const [link, setLink] = useState('');
    const [short, setShort] = useState('');
    const [error, setError] = useState(false);
    const [emptyError, setemptyError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const user = localStorage.getItem("token");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (checkLink(link) && link !== '') {
            setemptyError(false)
            setError(false)
            getLink(link);
            setLink('');
            setIsLoading(!isLoading);
        }
        else if (link === '') {
            setemptyError(true)
            setError(false)
        }
        else {
            setError(true)
            setemptyError(false)
        }

    }

    // Link Validation Function
    const checkLink = (string) => {
        // Regex to check if string is a valid URL
        return string.match(HTTP_URL_VALIDATOR_REGEX);
    };

    // Function that calls the backend is valid
    const getLink = async () => {
        const token = localStorage.getItem("token");
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
                // console.log(response.data.short_url); //check the resp
                setIsLoading(false);
                if (response.status === 201) {
                    setShort(response.data.short_url);
                }
            })
            .catch((error) => {
                setIsLoading(false);
                // console.error(error); //check the error
            })

    }

    const getUrls = () => {
        const token = localStorage.getItem("token");
        axios.get('url-stats', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'accept': 'application/json'
            }
        })
            .then((resp) => {
                // console.log(resp); //check the resp
                if (resp.data.paging_state === null) {
                    setPagingstatus(resp.data.paging_state)
                    setdatas(resp.data.stats)
                    setbutton(false)
                }
                else {
                    setPagingstatus(resp.data.paging_state)
                    setdatas(resp.data.stats)
                    setbutton(true)
                }

            })
            .catch((error) => {
                // console.error(error); //check the error
            })
    }
    useEffect(() => {
        const ac = new AbortController();
        getUrls()
        return () => ac.abort();
    }, [])

    const moreRequest = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        await axios.get(`url-stats/?paging_state=${pagingStatus}`
            ,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'accept': 'application/json',
                }
            })
            .then((resp) => {
                // console.log(resp); //check the resp
                if (resp.data.paging_state === null) {
                    setPagingstatus(resp.data.paging_state);
                    setdatas1(resp.data.stats);
                    setbutton(false)
                }
                else {
                    setPagingstatus(resp.data.paging_state);
                    setdatas1(resp.data.stats);
                    setbutton(true);
                }
            })
            .catch((error) => {
                // console.error(error); //check the error
            })
    }

    // stylesheet
    let mystyle = {
        backgroundColor: "#F8F9FA",
        marginTop: "150px",
    }
    return (
        < >
            {user && (
                < >
                    <Nav />
                    <div className=" mb-5  " style={mystyle}>
                        <form className="d-flex justify-content-center align-items-center text-center flex-column w-100 " >
                            <div className="mb-3 px-5 w-100 " >
                                <label htmlFor="exampleInputurl" className="form-label"><h1>Paste the URL to be shortened</h1></label>
                                <input onSubmit={(e) => handleSubmit(e)} type="text" className="form-control " placeholder="Shorten your link" id="exampleInputurl" value={link} onChange={(e) => setLink(e.target.value)} />
                            </div>
                            {error && (
                                <p className="text-danger " role="alert">
                                    Yikes! That's not a valid url
                                </p>
                            )}
                            {emptyError && (
                                <p className="text-danger " role="alert">
                                    Url is required!!
                                </p>
                            )}
                            {!isLoading && (
                                <button onClick={(e) => {
                                    handleSubmit(e)
                                    setTimeout(() => {
                                        getUrls()
                                    }, 5000);
                                }} type="submit" className="btn btn-primary mb-1 px-5">Submit</button>
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
                                <h4 ><span type="text" className="badge  bg-dark px-5" >https://pbl.asia/{short}</span> </h4>
                                <button type="button" id='btnClick' className="btn btn-outline-dark" onClick={() => navigator.clipboard.writeText(`https://pbl.asia/${short}`)}>Copy</button>
                            </div>
                        )}
                    </div>
                    <div className="container" >
                        <table className="table table-bordered text-center">
                            <thead className="table-dark">
                                <tr>
                                    <th scope="col" className="w-25">Long Url</th>
                                    <th scope="col" className="w-25">Shortened Url</th>
                                    <th scope="col" className="w-25">Number of clicks</th>
                                </tr>
                            </thead>
                            <tbody className="w-25">
                                {(datas || []).map((data, id) => {
                                    return <tr key={id}>
                                        <td> <a className="visitedLink" href={data.url} rel="noreferrer" target="_blank">{data.url}</a> </td>
                                        <td><a className="visitedLink" href={data.short_url} rel="noreferrer" target="_blank">{data.short_url}</a></td>
                                        <td>{data.resolves}</td>
                                    </tr>
                                })}
                                {(datas1 || []).map((data, id) => {
                                    return <tr key={id}>
                                        <td> <a className="visitedLink" href={data.url} rel="noreferrer" target="_blank">{data.url}</a> </td>
                                        <td><a className="visitedLink" href={data.short_url} rel="noreferrer" target="_blank">{data.short_url}</a></td>
                                        <td>{data.resolves}</td>
                                    </tr>
                                })}


                            </tbody>
                        </table>
                        {button && (
                            <button type="button" className="btn btn-dark mt-2 d-grid mx-auto btn-lg mb-3" onClick={moreRequest}>More</button>
                        )}
                    </div>
                    <Footer />
                </>
            )}
            {!user && (
                < >
                    <ErrorPage />
                </>
            )}
        </>
    )
}

export default UserPage
