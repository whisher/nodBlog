'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Comment = mongoose.model('Comment'),
    _ = require('lodash');


/**
 * Find comment by id
 */
exports.post = function(req, res, next, id) {
   Post.findOne({ '_id': id }, function (err, post) {
        if (err) {
            return next(err);
        }
        if (!post) {
            return next(new Error('Failed to load post ' + id));
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
            res.jsonp(post);
        }
    });
};

/**
 * Show an post
 */
exports.show = function(req, res) {
    res.jsonp(req.post);
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