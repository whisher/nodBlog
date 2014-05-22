'use strict';

/**
 * Module dependencies.
 */
var express = require('express'),
    fs = require('fs'),
    passport = require('passport'),
    logger = require('mean-logger');




//Load configurations
//Set the node enviornment variable if not set before
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

//Initializing system variables 
var config = require(__dirname + '/server/config/config'),
    auth = require(config.sroot + '/config/middlewares/authorization'),
    mongoose = require('mongoose');

//Use only for development env
/*if (process.env.NODE_ENV === 'development') {
    mongoose.set('debug', true);
}*/

// set temp directory for uploads
process.env.TMPDIR = config.tmp;


  
//Bootstrap db connection
var db = mongoose.connect(config.db);

//Bootstrap models
var modelsPath = config.sroot + '/models';
var walk = function(path) {
    fs.readdirSync(path).forEach(function(file) {
        var newPath = path + '/' + file;
        var stat = fs.statSync(newPath);
        if (stat.isFile()) {
            if (/(.*)\.(js$|coffee$)/.test(file)) {
                require(newPath);
            }
        } else if (stat.isDirectory()) {
            walk(newPath);
        }
    });
};
walk(modelsPath);

//bootstrap passport config
require(config.sroot + '/config/passport')(passport);

var app = express(),
    http = require('http'),
    httpServer = http.createServer(app),
    https = require('https'),
    credentials = {
        key: fs.readFileSync(config.root+'/server/ssh/key.pem'), 
        cert: fs.readFileSync(config.root+'/server/ssh/key-cert.pem') 
    },
    httpsServer = https.createServer(credentials, app),
    io = require('socket.io').listen(httpServer);

//express settings
require(config.sroot + '/config/express')(app,passport,db);

//Bootstrap routes
require(config.sroot + '/config/routes')(app,passport,auth,io);

//Start the app by listening on <port>
var port = (process.env.NODE_ENV === 'production')?80:3000;
var ports = (process.env.NODE_ENV === 'production')?443:3001;
httpServer.listen(port);
//httpsServer.listen(ports);


io.sockets.on('connection', function (socket){
    socket.on('addPost', function (data) {
        data.label = 'added_post';
        socket.broadcast.emit('addedPost', data);
    });
    socket.on('addContact', function (data) {
        data.label = 'added_contact';
        socket.broadcast.emit('addedContact', data);
    });
    socket.on('addComment', function (data) {
        data.label = 'added_comment';
        socket.broadcast.emit('addedComment', data);
    });
    socket.on('approveComment', function (data) {
        data.label = 'approved_comment';
        socket.broadcast.emit('approvedComment', data);
    });
    socket.on('replyComment', function (data) {
        data.label = 'replied_comment';
        socket.broadcast.emit('repliedComment', data);
    });
});

console.log('Express app started on port ' + port);

//Initializing logger
logger.init(app,passport ,mongoose);

//expose app
exports = module.exports = app;
