import React from 'react'

const Footer = () => {
    const myStyle = {
        backgroundColor: "#212529",
        marginTop: "50px",
    }
    return (
        <footer className="footer   text-light  " style={myStyle}>
            <div className="container text-center">
                Copyright &copy;Easer.com
            </div>
            <div className="container text-center">
            <span className="me-2"><a href="" target={'_blank'}><i className="bi bi-github "></i></a></span>
            <span className="me-2"><a href="" target={'_blank'}><i className="bi bi-instagram"></i></a></span>
            <span className="me-2"><a href="" target={'_blank'}><i className="bi bi-twitter"></i></a></span>
            <span className="me-2"><a href="" target={'_blank'}><i className="bi bi-reddit"></i></a> </span>  
            </div>
        </footer>
    )
}

export default Footer

