import { React,useState ,useEffect} from 'react';
import { Link, useHistory } from 'react-router-dom';

const Nav = () => {
    const [user, setUser] = useState({});
    useEffect(() => {
        setInterval(() => {
            const user = localStorage.getItem("token");
            setUser(user);
        },3000)
    });

    const History = useHistory();
    const logout = () => {
        localStorage.clear();
        History.push('/login')
    }

    return (
        <div>

            <nav className="navbar navbar-expand-md fixed-top navbar-light bg-light mb-4">
                <div className="container-fluid ">
                    <Link to ="/" className="navbar-brand  "  > <h2>Easer</h2></Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    {!user && (
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav me-auto mb-2 mb-2 mb-md-0 text-end">
                            </ul>
                            <Link to="/login" type="button" className="btn btn-outline-dark px-4" >Login</Link>
                            <Link to="/signup" type="button" className="btn btn-dark px-4 mx-3" >Sign up</Link>
                        </div>
                    )}
                    {user && (
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav me-auto mb-2 mb-2 mb-md-0 text-end">
                            </ul>
                            <div className="dropdown">
                                <Link to="/user" className="btn  dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                    Welcome to Easer
                                </Link>
                                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                    <li 
                                        onClick={logout}
                                        className="btn  px-4" >Logout</li>
                                </ul>
                            </div>
                        </div>
                    )}


                </div>
            </nav>

        </div>
    )
}

export default Nav
