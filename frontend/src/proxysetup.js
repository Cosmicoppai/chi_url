const proxy = require("http-proxy-middleware")

module.exports = function(App){
    App.use(
        proxy("add_user",{
            target: "http://backend:8000/",
            changeOrigin : true
        })
    );
   
    App.use(
        proxy("token",{
            target:"http://backend:8000/",
            changeOrigin : true
        })
    );
    App.use(
        proxy("get_user/check/{username}",{
            target:"http://backend:8000/",
            changeOrigin : true
        })
    );
    App.use(
        proxy("add_url",{
            target:"http://backend:8000/",
            changeOrigin : true
        })
    );
    App.use(
        proxy("url-stats",{
            target:"http://backend:8000/",
            changeOrigin : true
        })
    );
    App.use(
        proxy(`url-stats/?paging_state=${pagingStatus}`,{
            target:"http://backend:8000/",
            changeOrigin : true
        })
    );
    App.use(
        proxy('send-code',{
            target:"http://backend:8000/",
            changeOrigin : true
        })
    );
};