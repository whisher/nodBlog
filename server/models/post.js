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
    user: {
        type: Schema.ObjectId,
        ref: 'User'
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
    meta: {
        votes: {
            type: Number,
            default: 0
        },
        comments: {
            approved:{
                type: Number,
                default: 0
            },
            pending:{
                type: Number,
                default: 0
            }
        },
        medias:[String]
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

PostSchema.path('avatar').validate(function(avatar) {
    return /\.(jpeg|jpg|gif|png)$/i.test(avatar);
}, 'Is not a valid avatar format');

PostSchema.path('status').validate(function(status) {
    return /publish|draft/.test(status);
}, 'Is not a valid status');

PostSchema.path('categories').validate(function(categories) {
    if(typeof categories !== "undefined" && categories !== null){
        return categories.length > 0
    }
    return false;
}, 'Categories cannot be empty');

PostSchema.path('tags').validate(function(tags) {
    if(typeof tags !== "undefined" && tags !== null){
        return tags.length > 0
    }
    return false;
}, 'Tags cannot be empty');

/**
 * Statics
 */
PostSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }).populate('user', '_id name username email role').exec(cb);
};

PostSchema.plugin(monguurl({
  source: 'title',
  target: 'slug',
  length: 40
}));

mongoose.model('Post', PostSchema);
