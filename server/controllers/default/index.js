'use strict';

function normalizeUrl(fragment){
    if(fragment === '' || fragment === '/'){
        return '';
    }
    if ( fragment.charAt( 0 ) === '/' ){
        fragment = fragment.substring(1);
    }
    return '/'+fragment.replace(/\/$/, '');
}

function normalizePage(fragment){
    if(!fragment){
        return '/index.html';
    }
    var chunks = fragment.substring(1).split('/');
    var len = chunks.length;
    if((len===1)){
        return chunks[0];
    }
    chunks.shift();
    //I get the id
    return chunks[0];
}

exports.render = function(req, res) {
    var config = res.locals.config;
    var env = (process.env.NODE_ENV === 'production') ? 'production' : null,
    currentPath = (env) ? config.proot + '/build/default/snapshots' : config.proot + '/default/snapshots';
    var query = req.query;
    
    if(typeof query._escaped_fragment_ !== 'undefined'){
        var fragment = query._escaped_fragment_;
        fragment = normalizeUrl(fragment);
        fragment = normalizePage(fragment);
        // If the fragment is empty, serve the index page
        if (fragment === '' || fragment === '/'){
            fragment = '/index.html';
        }
        // If fragment does not start with '/' prepend it to our fragment
        if (fragment.charAt(0) !== '/'){
            fragment = '/' + fragment;
        }
        
        // If fragment does not end with '.html' append it to the fragment
        if (fragment.indexOf('.html') === -1){
            fragment += '.html';
        }
        
        
        // Serve the static html snapshot
        try {
            var file = currentPath + fragment;
            res.sendfile(file);
        } catch (err) {
            res.send(404);
        }
       
    }
    else{
        var assetmanager = require(config.sroot+'/utils/assetsmanager')(config.sroot,'app');
        res.render('layouts/default', {
            assets:assetmanager.getCurrentAssets()
        });
    }
};

exports.bot = function(req, res) {
     res.sendfile(process.cwd()+'/public/robots.txt');
};
exports.sitemap = function(req, res) {
     res.sendfile(process.cwd()+'/public/sitemap.xml');
};