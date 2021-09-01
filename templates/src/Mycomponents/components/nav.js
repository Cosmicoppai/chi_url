import { React } from 'react';
import { Link, Redirect } from 'react-router-dom';

const Nav = () => {
    const logout = (e) => {
        e.preventDefault();
        localStorage.clear();
        return (
            <Redirect to="/login"></Redirect>
        )
    }

    return (
        <div>
            <nav className="navbar navbar-expand-md fixed-top navbar-light bg-light mb-4">
                <div className="container-fluid ">
                    <span className="navbar-brand  "  > <h2>Easer</h2></span>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    {
                        localStorage.getItem("token")
                            ?
                            <>
                                <ul className="navbar-nav me-auto mb-2 mb-2 mb-md-0 text-end">
                                </ul>
                                <div className="dropdown">
                                    <Link to="/user" className="btn  dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                        Welcome to Easer
                                    </Link>
                                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                        <li> <Link
                                            onClick={logout}
                                            className="btn  px-4" >Logout</Link></li>
                                    </ul>
                                </div>
                            </>
                            :
                            <>
                                <ul className="navbar-nav me-auto mb-2 mb-2 mb-md-0 text-end">
                                    <li className="nav-item">
                                        <Link to='/' className="nav-link " aria-current="page" >Home</Link>
                                    </li>
                                </ul>
                                <Link to="/login" type="button" className="btn btn-outline-dark px-4" >Login</Link>
                                <Link to="/signup" type="button" className="btn btn-dark px-4 mx-3" >Sign up</Link>
                            </>
                    }


                </div>
            </nav>
        </div>
    )
}

export default Nav
