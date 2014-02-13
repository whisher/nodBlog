'use strict';

var path = require('path'),
    rootPath = path.normalize(__dirname + '/../..'),
    tmp = rootPath + '/tmp';
  
module.exports = {
    root: rootPath,
    tmp :tmp,
    port: process.env.PORT || 3000,
    db: process.env.MONGOHQ_URL    
}
