'use strict';

process.env.NODE_ENV = 'production';

var config = require(__dirname + '/server/config/config'),
    mongoose = require('mongoose'),
    db = mongoose.connect(config.db),
    mongoose = require('mongoose'),
    post = require(config.sroot + '/models/post'),
    Post = mongoose.model('Post'),
    snapshots = require(__dirname + '/server/utils/snapshots'),
    _ = require('lodash');
    
snapshots();
snapshots('/blog');

Post.find({status:'publish',published:{$lt : Date.now()}}).sort('-published').exec(function(err, posts) {
    if (err) {
        console.log(err);
        return;
    }
    _.forEach(posts,function(post) {
        snapshots('/blog/'+post._id+'/'+post.slug);
        console.log('/blog/'+post._id+'/'+post.slug);
    });
});

post = null;
db = null;


