'use strict';

exports.render = function(req, res) {
    res.render('admin/index', {appTitle:'nodBlog Admin'});
};
