'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * Article Schema
 */
var MediaSchema = new Schema({
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
MediaSchema.path('title').validate(function(title) {
    return title.length;
}, 'Title cannot be blank');

MediaSchema.path('body').validate(function(body) {
    return body.length;
}, 'Body cannot be blank');


mongoose.model('Media', MediaSchema);
