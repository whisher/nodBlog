'use strict';

var crypto = require('crypto');

function uid(len) {
    return crypto.randomBytes(Math.ceil(len * 3 / 4))
    .toString('base64')
    .slice(0, len)
    .replace(/\//g, '-')
    .replace(/\+/g, '_');
}

// The xsrf middleware provide AngularJS style XSRF-TOKEN provision and validation
// Add it to your server configuration after the session middleware:
//   app.use(xsrf);
//  
module.exports = function(req, res, next) {
    // Generate XSRF token
    var token = req.session._csrf || (req.session._csrf = uid(24));
    // Get the token in the current request
    var requestToken = req.header('X-XSRF-TOKEN');
    // Add it to the cookie
    res.cookie('XSRF-TOKEN', token, {
        maxAge: 900000,
        httpOnly: false
    });
    var url = req.url;
    // Ignore if it is just a read-only request
    switch(req.method) {
        case 'GET':
            if(url.indexOf('.tpl.') !== -1){
                if ( requestToken !== token ) {
                    return res.jsonp(403,{
                        error: 'Unauthorized'
                    });
                }
            }
            break;
        case 'HEAD':
        case 'OPTIONS':
            break;
        default:
            // Check the token in the request against the one stored in the session
            if ( requestToken !== token ) {
                return res.jsonp(403,{
                    error: 'Unauthorized'
                });
            }
    }
    // All is OK, continue as you were.
    return next();
};