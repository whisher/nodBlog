'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * Contact Schema
 */
var ContactSchema = new Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    msg: {
        type: String,
        required: true,
        trim: true
    },
    ip: {
        type: String,
        trim: true
    },
    referer: {
        type: String,
        trim: true
    },
    created: {
        type: Date,
        required: true,
        default: Date.now
    }
});

/**
 * Validations
 */
ContactSchema.path('username').validate(function(username) {
    if(typeof username !== 'undefined' && username !== null){
        return username.length > 0;
    }
    return false;
}, 'Username cannot be empty');

ContactSchema.path('email').validate(function(email) {
    if(typeof email !== 'undefined' && email !== null){
        return email.length;
    }
    return false;
}, 'Email cannot be empty');

ContactSchema.path('email').validate(function(email) {
    if(typeof email !== 'undefined' && email !== null){
        var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        return emailRegex.test(email);
    }
    return false;
}, 'The email is not a valid email');

ContactSchema.path('msg').validate(function(msg) {
    if(typeof msg !== 'undefined' && msg !== null){
        return msg.length > 0;
    }
    return false;
}, 'The message cannot be empty');


mongoose.model('Contact', ContactSchema);
