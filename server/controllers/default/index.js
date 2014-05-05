'use strict';
var assetmanager = require('assetmanager');
exports.render = function(config) {
    var assets = require(config.sroot+'/config/assets.json');
    assetmanager.init({
        js: assets.js,
        css: assets.css.app,
        debug: (process.env.NODE_ENV !== 'production'),
        webroot: 'public'
    });
    return function(req, res) {
        res.render('layouts/default', {appTitle:'ilwebdifabio',assets:assetmanager.assets});
    }
};

