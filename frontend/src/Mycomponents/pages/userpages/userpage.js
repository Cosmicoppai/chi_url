import { React, useState, useEffect } from 'react'
import { Search } from './search'
import axios from 'axios';
import Nav from "../components/nav";
import Footer from "../components/footer"
import './userpage.css'




const UserPage = () => {
    const [pagingStatus, setPagingstatus] = useState('');
    const [datas, setdatas] = useState([]);
    const [button, setbutton] = useState(false);
    const [datas1, setdatas1] = useState([]);

    useEffect(() => {
        const ac = new AbortController();
        const token1 = localStorage.getItem("token");
        axios.get('url-stats', {
            headers: {
                'Authorization': `Bearer ${token1}`,
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
        return () => ac.abort();
    }, [datas])

    const moreRequest = async (e) => {
        e.preventDefault();
        const token2 = localStorage.getItem("token");
        await axios.get(`url-stats/?paging_state=${pagingStatus}`
            ,
            {
                headers: {
                    'Authorization': `Bearer ${token2}`,
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
    return (
        < >
            <Nav />
            <Search />
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
    )
}

export default UserPage
