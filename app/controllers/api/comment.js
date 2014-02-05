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
 * Find comment by post id
 */
exports.commentByPostId = function(req, res, next, id) {
   Comment.find({ 'post_id': id }).sort('-created').exec(function(err, comments) {
        if (err) {
            return next(err);
        }
        req.comments = comments;
        next();
    });
};

/**
 * Create a comment
 */
exports.create = function(req, res) {
    var comment = new Comment(req.body);
    comment.save(function(err) {
        if (err) {console.log(err);
           return res.jsonp(500,{ error: 'Cannot save the comment' });
        } 
        res.jsonp(200,comment);
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
