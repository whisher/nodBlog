'use strict';

/**
 * Module dependencies.
 */
var express = require('express'),
    fs = require('fs'),
    passport = require('passport'),
    logger = require('mean-logger');


/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

//Load configurations
//Set the node enviornment variable if not set before
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

//Initializing system variables 
var config = require('./config/config'),
    auth = require('./config/middlewares/authorization'),
    mongoose = require('mongoose');

//Use only for development env
if (process.env.NODE_ENV === 'development') {
    //mongoose.set('debug', true);
}
// set temp directory for uploads
process.env.TMPDIR = config.tmp;


    
//Bootstrap db connection
var db = mongoose.connect(config.db);

//Bootstrap models
var modelsPath = __dirname + '/app/models';
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
require('./config/passport')(passport);

var app = express()
    , http = require('http')
    , server = http.createServer(app)
    , io = require('socket.io').listen(server);

//express settings
require('./config/express')(app,passport,db);

//Bootstrap routes
require('./config/routes')(app,passport,auth,io);

//Start the app by listening on <port>
var port = process.env.PORT || config.port;
server.listen(port);

io.sockets.on('connection', function (socket){
    socket.on('addPost', function (data) {
        data.label = 'add post';
        socket.broadcast.emit('addedPost', data);
    });
    socket.on('addContact', function (data) {
        data.label = 'add contact';
        socket.broadcast.emit('addedContact', data);
    });
});

console.log('Express app started on port ' + port);

//Initializing logger
logger.init(app,passport ,mongoose);

//expose app
exports = module.exports = app;
