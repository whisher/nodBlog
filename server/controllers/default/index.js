'use strict';
var assetmanager = require('assetmanager');
var assets ={1:'one',2:'two',3:'three'};

exports.render = function(config) {
     //var assets = require(config.sroot+'/config/assets.json');
   /* assetmanager.init({
        js: assets.js,
        css: assets.css,
        debug: (process.env.NODE_ENV !== 'production'),
        webroot: config.proot+'/public'
    });*/
    console.log(assets);
    return function(req, res) {
        res.render('layouts/default', {'appTitle':'ilwebdifabio','assets':{1:'one',2:'two',3:'three'}});
    }
};

