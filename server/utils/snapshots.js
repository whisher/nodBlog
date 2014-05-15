'use strict';

var fs = require('fs'),
    path = require('path'),
    childProcess = require('child_process'),
    phantomjs = require('phantomjs'),
    binPath = phantomjs.path,
    config = require('../config/config');

var currentPath =  config.proot + '/build/default/snapshots';

function normalizeUrl(url){
    if( (typeof url === 'undefined') || !url){
        return '';
    }
    if ( url.charAt( 0 ) === '/' ){
        url = url.substring(1);
    }
    return '/'+url.replace(/\/$/, '');
}

function normalizePage(route){
    if(!route){
        return 'index';
    }
    var chunks = route.substring(1).split('/');
    var len = chunks.length;
    if(len===1){
        return chunks[0];
    }
    chunks.shift();
    //I get the id
    return chunks[0];
}

module.exports = function (url) {
    var route = normalizeUrl(url);
    var page = normalizePage(route);
    var childArgs = [
        path.join(__dirname, './phantomjs-runner.js'),
        config.url+route
    ];
    
    childProcess.execFile(binPath, childArgs, function(err, stdout, stderr) {
        if(err){
            console.log(err);
        }
        if(stderr){
            console.log(stderr);
        }
        fs.writeFile(currentPath + '/' + page + '.html', stdout, function(err) {
            if(err) {
                console.log(err);
            }
            else {
                console.log('The file was saved!');
            }
        });
    });
};