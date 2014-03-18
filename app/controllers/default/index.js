'use strict';
exports.render = function(config) {
    return function(req, res) {
        var isProd = (process.env.NODE_ENV==='production');
        if(isProd){
           return res.sendfile('default.html', { root: config.distFolder });
        }
        res.render('layouts/default', {appTitle:'nodBlog'});
    }
};

