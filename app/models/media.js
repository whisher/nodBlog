'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    monguurl = require('monguurl'),
    Schema = mongoose.Schema;


/**
 * Media Schema
 */
var MediaSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        index: { unique: true }
    },
    description: {
        type: String,
        default: '',
        trim: true
    },
    type: {
        type: String,
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    ext: {
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
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

/**
 * Validations
 */
MediaSchema.path('title').validate(function(title) {
    if(typeof title !== "undefined" && title !== null){
        return title.length > 0
    }
    return false;
}, 'Title cannot be empty');

MediaSchema.path('name').validate(function(name) {
    if(typeof name !== "undefined" && name !== null){
        return name.length > 0
    }
    return false;
}, 'Name cannot be empty');


/**
 * Statics
 */
MediaSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }).populate('user', '_id name username role').exec(cb);
};

MediaSchema.plugin(monguurl({
  source: 'title',
  target: 'slug',
  length: 40
}));

mongoose.model('Media', MediaSchema);
