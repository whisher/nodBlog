'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    monguurl = require('monguurl'),
    Schema = mongoose.Schema;


/**
 * Article Schema
 */
var PostSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    author:{
        type: String,
        required: true,
        default: 'whisher'
    },
    slug: {
        type: String,
        index: { unique: true }
    },
    body: {
        type: String,
        required: true,
        trim: true
    },
    avatar:{
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        trim: true
    },
    created: {
        type: Date,
        required: true,
        default: Date.now
    },
    published: {
        type: Date,
        required: true
    },
    categories: {
        type: [String]
    },
    tags: {
        type: [String], 
        required: true,
        index: true
    },
    comment: {
        type: Schema.Types.ObjectId, 
        ref: 'CommentSchema'
    },
    meta: {
        votes: {
            type: Number,
            default: 0
        },
        comments: {
            type: Number,
            default: 0
        } 
    }
});

/**
 * Validations
 */

PostSchema.path('title').validate(function(title) {
    if(typeof title !== "undefined" && title !== null){
        return title.length > 0
    }
    return false;
}, 'Title cannot be empty');

PostSchema.path('body').validate(function(body) {
    if(typeof body !== "undefined" && body !== null){
        return body.length > 0
    }
    return false;
}, 'Body cannot be empty');

PostSchema.path('status').validate(function(status) {
    return /publish|draft/.test(status);
}, 'Is not a valid status');

PostSchema.path('avatar').validate(function(avatar) {
    return /\.(jpeg|jpg|gif|png)$/i.test(avatar);
}, 'Is not a valid avatar url');

PostSchema.plugin(monguurl({
  source: 'title',
  target: 'slug'
}));

mongoose.model('Post', PostSchema);
