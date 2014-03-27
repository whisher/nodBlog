'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var fs = require('fs'),
    utilsFs = require('./lib/utils/fs')(fs),
    upload = __dirname + '/public/upload',
    tmp = __dirname + '/tmp',
    config = require(__dirname + '/config/config'),
    mongoose = require('mongoose'),
    db = mongoose.connect(config.db),
    model = require(__dirname + '/app/models/user'),
    User = mongoose.model('User');
    
utilsFs.mkdirSync(upload,484);
utilsFs.mkdirSync(tmp,484);

var userData = { "name" : "User Admin", "email" : "admin@nodblog.me", "username" : "admin","role" : "admin","password":"admin"};
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
    

 

    