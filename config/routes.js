'use strict';

module.exports = function(app, passport,auth) {
    /* Default Index */
    var indexDefaultController = require('../app/controllers/default/index');
    app.get('/', indexDefaultController.render);
    
    /* Admin Index */
    var indexAdminController = require('../app/controllers/admin/index');
    app.get('/admin',auth.requiresLogin ,indexAdminController.render);
    
    /* Post */
    var postController = require('../app/controllers/api/post');
    app.post('/api/post', postController.create);
    app.get('/api/post', postController.all);
    app.put('/api/post/:postSlug', postController.update);
    app.del('/api/post/:postSlug', postController.destroy);
    app.get('/api/post/:postSlug', postController.show);
    app.post('/api/post/upload', postController.upload);
    
    /* Post Param */
    app.param('postSlug', postController.post);
    
    /* List Post For Admin */
    app.get('/api/posts', postController.allxadmin);
    
    /* Fetch all the distinct tags */
    app.get('/api/tags', postController.alltags);
    
    /* Media */
    var mediaController = require('../app/controllers/api/media');
    app.post('/api/media', mediaController.create);
    app.get('/api/media', mediaController.all);
    app.put('/api/media/:mediaId', mediaController.update);
    app.del('/api/media/:mediaId', mediaController.destroy);
    app.get('/api/media/:mediaId', mediaController.show);
    
    /* Media Param */
    app.param('mediaId', mediaController.media);
    
    /* Users */
    var users = require('../app/controllers/users');
    app.get('/signin', users.signin);
    app.get('/signup', users.signup);
    app.get('/signout', users.signout);
    app.get('/users/me', users.me);
    app.post('/users', users.create);
    
    /* Users Param */
    app.param('userId', users.user);

    //Setting the local strategy route
    app.post('/users/session', passport.authenticate('local', {
        failureRedirect: '/signin',
        failureFlash: true
    }), users.session);
    
   
}
