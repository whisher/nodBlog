'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * Comment Schema
 */
var CommentSchema = new Schema({
    post_id: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    parent: {
        type: String,
        index : true,
        default: null,
    },
    author:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    web:{
        type: String
    },
    body: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        required: true,
        default: 'pending'
    },
    created: {
        type: Date,
        required: true,
        default: Date.now
    },
    meta: {
        votes: Number
    },
    is_authoring: {
        type: Number,
        required: true,
        default: 0
    }
});

/**
 * Validations
 */
CommentSchema.path('author').validate(function(author) {
    if(typeof author !== 'undefined' && author !== null){
        return author.length;
    }
    return false;
}, 'Author cannot be empty');

CommentSchema.path('email').validate(function(email) {
    if(typeof email !== 'undefined' && email !== null){
        return email.length;
    }
    return false;
}, 'Email cannot be empty');

CommentSchema.path('email').validate(function(email) {
    if(typeof email !== 'undefined' && email !== null){
        var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        return emailRegex.test(email);
    }
    return false;
}, 'The email is not a valid email');

CommentSchema.path('web').validate(function(web) {
    if(typeof web !== 'undefined' && web !== null){
        var url = web.trim();
        if(url.length > 0){
            var urlregex = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/;
            return  urlregex.test(web);
        }
    }
    return true;
}, 'Url not valid');

CommentSchema.path('body').validate(function(body) {
    if(typeof body !== 'undefined' && body !== null){
        return body.length > 0;
    }
    return false;
}, 'Body cannot be empty');

CommentSchema.path('status').validate(function(status) {
    if(typeof status !== 'undefined' && status !== null){
        return /pending|approved/.test(status);
    }
    return false;
}, 'Is not a valid status');

CommentSchema.path('is_authoring').validate(function(val) {
    if(typeof val !== 'undefined' && val !== null){
        return /[0-1]/.test(val);
    }
    return false;
    
}, 'Is not a valid status');

mongoose.model('Comment', CommentSchema);
