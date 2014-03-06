'use strict';

exports.render = function(req, res) {
    var currentSession = req.session.passport;
    var user = currentSession.user;
    res.render('admin/index', {appTitle:'nodBlog Admin',user:user.username});
};
