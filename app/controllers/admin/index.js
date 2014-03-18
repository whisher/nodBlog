'use strict';

exports.render = function(config) {
    return function(req, res) {
        var currentSession = req.session.passport;
        var user = currentSession.user;
        res.cookie('USER',JSON.stringify(user) , { maxAge: 900000, httpOnly: false});
        var isProd = (process.env.NODE_ENV==='production');
        if(isProd){
           return res.sendfile('admin.html', { root: config.distFolder });
        }
        
        res.render('layouts/admin', {appTitle:'nodBlog Admin',user:user});
    }
};

