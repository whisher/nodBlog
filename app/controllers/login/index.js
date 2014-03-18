'use strict';
exports.render = function(config) {
    return function(req, res) {
        if (req.isAuthenticated()) {
            return res.redirect('/admin');
        }
        var isProd = (process.env.NODE_ENV==='production');
        if(isProd){
           return res.sendfile('login.html', { root: config.distFolder });
        }
        res.render('layouts/login', {appTitle:'nodBlog » Signin'});
    }
};

exports.auth = function(passport) {
     return function(req, res,next) {
         passport.authenticate('local', function(err, user, info) {
            if (err) { return next(err); }
                if (!user) { 
                    return res.send(403); 
                }
                req.logIn(user, function(err) {
                    if (err) { 
                            return next(err); 
                    }
                    return res.json(200,{data:user.email}); 
                });
        })(req, res, next);
     }
}
/**
 * Logout
 */
exports.signout = function(req, res) {
    req.logout();
    res.redirect('/');
};