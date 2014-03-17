'use strict';

exports.render = function(req, res) {
    var isDist = (process.env.NODE_ENV==='development')?0:1;
    var currentSession = req.session.passport;
    var user = currentSession.user;
    res.render('layouts/admin', {appTitle:'nodBlog Admin',user:user,isDist:isDist});
};
