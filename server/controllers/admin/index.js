'use strict';

exports.render = function(config) {
    return function(req, res) {
        var user = {
            id:req.user.id,
            name:req.user.name,
            email:req.user.email,
            role:req.user.role
            };
        res.cookie('USER',JSON.stringify(user) , {
            maxAge: 900000, 
            httpOnly: false
        });
        var assetmanager = require(config.sroot+'/utils/assetsmanager')(config.sroot,'admin');
        res.render('layouts/admin', {
            appTitle:'ilwebdifabio Admin',
            user:user,
            assets:assetmanager.getCurrentAssets()
        });
    }
};

