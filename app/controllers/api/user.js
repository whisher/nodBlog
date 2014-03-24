'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    User = mongoose.model('User');

/**
 * Find user by id
 */
exports.user = function(req, res, next, id) {
    User
        .findOne({
            _id: id
        })
        .exec(function(err, user) {
            if (err) return next(err);
            if (!user) return next(new Error('Failed to load User ' + id));
            req.profile = user;
            next();
        });
};

/**
 * Create user
 */
exports.create = function(req, res, next) {
    var user = new User(req.body);
    var message = null;
    user.provider = 'local';
    user.save(function(err) {
        if (err) {
            switch (err.code) {
                case 11000:
                case 11001:
                    message = 'Username already exists';
                    break;
                default:
                    message = 'Please fill all the required fields';
            }
            return res.json(500,{ error: message });
        } 
        res.json(200,user);
    });
};

/**
 * Update a post
 */
exports.update = function(req, res) {
    var user = req.user;
    user = _.extend(user, req.body);
    user.save(function(err) {
        if (err) {
            var errs = Object.keys(err.errors);
            if (errs.length > 0){
               return res.json(500,{ error: err.errors[errs[0]].message }); 
            }
            return res.json(500,{ error: 'Cannot update the user' });
        } 
        res.json(200,user);
    });
};

/**
 * List of all users
 */
exports.all = function(req, res) {
    User.find().sort('-created').exec(function(err, users) {
        if (err) {
           return res.json(500,{ error: 'Cannot get all the posts' });
        } 
        res.json(200,users);
    });
};

/**
 * One user
 */
exports.show = function(req, res) {
    res.json(200,req.profile);
};

/**
 * Send User
 */
exports.me = function(req, res) {
    res.json(req.user || null);
};

/**
 * Delete a post
 */
exports.destroy = function(req, res) {
    var user = req.user;
    user.remove(function(err) {
        if (err) {
            var errs = Object.keys(err.errors);
            if (errs.length > 0){
               return res.json(500,{ error: err.errors[errs[0]].message }); 
            }
            return res.json(500,{ error: 'Cannot delete the user' });
        } 
        res.json(200,user);
   });
};



