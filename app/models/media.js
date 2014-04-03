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
    user: {
        type: Schema.ObjectId,
        ref: 'User'
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
        return url.length > 0
    }
    return false;
}, 'Url cannot be empty');

MediaSchema.path('url').validate(function(url) {
    return /\.(jpeg|jpg|gif|png)$/i.test(url);
}, 'Is not a valid media format');

/**
 * Statics
 */
MediaSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }).populate('user', '_id name username role').exec(cb);
};

mongoose.model('Media', MediaSchema);
