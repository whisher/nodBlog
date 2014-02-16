'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Comment = mongoose.model('Comment'),
    Post = mongoose.model('Post'),
    _ = require('lodash');


/**
 * Find comment by id
 */
exports.comment = function(req, res, next, id) {
   Comment.findOne({ '_id': id }, function (err, comment) {
        if (err) {
            return next(err);
        }
        if (!comment) {
            return res.jsonp(404,{ error: 'Failed to load comment ' + id });
        }
        req.comment = comment;
        next();
    });
};


/**
 * Create a comment
 */
exports.create = function(req, res) {
    var comment = new Comment(req.body);
    comment.save(function(err) {
        if (err) {
           return res.jsonp(500,{ error: 'Cannot save the comment' });
        } 
        Post.findOne({'_id': comment.post_id }, function (err, post) {
            if (err) {
                return res.jsonp(404,{ error: 'Failed to load post with id ' + comment.post_id });
            }
            if (!post) {
                return res.jsonp(404,{ error: 'Failed to load post with id ' + comment.post_id });
            }
            post.meta.comments = post.meta.comments + 1;
            post.save(function(err) {
                if (err) {
                    return res.jsonp(500,{ error: 'Cannot update the post' });
                } 
                res.jsonp(200,comment);
            });
            
        
       
        });
        
    });
};

/**
 * Update a comment
 */
exports.update = function(req, res) {
    var comment = req.comment;
    comment = _.extend(comment, req.body);
    comment.save(function(err) {
        if (err) {
            return res.jsonp(500,{ error: 'Cannot update the comment' });
        }
        res.jsonp(comment);
   });
};

/**
 * Delete a comment
 */
exports.destroy = function(req, res) {
    var comment = req.comment;
    comment.remove(function(err) {
        if (err) {
            return res.jsonp(500,{ error: 'Cannot remove the comment' });
        } 
        res.jsonp(200,comment);
    });
};

/**
 * Show a comment
 */
exports.show = function(req, res) {
    res.jsonp(req.comment);
};

/**
 * List of public posts
 */
exports.showByPostId = function(req, res) {
    res.jsonp(req.comments);
};

/**
 * List of comment
 */
exports.all = function(req, res) {
    Comment.find().sort('-created').exec(function(err, comments) {
        if (err) {
           return res.jsonp(500,{ error: 'Cannot list comments' });
        } 
        res.jsonp(200,comments);
    });
};
