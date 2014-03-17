'use strict';

module.exports = function(path) {
    var PathWrapper = function(){};
    PathWrapper.prototype.path = path;
    PathWrapper.prototype.extname = function(p){
        return this.path.extname(p);
    };
    PathWrapper.prototype.basename = function(p,ext){
        if(typeof ext === 'undefined'){
            return this.path.basename(p);
        }
        return this.path.basename(p,ext);
    };
    PathWrapper.prototype.normalize = function(p){
        return this.path.normalize(p);
    };
    return new PathWrapper();
}
