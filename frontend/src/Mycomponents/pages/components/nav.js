import { React, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Nav = () => {
    const [user, setUser] = useState({});
    const [active, setActive] = useState({});
    useEffect(() => {
        setInterval(() => {
    const active = localStorage.getItem("active");
            const user = localStorage.getItem("token");
            setUser(user);
            setActive(active);
        }, 1)
    });

    const logout = () => {
        localStorage.clear();
        window.location.replace("/login")
    }

    return (
        <div>


            {!user && !active && (
                <>
                    <nav className="navbar navbar-expand-md fixed-top navbar-dark bg-dark mb-4">
                        <div className="container-fluid ">
                            <Link to="/" className="navbar-brand  "  > <h2>小URL</h2></Link>
                            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                                <span className="navbar-toggler-icon"></span>
                            </button>
                            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                                <ul className="navbar-nav me-auto mb-2 mb-2 mb-md-0 text-end">
                                </ul>
                                <Link to="/login" type="button" className="btn btn-outline-light px-4" >Login</Link>
                                <Link to="/signup" type="button" className="btn btn-light px-4 mx-3" >Sign up</Link>
                            </div>
                        </div>

                    </nav>
                </>
            )}
            {user && active && (
                <>
                    <nav className="navbar navbar-expand-md fixed-top navbar-dark bg-dark mb-4">
                        <div className="container-fluid ">
                            <Link to="/user" className="navbar-brand "  > <h2>小URL</h2></Link>
                            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                                <span className="navbar-toggler-icon"></span>
                            </button>
                            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                                <ul className="navbar-nav me-auto mb-2 mb-2 mb-md-0 text-end">
                                </ul>
                                <div className="dropdown">
                                    <Link to="/user" className="btn btn-light  dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                        Welcome to 小URL
                                    </Link>
                                    <ul className="dropdown-menu" >
                                        <li ><button onClick={logout} className="dropdown-item text-center">Logout</button></li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                    </nav>
                </>
            )}
        </div>


    )
}

export default Nav
