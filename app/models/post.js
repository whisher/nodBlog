'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * Article Schema
 */
var PostSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String,
        default: '',
        trim: true
    },
    body: {
        type: String,
        default: '',
        trim: true
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


mongoose.model('Post', PostSchema);