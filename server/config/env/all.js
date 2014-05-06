'use strict';

var path = require('path'),
    rootPath = path.normalize(__dirname + '/../../..'),
    serverPath = rootPath + '/server',
    publicPath = rootPath + '/public',
    tmp = serverPath + '/tmp';



module.exports = {
    root: rootPath,
    sroot: serverPath,
    proot:  (process.env.NODE_ENV === 'production') ? publicPath + '/dist' : publicPath ,
    tmp :tmp,
    port: process.env.PORT || 3000,
    db: process.env.MONGOHQ_URL,
    sessionSecret: '##@06mysc|rt1962@##',
    cookieSecret: '##@06mycks|crt1962@##',
    sessionCollection: 'sessions'
}
