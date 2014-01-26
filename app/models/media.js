'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * Media Schema
 */
var MediaSchema = new Schema({
    title: {
        type: String,
        default: '',
        trim: true
    },
    description: {
        type: String,
        default: '',
        trim: true
    },
    user:{
        type: String,
        required: true,
        default: 'whisher'
    },
    type: {
        type: String,
        required: true,
        trim: true
    },
    url: {
        type: String,
        required: true,
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
/*MediaSchema.path('title').validate(function(title) {
    return title.length;
}, 'Title cannot be blank');
*/
MediaSchema.path('url').validate(function(url) {
    return url.length;
}, 'Body cannot be blank');


mongoose.model('Media', MediaSchema);
