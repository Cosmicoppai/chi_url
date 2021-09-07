import React from 'react'
import './footer.css';
const Footer = () => {
    
    return (
        <footer className="footer mt-auto py-1 bg-dark text-light  cont" >
            <div className="container text-center ">
                 Copyright &copy;小URL.com   
            </div>
            <div className="container text-center">
                <span className="me-2"><a href="https://github.com/Cosmicoppai/chi_url" target={'_blank'}><i className="bi bi-github "></i></a></span>
                <span className="me-2"><a href="" target={'_blank'}><i className="bi bi-twitter"></i></a></span>
            </div>
        </footer>
        
    )
}

export default Footer

