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
        required: true,
        default: Date.now
    },
    tags: {
        type: [String], 
        required: true,
        index: true
    }
});

/**
 * Validations
 */
PostSchema.path('title').validate(function(title) {
    return title.length;
}, 'Title cannot be blank');

PostSchema.path('body').validate(function(body) {
    return body.length;
}, 'Body cannot be blank');

PostSchema.plugin(monguurl({
  source: 'title',
  target: 'slug'
}));

mongoose.model('Post', PostSchema);
