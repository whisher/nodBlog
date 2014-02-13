'use strict';

module.exports = function(fs) {
    var FsWrapper = function(){};
    FsWrapper.prototype.fs = fs;
    FsWrapper.prototype.mkdir = function(path,mode,callback) {
        if (typeof mask === 'function') { 
            callback = mode;
            mode = 511;
        }
        this.fs.mkdir(path,mode,function(err) {
            if (err) {
                if (err.code === 'EEXIST') {
                    callback(null); 
                }
                else{
                    callback(new Error(err.code)); 
                }
            } 
            else { 
                callback(null);
            }
        });
    };
    FsWrapper.prototype.mkdirSync = function(path, mode){
        if (typeof mode == 'undefined') { 
            mode = 0777;
        }
        return this.fs.mkdirSync(path, mode)
    };
    
    return new FsWrapper();
}
