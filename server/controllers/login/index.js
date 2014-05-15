'use strict';

exports.render = function(req, res) {
    var config = res.locals.config;
    var assetmanager = require(config.sroot+'/utils/assetsmanager')(config.sroot,'login');
    res.render('layouts/login', {assets:assetmanager.getCurrentAssets()});
};

/**
 * Auth
 */
exports.auth = function(passport) {
    return function(req, res,next) {
        passport.authenticate('local', function(err, user, info) {
            if (err) {
                return next(err);
            }
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
    };
};

/**
 * Logout
 */
exports.signout = function(req, res) {
    req.logout();
    res.redirect('/');
};