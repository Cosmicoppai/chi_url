import React from 'react'
import { Main } from './main'
import { Page } from './page'
import Nav from '../components/nav'
import Footer from "../components/footer"
import { Link } from 'react-router-dom'
import './home.css'



const Home = () => {

    return (
        <div>
             <Main/>
            <div className="cover-container d-flex w-100 h-100 p-3 mt-5 flex-column">
            <header className="mb-5">
                    <div>
                        <Nav />
                    </div>
                </header>

                <main className="px-3 d-flex  justify-content-center flex-column" id='mystyle' >
                    <h1 className="text-center display-1"  id='style' >Welcome!</h1> 
                    <h1 className="text-center display-1"  id='style' >Welcome!</h1>

                    <div className="col-lg-6 mx-auto">
                        <p className="lead mb-4 text-center h3">We are URL shortener service that provide you to create short links from very long URLs. Our short links have the size of seven characters only, which makes them easier to type, present, or tweet. </p>
                        <div className="d-grid gap-2 d-sm-flex justify-content-sm-center mt-2">
                            <Link to="/signup" type="button" className="btn btn-dark btn-lg px-4 gap-3">Sign up</Link>
                            <Link to="/login" type="button" className="btn btn-outline-secondary btn-lg px-4">Login</Link>
                        </div>
                    </div>
                </main>
                <Page />


            </div>
            <Footer/>
        </div>
    )
}

export default Home