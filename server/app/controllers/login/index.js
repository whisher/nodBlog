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
/**
 * Session
 */
exports.auth = function(req, res) {
    res.redirect('/admin');
};
/**
 * Logout
 */
exports.signout = function(req, res) {
    req.logout();
    res.redirect('/');
};