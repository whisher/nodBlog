'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var fs = require('fs'),
    config = require(__dirname + '/server/config/config'),
    utilsFs = require(config.sroot+'/lib/utils/fs')(fs),
    tmp = config.sroot+ '/tmp',
    upload = config.proot +'/system/upload',
    mongoose = require('mongoose'),
    db = mongoose.connect(config.db),
    model = require(config.sroot+'/models/user'),
    User = mongoose.model('User');
    
utilsFs.mkdirSync(upload,484);
utilsFs.mkdirSync(tmp,484);

var userData = { "name" : "User Admin", "email" : "info@ilwebdifabio.it", "username" : "admin","role" : "admin","password":"admin"};
var user = new User(userData);
user.provider = 'local';
user.save(function(err) {  
    if (err) {
        console.log(err);
        process.exit();
        return;
    }
    console.log(user); 
    process.exit();
});
    

 

    