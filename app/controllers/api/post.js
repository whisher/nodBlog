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
    Comment = mongoose.model('Comment'),
    _ = require('lodash');

var uploadDir = path.normalize(__dirname + '/../../../public/upload');



/**
 * Find post by id
 */
exports.post = function(req, res, next, id) {
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
        return res.jsonp(404,{ error: 'Failed to load post with id ' + id });
    }
    Post.load(id, function(err, post) {
        if (err) return next(err);
        if (!post) return res.jsonp(404,{ error: 'Failed to load post with id ' + id });
        req.post = post;
        next();
    });
};

/**
 * Create a post
 */
exports.create = function(req, res) {
    var post = new Post(req.body);
    post.user = req.user;
    post.save(function(err) {
        if (err) {
            var errs = Object.keys(err.errors);
            if (errs.length > 0){
               return res.json(500,{ error: err.errors[errs[0]].message }); 
            }
            return res.json(500,{ error: 'Cannot save the post' });
        } 
        res.json(200,post);
    });
};

/**
 * List of all public posts
 */
exports.all = function(req, res) {
    Post.find({status:'publish',published:{$lt : Date.now()}}).sort('-created').populate('user', '_id name username role').exec(function(err, posts) {
        if (err) {
            var errs = Object.keys(err.errors);
            if (errs.length > 0){
                return res.jsonp(500,{
                    error: err.errors[errs[0]].message
                }); 
            }
           return res.jsonp(500,{ error: 'Cannot get all the posts' });
        } 
        res.jsonp(200,posts);
    });
};

/**
 * List of all posts for admin
 */
exports.allForAdmin = function(req, res) {
    Post.find().sort('-created').populate('user', '_id name username role').exec(function(err, posts) {
        if (err) {
            var errs = Object.keys(err.errors);
            if (errs.length > 0){
                return res.json(500,{
                    error: err.errors[errs[0]].message
                }); 
            }
            return res.json(500,{ error: 'Cannot get all the posts' });
        } 
        res.json(200,posts);
    });
};

/**
 * Show a post by id
 */
exports.show = function(req, res) {
    if(req.post.status!=='publish'){
        return res.jsonp(404,{ error: 'Failed to load post with id ' + req.post._id });
    }
    res.jsonp(200,req.post);
};

/**
 * Show a post by id
 */
exports.showForAdmin = function(req, res) {
   res.json(200,req.post);
};

/**
 * Update a post
 */
exports.update = function(req, res) {
    var post = req.post;
    post = _.extend(post, req.body);
    //rebuild slug
    post.slug = post.title;
    post.save(function(err) {
        if (err) {
            var errs = Object.keys(err.errors);
            if (errs.length > 0){
               return res.json(500,{ error: err.errors[errs[0]].message }); 
            }
            return res.json(500,{ error: 'Cannot update the post' });
        } 
        res.json(200,post);
    });
};

/**
 * Delete a post
 */
exports.destroy = function(req, res) {
    var post = req.post;
    post.remove(function(err) {
        if (err) {
            var errs = Object.keys(err.errors);
            if (errs.length > 0){
               return res.json(500,{ error: err.errors[errs[0]].message }); 
            }
            return res.json(500,{ error: 'Cannot delete the post' });
        } 
        res.json(200,post);
   });
};

/**
 * Upload post avatar
 */
exports.upload = function(io) {
  return function(req, res,next) {
        var w = 200;
        var h = 75;
        var form = new formidable.IncomingForm;
        form.on('progress', function(bytesReceived, bytesExpected){
            var percent = Math.floor(bytesReceived / bytesExpected * 100);
            // here is where you can relay the uploaded percentage using Socket.IO
            io.sockets.emit('avatarUploadProgress', { percent: percent });
        });
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
                    res.jsonp(200,data);
            });
        });
    };
};
/**
 * Find comment by post id
 */
exports.commentsByPostId = function(req, res) {
    Comment.find({'post_id': req.post._id }).where('status').equals('approved').lean().sort('created').exec(function(err, comments) {
        if (err) {
           return res.json(500,{ error: 'Cannot get all the comments with post id ' + id });
        } 
        var idToNodeMap = {}; 
        var len = comments.length;
        for(var i = 0; i < len; i++) {
            var comment = comments[i];
            // the node is a root
            if(comment.parent === null){
                idToNodeMap[comment._id] = comment;
                idToNodeMap[comment._id].children = [];
            }
            else{
                idToNodeMap[comment.parent].children.push(comment); 
            }
        }   
        var data = [];
        _.forIn(idToNodeMap, function(value, key) {
            data.push(idToNodeMap[key]);
        });
        res.jsonp(200,data);
    });
};

/**
 * Find comment by post id for admin
 */
exports.commentsByPostIdForAmin = function(req, res) {
    var id = req.post._id;
    Comment.find({ 'post_id': id }).lean().sort('created').exec(function(err, comments) {
        if (err) {
           return res.json(500,{ error: 'Cannot get all the comments with post id ' + id });
        }
        var idToNodeMap = {}; 
        var len = comments.length;
        for(var i = 0; i < len; i++) {
            var comment = comments[i];
            // the node is a root
            if(comment.parent === null){
                idToNodeMap[comment._id] = comment;
                idToNodeMap[comment._id].children = [];
            }
            else{
                idToNodeMap[comment.parent].children.push(comment); 
            }
        }   
        var data = [];
        _.forIn(idToNodeMap, function(value, key) {
            data.push(idToNodeMap[key]);
        });
        res.json(200,data);
    });
};

