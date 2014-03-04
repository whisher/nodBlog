'use strict';

var crypto = require('crypto');

exports.render = function(req, res) {
    crypto.randomBytes(48, function(ex, buf) {
        var token = buf.toString('hex');
        res.cookie('XSRF-TOKEN', token, { maxAge: 900000, httpOnly: false});
    });
    res.render('default/index', {appTitle:'nodBlog'});
};
