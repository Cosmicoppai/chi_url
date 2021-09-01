import React from 'react'

export const Page = () => {
    let mystyle = {
        backgroundColor: "#F8F9FA",
        marginTop: "-210px",
        marginBottom:"100px"
    }
    return (
        <>
            <div className="col-lg-6 col-md-8 mx-auto d-flex justify-content-center align-items-center text-center flex-column" style={mystyle}>
                <h1 className="fw-light mt-3">Short links, Big results</h1>
                <p className="lead text-muted">A URL shortener built with powerful tools to help you grow and protect your brand.</p>
                
            </div>

            {/* section */}
            <div className="container d-flex justify-content-center align-items-center text-center flex-column pt-5"  >
            <div className="row">
                <div className="col-lg-4">
                <img src="https://www.shorturl.at/img/icon-like.png" alt=""  />

                    <h2>Easy</h2>
                    <p>Easer is easy and fast, enter the long link to get your shortened link</p>
                </div>
                <div className="col-lg-4">
                    <img src="https://www.shorturl.at/img/icon-url.png" alt=""   />

                    <h2>Shortened</h2>
                    <p>Use any link, no matter what size, ShortURL always shortens</p>
                </div>
                <div className="col-lg-4">
                <img src="https://www.shorturl.at/img/icon-secure.png" alt=""   />
                    

                    <h2>Secure</h2>
                    <p>It is fast and secure, our service have HTTPS protocol and data encryption</p>
                </div>
                <div className="col-lg-4">
                <img src="https://www.shorturl.at/img/icon-responsive.png" alt=""   />


                    <h2>Devices</h2>
                    <p>Compatible with smartphones, tablets and desktop</p>
                </div>
                <div className="col-lg-4">
                <img src="https://www.shorturl.at/img/icon-unique.png" alt=""   />
                    

                    <h2>Reliable</h2>
                    <p>All links that try to disseminate spam, viruses and malware are deleted</p>
                </div>
                <div className="col-lg-4">
                <img src="https://www.shorturl.at/img/icon-statistics.png" alt=""   />


                    <h2>Statistics</h2>
                    <p>Check the amount of clicks that your shortened url received</p>
                </div>
            </div>
            </div>
        </>
    )
}

