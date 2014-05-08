'use strict';

var  _ = require('lodash');

module.exports = function (path,route) {
    var env = (process.env.NODE_ENV === 'production') ? 'production' : null;
    
    var debug = (env !== 'production');
    
    var data = require(path+'/config/assets.json');
    
    var assets = {
        css: [],
        js: []
    };
    
    var getAssets = function (pattern) {
        var files = [];
        if (_.isArray(pattern)) {
            _.each(pattern, function (path) {
                files = files.concat(getAssets(path));
            });
        } else if (_.isString(pattern)) {
            var regex = new RegExp('^(http://|https://|//)');
            if (regex.test(pattern)) {
                // Source is external
                files.push(pattern);
            } else {
                files.push(pattern);
            }
        }
        return files;
    };
    
    var getFiles = function () {
        var current = data[route];
        _.each(['css', 'js'], function (fileType) {
            _.each(current[fileType], function (value, key) {
                if (!debug) {
                    assets[fileType].push(key);
                } else {
                    assets[fileType] = assets[fileType].concat(getAssets(value));
                }
            });
        });
    };
    
    var getCurrentAssets = function(){
        return assets;
    };
    
    getFiles();
    
    return {
        getCurrentAssets: getCurrentAssets
    }
}
