import { React, useState, useEffect } from 'react'
import axios from 'axios';
import Nav from "../components/nav";
import Footer from "../components/footer"
import './userpage.css'
import ErrorPage from '../Homepages/errorPage';
import { Navigate } from 'react-router-dom';


//eslint-disable-next-line
const HTTP_URL_VALIDATOR_REGEX = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;

const UserPage = () => {
    const [pagingStatus, setPagingstatus] = useState('');
    const [data, setData] = useState([]);
    const [moreData, setmoreData] = useState([]);
    const [link, setLink] = useState('');
    const [short, setShort] = useState('');
    const [originDomain, setoriginDomain] = useState('');
    const [dataTable, setdataTable] = useState(false);
    const [morebutton, setMorebutton] = useState(false);
    const [error, setError] = useState(false);
    const [redirect, setRedirect] = useState(false);
    const [mobileTable, setmobileTablet] = useState(false);
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
                    setoriginDomain(window.location.origin + '/')
                    setShort(response.data.short_url);
                }
            })
            .catch((error) => {
                setIsLoading(false);
                if (error.response.status === 401 || error.response.status === 403) {
                    localStorage.clear()
                    setRedirect(true)
                }
            })

    }

    const getUrls = () => {
        const token = localStorage.getItem("token");
        axios.get('url_stats', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'accept': 'application/json'
            }
        })
            .then((resp) => {
                // console.log(resp); //check the resp
                if (window.innerWidth < 600) {
                    setmobileTablet(true)
                }
                else {
                    setmobileTablet(false)
                }
                let data = resp.data.stats
                if (data.length === 0) {
                    setdataTable(false)
                }
                else {
                    setdataTable(true)
                }
                if (resp.data.paging_state === null) {
                    setPagingstatus(resp.data.paging_state)
                    setData(resp.data.stats)
                    setMorebutton(false)
                }
                else {
                    setPagingstatus(resp.data.paging_state)
                    setData(resp.data.stats)
                    setMorebutton(true)
                }

            })
            .catch((error) => {
                if (error.response.status === 401 || error.response.status === 403 ) {
                    localStorage.clear()
                    setRedirect(true)
                }
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
        await axios.get(`url_stats/?paging_state=${pagingStatus}`
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
                    setmoreData(resp.data.stats);
                    setMorebutton(false)
                }
                else {
                    setPagingstatus(resp.data.paging_state);
                    setmoreData(resp.data.stats);
                    setMorebutton(true);
                }
            })
            .catch((error) => {
                // console.error(error); //check the error
            })
    }
    if (redirect) {
        return <Navigate to="/login" />
    }
    // stylesheet
    let mystyle = {
        backgroundColor: "#F8F9FA",
        marginTop: "150px",
    }
    return (
        <>
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
                                    Yikes! That's not a valid originDomain
                                </p>
                            )}
                            {emptyError && (
                                <p className="text-danger " role="alert">
                                    Url is required!!
                                </p>
                            )}
                            {!isLoading && (
                                <morebutton onClick={(e) => {
                                    handleSubmit(e)
                                    setTimeout(() => {
                                        getUrls()
                                    }, 5000);
                                }} type="submit" className="btn btn-primary mb-1 px-5">Submit</morebutton>
                            )}
                            {isLoading && (
                                <morebutton className="btn btn-primary" type="morebutton" disabled>
                                    <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                                    Loading...
                                </morebutton>
                            )}
                        </form>
                        {short && (
                            <div className="d-flex justify-content-center align-items-center text-center flex-column w-100 ">
                                <h4 ><span type="text" className="badge  bg-dark px-5" >{originDomain}{short}</span> </h4>
                                <morebutton type="morebutton" id='btnClick' className="btn btn-outline-dark" onClick={() => navigator.clipboard.writeText(`${originDomain}${short}`)}>Copy</morebutton>
                            </div>
                        )}
                    </div>
                    {mobileTable && (
                    <div className="container mb-5">
                        <div class="center-block fix-width scroll-inner tableMargin">
                            <table class="table1 table-striped text-center table-bordered">
                                {dataTable && (
                                    <>
                                        <thead className="bg-dark text-light" >
                                            <tr>
                                                <th scope="col" className="w-25">Long Url</th>
                                                <th scope="col" className="w-25">Shortened Url</th>
                                                <th scope="col" className="w-25">Number of clicks</th>
                                            </tr>
                                        </thead>
                                        <tbody className="w-25">
                                            {(data || []).map((data, id) => {
                                                return <tr key={id}>
                                                    <td> <a className="visitedLink" href={data.url} rel="noreferrer" target="_blank">{data.url}</a> </td>
                                                    <td><a className="visitedLink" href={data.short_url} rel="noreferrer" target="_blank">{data.short_url}</a></td>
                                                    <td>{data.resolves}</td>
                                                </tr>

                                            })}
                                            {(moreData || []).map((data, id) => {
                                                return <tr key={id}>
                                                    <td> <a className="visitedLink" href={data.url} rel="noreferrer" target="_blank">{data.url}</a> </td>
                                                    <td><a className="visitedLink" href={data.short_url} rel="noreferrer" target="_blank">{data.short_url}</a></td>
                                                    <td>{data.resolves}</td>
                                                </tr>
                                            })}


                                        </tbody>
                                    </>

                                )}
                            </table>
                        </div>
                    </div>
                    )}
                    {!mobileTable &&(
                    <div className="container mb-5">
                        <table className="table table-bordered text-center tableMargin">
                            {dataTable && (
                                <>

                                    <thead className="table-dark" >
                                        <tr>
                                            <th scope="col" className="w-25">Long Url</th>
                                            <th scope="col" className="w-25">Shortened Url</th>
                                            <th scope="col" className="w-25">Number of clicks</th>
                                        </tr>
                                    </thead>
                                    <tbody className="w-25">
                                        {(data || []).map((data, id) => {
                                            return <tr key={id}>
                                                <td> <a className="visitedLink" href={data.url} rel="noreferrer" target="_blank">{data.url}</a> </td>
                                                <td><a className="visitedLink" href={data.short_url} rel="noreferrer" target="_blank">{data.short_url}</a></td>
                                                <td>{data.resolves}</td>
                                            </tr>

                                        })}
                                        {(moreData || []).map((data, id) => {
                                            return <tr key={id}>
                                                <td> <a className="visitedLink" href={data.url} rel="noreferrer" target="_blank">{data.url}</a> </td>
                                                <td><a className="visitedLink" href={data.short_url} rel="noreferrer" target="_blank">{data.short_url}</a></td>
                                                <td>{data.resolves}</td>
                                            </tr>
                                        })}


                                    </tbody>
                                </>

                            )}
                        </table>
                        {morebutton && (
                            <morebutton type="morebutton" className="btn btn-dark mt-2 d-grid mx-auto btn-lg mb-3" onClick={moreRequest}>More</morebutton>
                        )}
                    </div>
                    )}
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
