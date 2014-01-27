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
        type: [String], 
        index: { unique: true }
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
    return title.length;
}, 'Title cannot be empty');

PostSchema.path('body').validate(function(body) {
    return body.length;
}, 'Body cannot be empty');

PostSchema.path('status').validate(function(status) {
    return /publish|draft/.test(status);
}, 'Is not a valid status');

PostSchema.plugin(monguurl({
  source: 'title',
  target: 'slug'
}));

mongoose.model('Post', PostSchema);
