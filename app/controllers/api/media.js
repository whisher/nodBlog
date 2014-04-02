'use strict';

/**
 * Module dependencies.
 */
var fs = require('fs'),
    path = require('path'),
    formidable = require('formidable'),
    mongoose = require('mongoose'),
    Media = mongoose.model('Media'),
    _ = require('lodash');
    
var uploadDir = path.normalize(__dirname + '/../../../public/upload');

/**
 * Find media by id
 */
exports.media = function(req, res, next, id) {
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
        return res.jsonp(404,{ error: 'Failed to load media with id ' + id });
    }
    Post.load(id, function(err, media) {
        if (err) return next(err);
        if (!media) return res.jsonp(404,{ error: 'Failed to load media with id ' + id });
        req.media = media;
        next();
    });
};

/**
 * Create a media
 */
exports.create = function(io) {
  return function(req,res,next) {
     var form = new formidable.IncomingForm;
     form.on('progress', function(bytesReceived, bytesExpected){
        var percent = Math.floor(bytesReceived / bytesExpected * 100);
        // here is where you can relay the uploaded percentage using Socket.IO
        io.sockets.emit('mediaUploadProgress', { percent: percent });
    });
    form.parse(req, function(err, fields, files){
        if(err){
            return res.json(500, err.message);
        } 
        var ext = path.extname(files.media.name);
        var type = files.media.type;
        var tmp = path.basename(files.media.path) + ext;
        var filename = uploadDir + '/' + tmp;
        var title = (typeof fields.title !== 'undefined')?fields.title:'';
        var data = {url:tmp,type:type,title:title};
        fs.rename(files.media.path, filename , function(err) {
            if (err){
                return res.json(500, err.message);
            }
            var media = new Media(data);
            media.user = req.user;
            media.save(function(err) {
                if (err) {
                    var errs = Object.keys(err.errors);
                    if (errs.length > 0){
                        return res.json(500,{ error: err.errors[errs[0]].message }); 
                    }
                    return res.json(500,{ error: 'Cannot save the media' });
                } 
                res.json(media);
            });   
        });
        
    }); 
  }
};

/**
 * List of medias
 */
exports.all = function(req, res) {
    Media.find().sort('-created').populate('user', '_id name username role').exec(function(err, medias) {
        if (err) {
            var errs = Object.keys(err.errors);
            if (errs.length > 0){
                return res.json(500,{
                    error: err.errors[errs[0]].message
                }); 
            }
           return res.json(500,{ error: 'Cannot get all the medias' });
        } 
        res.json(200,medias);
    });
};