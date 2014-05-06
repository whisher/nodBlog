'use strict';

/**
 * Module dependencies.
 */
var fs = require('fs'),
    path = require('path'),
    formidable = require('formidable'),
    mongoose = require('mongoose'),
    Media = mongoose.model('Media'),
    easyimg = require('easyimage'),
    im = require('imagemagick'),
    _ = require('lodash');
    
var uploadDir = path.normalize(__dirname + '/../../../public/system/upload');

/**
 * Find media by id
 */
exports.media = function(req, res, next, id) {
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
        return res.jsonp(404,{
            error: 'Failed to load media with id ' + id
        });
    }
    Media.load(id, function(err, media) {
        if (err) {
            return next(err);
        }
        if (!media) {
            return res.jsonp(404,{
                error: 'Failed to load media with id ' + id
            });
        }
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
            io.sockets.emit('mediaUploadProgress', {
                percent: percent
            });
        });
        form.parse(req, function(err, fields, files){
            if(err){
                return res.json(500, err.message);
            } 
            var name = path.basename(files.media.path);
            var ext = path.extname(files.media.name);
            var url = name + ext;
            var type = files.media.type;
            var title = fields.title;
            
            var filename = uploadDir + '/' + name + ext;
            var data = {
                name :name,
                ext:ext,
                url:url,
                type:type,
                title:title
            };
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
                            return res.json(500,{
                                error: err.errors[errs[0]].message
                            }); 
                        }
                        return res.json(500,{
                            error: 'Cannot save the media'
                        });
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
            return res.json(500,{
                error: 'Cannot get all the medias'
            });
        } 
        res.json(200,medias);
    });
};

/**
 * Show a media by id
 */
exports.show = function(req, res) {
    res.json(200,req.media);
};

/**
 * Update a post
 */
exports.update = function(req, res) {
    var media = req.media;
    media = _.extend(media, req.body);
    //rebuild slug
    media.slug = media.title;
    media.save(function(err) {
        if (err) {
            var errs = Object.keys(err.errors);
            if (errs.length > 0){
                return res.json(500,{
                    error: err.errors[errs[0]].message
                }); 
            }
            return res.json(500,{
                error: 'Cannot update the media'
            });
        } 
        res.json(200,media);
    });
};
/**
 * Create a media cropped
 */
exports.crop = function(req, res) {
    var oldName = req.media.name + req.media.ext;
    var newName = Date.now();
    var dst = newName + req.media.ext;
    easyimg.rescrop({
        src: uploadDir + '/' +oldName, 
        dst:uploadDir + '/' + dst,
        width:req.body.cw, 
        height:req.body.ch,
        cropwidth:req.body.w, 
        cropheight:req.body.h,
        gravity:'NorthWest',
        x:req.body.x, 
        y:req.body.y
    },
    function(err, image) {
        if (err) {
            return res.jsonp(500,{
                error: 'Cannot crop the media'
            });
        }
        var data = {
            name :newName,
            ext:req.media.ext,
            url : newName + req.media.ext,
            type:req.media.type,
            title:req.body.title
        };
        var media = new Media(data);
        media.user = req.user;
        media.save(function(err) {
            if (err) {
                var errs = Object.keys(err.errors);
                if (errs.length > 0){
                    return res.json(500,{
                        error: err.errors[errs[0]].message
                    }); 
                }
                return res.json(500,{
                    error: 'Cannot save the media'
                });
            } 
            res.json(media);
        });   
    });
};

/**
 * Create a media resized
 */
exports.resize = function(req, res) {
    var oldName = req.media.name + req.media.ext;
    var newName = Date.now();
    var dst = newName + req.media.ext;
    easyimg.resize({
        src: uploadDir + '/' +oldName, 
        dst:uploadDir + '/' + dst,
        width:req.body.w, 
        height:req.body.h
    },
    function(err, image) {
        if (err) {
            return res.jsonp(500,{
                error: 'Cannot crop the media'
            });
        }
        var data = {
            name :newName,
            ext:req.media.ext,
            url : newName + req.media.ext,
            type:req.media.type,
            title:req.body.title
        };
        var media = new Media(data);
        media.user = req.user;
        media.save(function(err) {
            if (err) {
                var errs = Object.keys(err.errors);
                if (errs.length > 0){
                    return res.json(500,{
                        error: err.errors[errs[0]].message
                    }); 
                }
                return res.json(500,{
                    error: 'Cannot save the media'
                });
            } 
            res.json(media);
        });   
    });
};

/**
 * Delete a media
 */
exports.destroy = function(req, res) {
    var media = req.media;
    media.remove(function(err) {
        if (err) {
            var errs = Object.keys(err.errors);
            if (errs.length > 0){
               return res.json(500,{ error: err.errors[errs[0]].message }); 
            }
            return res.json(500,{ error: 'Cannot delete the media' });
        } 
        res.json(200,media);
   });
};