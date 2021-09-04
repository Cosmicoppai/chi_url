const proxy = require("http-proxy-middleware")

module.exports = function(App){
    App.use(
        proxy("add_user",{
            target:"http://127.0.0.1:8000/",
            changeOrigin : true
        })
    );
   
    App.use(
        proxy("token",{
            target:"http://127.0.0.1:8000/",
            changeOrigin : true
        })
    );
    App.use(
        proxy("get_user/check/{username}",{
            target:"http://127.0.0.1:8000/",
            changeOrigin : true
        })
    );
    App.use(
        proxy("add_url",{
            target:"http://127.0.0.1:8000/",
            changeOrigin : true
        })
    );
    App.use(
        proxy("url-stats",{
            target:"http://127.0.0.1:8000/",
            changeOrigin : true
        })
    );
    App.use(
        proxy(`url-stats/?paging_state=${pagingStatus}`,{
            target:"http://127.0.0.1:8000/",
            changeOrigin : true
        })
    );
    App.use(
        proxy('send-code',{
            target:"http://127.0.0.1:8000/",
            changeOrigin : true
        })
    );
};