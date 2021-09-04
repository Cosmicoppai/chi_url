import { React, useState, useEffect } from 'react'
import { Search } from './search'
import axios from 'axios';



const UserPage = () => {
    const [pagingStatus, setPagingstatus] = useState('');
    const [datas, setdatas] = useState([]);
    // const token = localStorage.getItem("token");

    useEffect(() => {
        const token1 = localStorage.getItem("token");
        axios.get('url-stats', {
            headers: {
                'Authorization': `Bearer ${token1}`,
                'accept': 'application/json'
            }
        })
            .then((resp) => {
                console.log(resp.data.paging_state); //check the resp
                if (resp.status === 200) {
                    setPagingstatus(resp.data.paging_state)
                    setdatas(resp.data)
                }

            })
            .catch((error) => {
                console.error(error); //check the error
            })
    }, [])

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
                console.log(resp); //check the resp
                if (resp.status === 200) {
                    setPagingstatus(resp.data.paging_state);
                    setdatas(resp.data)
                }
            }, [])
            .catch((error) => {
                // console.error(error); //check the error
            })
    }

    

    return (
        <div>
            <Search />
            <table className="table table-bordered">
                <thead className="table-dark">
                    <tr>
                        <th scope="col">Long Url</th>
                        <th scope="col">Shortened Url</th>
                        <th scope="col">Number of clicks</th>
                    </tr>
                </thead>
                <tbody>
        {datas.map((data,index)=>{
            <tr key={index}>
            <td>{data.url}</td>
            <td>{data.short_url}</td>
            <td>{data.resolves}</td>
          </tr>
        })}
                </tbody>
            </table>
            <button type="button" className="btn btn-dark mt-2 d-grid mx-auto btn-lg mb-3" onClick={moreRequest}>More</button>
        </div>
    )
}

export default UserPage