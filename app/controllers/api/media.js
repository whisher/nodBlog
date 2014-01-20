'use strict';

/**
 * Module dependencies.
 */
var fs = require('fs'),
    formidable = require('formidable'),
    mongoose = require('mongoose'),
    Media = mongoose.model('Media'),
    path = require('path'),
    _ = require('lodash');

/**
 * Find media by id
 */
exports.media = function(req, res, next, id) {
   Media.findOne({ '_id': id }, function (err, media) {
        if (err) {
            return next(err);
        }
        if (!media) {
            return next(new Error('Failed to load post ' + id));
        }
        req.media = media;
        next();
    });
};

/**
 * Create a media
 */
exports.create = function(req, res,next) {
    var form = new formidable.IncomingForm;
    var uploadDir = path.normalize(__dirname + '/../../../public/upload');
    form.parse(req, function(err, fields, files){
        if(err){
            return next(new Error('Failed to upload media'));
        }
        var ext = path.extname(files.media.name);
        var type = files.media.type;
        var tmp = path.basename(files.media.path) + ext;
        var filename = uploadDir + '/' + tmp;
        var data = {url:tmp,type:type}
        fs.rename(files.media.path, filename , function(err) {
            if (err){
                return next(new Error(err.code));
            }
            res.jsonp(data);       
        });
        
    });

  
   
  //  var media = new Media(req.body);
   /* media.save(function(err) {
        if (err) {
            console.log(err);
        } else {
            res.jsonp(media);
        }
    });*/
};