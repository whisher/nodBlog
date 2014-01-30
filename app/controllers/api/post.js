'use strict';

/**
 * Module dependencies.
 */
var fs = require('fs'),
    path = require('path'),
    formidable = require('formidable'),
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
            res.jsonp(500,{ error: err.message });
        } else {
            res.jsonp(post);
        }
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
             res.jsonp(500,{ error: err.message });
        } else {
            res.jsonp(post);
        }
    });
};

/**
 * Delete a post
 */
exports.destroy = function(req, res) {
    var post = req.post;
    post.remove(function(err) {
        if (err) {
            res.jsonp(500,{ error: err.message });
        } else {
            res.jsonp(200,post);
        }
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
           res.jsonp(500,{ error: err.message });
        } else {
            res.jsonp(200,posts);
        }
    });
};

/**
 * List of admin posts
 */
exports.allxadmin = function(req, res) {
    Post.find().sort('-created').exec(function(err, posts) {
        if (err) {
           res.jsonp(500,{ error: err.message });
        } else {
            res.jsonp(200,posts);
        }
    });
};

/**
 * List of admin posts
 */
exports.alltags = function(req, res) {
    Post.find().distinct('tags').exec(function(err, tags) {
        if (err) {
           res.jsonp(500,{ error: err.message });
        } else {
            res.jsonp(200,tags);
        }
    });
};

/**
 * Upload post avatar
 */
exports.upload = function(req, res,next) {
    var form = new formidable.IncomingForm;
    var uploadDir = path.normalize(__dirname + '/../../../public/upload');
    form.parse(req, function(err, fields, files){
        if(err){
            return next(new Error('Failed to upload media'));
        } 
        var ext = path.extname(files.avatar.name);
        var type = files.avatar.type;
        var tmp = path.basename(files.avatar.path) + ext;
        var filename = uploadDir + '/' + tmp;
        var data = {url:tmp};
        fs.rename(files.avatar.path, filename , function(err) {
            if (err){
                return next(new Error(err.code));
            }
            res.jsonp(data);
        });
   });
};