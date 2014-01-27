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
    author:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
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
    }
});

/**
 * Validations
 */
CommentSchema.path('author').validate(function(author) {
    return author.length;
}, 'Author cannot be empty');

CommentSchema.path('email').validate(function(email) {
    return email.length;
}, 'Email cannot be empty');

CommentSchema.path('email').validate(function(email) {
    var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailRegex.test(email);
}, 'The email is not a valid email');

CommentSchema.path('body').validate(function(body) {
    return body.length;
}, 'Body cannot be empty');

mongoose.model('Comment', CommentSchema);
