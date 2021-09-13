import { React, useState, useEffect } from 'react'
import { Search } from './search'
import axios from 'axios';




const UserPage = () => {
    const [pagingStatus, setPagingstatus] = useState('');
    const [datas, setdatas] = useState([]);
    const [button, setbutton] = useState(true);
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
                if (resp.data.paging_state === null ) {
                    setPagingstatus(resp.data.paging_state)
                    setdatas(resp.data.stats)
                    setbutton(false)
                }
                else{
                    setPagingstatus(resp.data.paging_state)
                    setdatas(resp.data.stats)
                    setbutton(true)
                }

            })
            .catch((error) => {
                // console.error(error); //check the error
            })
            return () => ac.abort();
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
                // console.log(resp); //check the resp
                if (resp.data.paging_state === null) {
                    setPagingstatus(resp.data.paging_state);
                    setdatas1(resp.data.stats);
                    setbutton(false)
                }
                else{
                    setPagingstatus(resp.data.paging_state);
                    setdatas1(resp.data.stats);
                    setbutton(true);
                }
            })
            .catch((error) => {
                // console.error(error); //check the error
            })
    }
    
    // console.log(datas)
    const columns = datas[0] && Object.keys(datas[0])
    const columns1 = datas1[0] && Object.keys(datas1[0])
    return (
        <div >
            <Search />
            <div className="container" >
                <table className="table table-bordered text-center">
                    <thead className="table-dark">
                        <tr>
                            <th scope="col" className="w-25">Long Url</th>
                            <th scope="col"className="w-25">Shortened Url</th>
                            <th scope="col"className="w-25">Number of clicks</th>
                        </tr>
                    </thead>
                    <tbody className="w-25">
                        {datas.map((row,pos)=> <tr className="w-25" key={pos}>
                            {
                                columns.map((column,col) => <td className="w-25" key={col}>{row[column]}</td>)
                            }
                        </tr>)}
                        {datas1.map((row,index) => <tr className="w-25" key={index} >
                            {
                                columns1.map((column,ind) => <td className="w-25" key={ind}>{row[column]}</td>)
                            }
                        </tr>)}
                    </tbody>
                </table>
                {button &&(
                <button type="button" className="btn btn-dark mt-2 d-grid mx-auto btn-lg mb-3" onClick={moreRequest}>More</button>
                )}
            </div>
        </div>
    )
}

export default UserPage
