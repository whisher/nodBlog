'use strict';

/**
 * Module dependencies.
 */
var fs = require('fs'),
    path = require('path'),
    formidable = require('formidable'),
    im = require('imagemagick'),
    mongoose = require('mongoose'),
    Post = mongoose.model('Post'),
    _ = require('lodash');


/**
 * Find post by id
 */
exports.post = function(req, res, next, slug) {
   Post.findOne({'slug': slug }, function (err, post) {
        if (err) {
            return next(err);
        }
        if (!post) {
            return res.jsonp(404,{ error: 'Failed to load post ' + slug });
        }
        req.post = post;
        next();
    });
};

/**
 * Create a post
 */
exports.create = function(req, res) {
    var post = new Post(req.body);
    post.save(function(err) {
        if (err) {
            return res.jsonp(500,{ error: 'Cannot save the post' });
        } 
        res.jsonp(post);
    });
};

/**
 * Update a post
 */
exports.update = function(req, res) {
    var post = req.post;
    post = _.extend(post, req.body);
    post.save(function(err) {
        if (err) {
            return res.jsonp(500,{ error: 'Cannot update the post' });
        } 
        res.jsonp(post);
    });
};

/**
 * Delete a post
 */
exports.destroy = function(req, res) {
    var post = req.post;
    post.remove(function(err) {
        if (err) {
            return res.jsonp(500,{ error: 'Cannot remove the post' });
        } 
        res.jsonp(200,post);
   });
};

/**
 * Show a post by id
 */
exports.show = function(req, res) {
    res.jsonp(200,req.post);
};


/**
 * List of public posts
 */
exports.all = function(req, res) {
    Post.find().sort('-created').exec(function(err, posts) {
        if (err) {
           return res.jsonp(500,{ error: 'Cannot get all the posts' });
        } 
        res.jsonp(200,posts);
    });
};

/**
 * List of admin posts
 */
exports.allxadmin = function(req, res) {
    Post.find().sort('-created').exec(function(err, posts) {
        if (err) {
           return res.jsonp(500,{ error: 'Cannot get all the posts' });
        } 
        res.jsonp(200,posts);
    });
};

/**
 * List of admin posts
 */
exports.alltags = function(req, res) {
    Post.find().distinct('tags').exec(function(err, tags) {
        if (err) {
           return res.jsonp(500,{ error: 'Cannot get all the tags' });
        } 
        res.jsonp(200,tags);
    });
};

/**
 * Upload post avatar
 */
exports.upload = function(req, res,next) {
    var w = 200;
    var h = 75;
    var form = new formidable.IncomingForm;
    var uploadDir = path.normalize(__dirname + '/../../../public/upload');
    form.parse(req, function(err, fields, files){
        if(err){
            res.jsonp(500, err.message);
        } 
        var ext = path.extname(files.avatar.name);
        var type = files.avatar.type;
        var tmp = path.basename(files.avatar.path) + ext;
        var filename = uploadDir + '/' + tmp;
        var data = {url:tmp};
        im.crop({
                srcPath:  files.avatar.path,
                dstPath: filename,
                width: w,
                height: h,
                quality: 1,
                gravity: "North"
            }, 
            function(err, stdout, stderr){
                if (err){
                    return res.jsonp(500, {error:'Cannot crop file'});
                } 
                fs.unlink(files.avatar.path, function (err) {
                    if (err) {}
                });
                res.jsonp(data);
        });
    });
};