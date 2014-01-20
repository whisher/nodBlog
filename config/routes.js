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
    app.put('/api/post/:postId', postController.update);
    app.del('/api/post/:postId', postController.destroy);
    app.get('/api/post/:postId', postController.show);
    
    /* Post Param */
    app.param('postId', postController.post);
    
    /* Media */
    var mediaController = require('../app/controllers/api/media');
    app.get('/admin/upload',indexAdminController.upload);
    app.post('/api/media', mediaController.create);
    
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
