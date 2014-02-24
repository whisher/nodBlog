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
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
        return res.jsonp(404,{ error: 'Failed to load post with id ' + id });
    }
    Comment.findById(id).exec(function (err, comment) {
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
           var errs = Object.keys(err.errors);
            if (errs.length > 0){
               return res.jsonp(500,{ error: err.errors[errs[0]].message }); 
            }
            return res.jsonp(500,{ error: 'Cannot save the comment' });
        } 
        Post.findByIdAndUpdate(comment.post_id, { $inc: {'meta.comments.pending' : 1} }).exec(function(err, post) {
            if (err) {
                var errs = Object.keys(err.errors);
                if (errs.length > 0){
                    return res.jsonp(500,{ error: err.errors[errs[0]].message }); 
                }
                return res.jsonp(500,{ error: 'Cannot update the post' });
            }
            if (!post) {
                return res.jsonp(404,{ error: 'Failed to load post with id ' + comment.post_id });
            }
            res.jsonp(200,comment);
        });
    });
};

/**
 * Show a comment
 */
exports.show = function(req, res) {
    res.jsonp(req.comment);
};

/**
 * Update a comment
 */
exports.update = function(req, res) {
    var comment = req.comment;
    comment = _.extend(comment, req.body);
    comment.save(function(err) {
        if (err) {
            var errs = Object.keys(err.errors);
            if (errs.length > 0){
               return res.json(500,{ error: err.errors[errs[0]].message }); 
            }
            return res.json(500,{ error: 'Cannot update the comment' });
        }
        Post.findByIdAndUpdate(comment.post_id, { $inc: {'meta.comments.pending' : -1,'meta.comments.approved' : 1} }).exec(function(err, post) {
            if (err) {
                var errs = Object.keys(err.errors);
                if (errs.length > 0){
                    return res.json(500,{ error: err.errors[errs[0]].message }); 
                }
                return res.json(500,{ error: 'Cannot update the comment' });
            }
            if (!post) {
                return res.json(404,{ error: 'Failed to load post with id ' + comment.post_id });
            }
            res.json(200,comment);
        });
   });
};
