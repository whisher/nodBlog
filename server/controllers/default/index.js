'use strict';

exports.render = function(config) {
    return function(req, res) {
        var assetmanager = require(config.sroot+'/utils/assetsmanager')(config.sroot,'app');
        res.render('layouts/default', {appTitle:'ilwebdifabio',assets:assetmanager.getCurrentAssets()});
    }
};

