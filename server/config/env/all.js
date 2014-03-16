'use strict';

var path = require('path'),
    rootPath = path.normalize(__dirname + '/../..'),
    distFolder = path.resolve(rootPath, '../client'),
    tmp = rootPath + '/tmp';
  
module.exports = {
    root: rootPath,
    distFolder:distFolder,
    tmp :tmp,
    port: process.env.PORT || 3000,
    db: process.env.MONGOHQ_URL,
    sessionSecret: '##@06myscret1962@##',
    sessionCollection: 'sessions'
}
