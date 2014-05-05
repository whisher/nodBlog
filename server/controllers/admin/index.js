'use strict';
var assetmanager = require('assetmanager');
exports.render = function(config) {
    var assets = require(config.sroot+'/config/assets.json');
    assetmanager.init({
        js: assets.js,
        css: assets.css.admin,
        debug: (process.env.NODE_ENV !== 'production'),
        webroot: 'public'
    });
    return function(req, res) {
        var user = {id:req.user.id,name:req.user.name,email:req.user.email,role:req.user.role};
        res.cookie('USER',JSON.stringify(user) , { maxAge: 900000, httpOnly: false});
        res.render('layouts/admin', {appTitle:'ilwebdifabio Admin',user:user,assets:assetmanager.assets});
    }
};

