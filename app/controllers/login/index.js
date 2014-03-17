'use strict';

exports.render = function(req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/admin');
    }
    res.render('layouts/login', {
        title: 'Nodblog » Signin',
        message: req.flash('error')
    });
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