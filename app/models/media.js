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
    author:{
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

MediaSchema.path('url').validate(function(url) {
    if(typeof url !== "undefined" && url !== null){
        return title.length > 0
    }
    return false;
}, 'Body cannot be empty');


mongoose.model('Media', MediaSchema);
