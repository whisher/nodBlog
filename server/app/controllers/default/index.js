'use strict';

exports.render = function(req, res) {
    res.render('default/index', {appTitle:'nodBlog'});
};
