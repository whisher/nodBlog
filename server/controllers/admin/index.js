'use strict';

exports.render = function(req, res) {
    var user = {
        id:req.user.id,
        name:req.user.name,
        email:req.user.email,
        role:req.user.role
    };
    var config = res.locals.config;
    var assetmanager = require(config.sroot+'/utils/assetsmanager')(config.sroot,'admin');
    res.render('layouts/admin', {assets:assetmanager.getCurrentAssets(),user:JSON.stringify(user)});
};

