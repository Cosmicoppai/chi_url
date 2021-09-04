import React from 'react';


export const Main = () => {
    const myStyle = {
        width: '80 %',
        height: '400px',
        borderRadius: '21px 21px 0 0'
}

return (
    <div className="bg-dark me-md-3 pt-3 px-3 pt-md-5 px-md-5 text-center text-white overflow-hidden w-100 border-0" >
        <div className="my-3 ">
            <p className="lead py-2"></p>
        </div>
        <div className="bg-light shadow-sm mx py-auto " style={myStyle}></div>
    </div>
    
)
}
