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
        var data = {url:tmp,type:type,title:fields.title};
        fs.rename(files.media.path, filename , function(err) {
            if (err){
                return next(new Error(err.code));
            }
            var media = new Media(data);
            media.save(function(err) {
                if (err) {
                   return next(new Error(err.code));
                } 
                res.jsonp(media);
            });   
        });
        
    });
};

/**
 * Update a media
 */
exports.update = function(req, res) {
    var media = req.media;
    media = _.extend(media, req.body);
    media.save(function(err) {
        if (err) {
             console.log(err);
        } else {
            res.jsonp(media);
        }
    });
};

/**
 * Delete a media
 */
exports.destroy = function(req, res) {
    var media = req.media;
    media.remove(function(err) {
        if (err) {
            console.log(err); 
        } else {
            res.jsonp(media);
        }
    });
};

/**
 * Show an post
 */
exports.show = function(req, res) {
    res.jsonp(req.media);
};

/**
 * List of medias
 */
exports.all = function(req, res) {
    Media.find().sort('-created').exec(function(err, medias) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(medias);
        }
    });
};