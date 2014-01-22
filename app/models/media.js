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
    user: {
        type: String,
        default: 'whisher',
        trim: true
    },
    title: {
        type: String,
        default: '',
        trim: true
    },
    type: {
        type: String,
        default: '',
        trim: true
    },
    url: {
        type: String,
        default: '',
        trim: true
    }
});

/**
 * Validations
 */
/*MediaSchema.path('title').validate(function(title) {
    return title.length;
}, 'Title cannot be blank');
*/
MediaSchema.path('url').validate(function(url) {
    return url.length;
}, 'Body cannot be blank');


mongoose.model('Media', MediaSchema);
