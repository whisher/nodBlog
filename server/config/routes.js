'use strict';

module.exports = function(app, passport,auth) {
    /* Default Index */
    var indexDefaultController = require('../app/controllers/default/index');
    app.get('/', indexDefaultController.render);
    
    /* Admin Index */
    var indexAdminController = require('../app/controllers/admin/index');
    app.get('/admin',auth.requiresLogin ,indexAdminController.render);
    
    var postController = require('../app/controllers/api/post');
    /* Admin Post Api */
    app.post('/admin/api/post',auth.apiRequiresLogin, postController.create);
    app.get('/admin/api/post',auth.apiRequiresLogin, postController.allxadmin);
    app.put('/admin/api/post/:postSlug',auth.apiRequiresLogin, postController.update);
    app.del('/admin/api/post/:postSlug',auth.apiRequiresLogin, postController.destroy);
    app.get('/admin/api/post/:postSlug',auth.apiRequiresLogin, postController.show);
    app.post('/admin/api/post/upload',auth.apiRequiresLogin, postController.upload);
    
    /* Public Post Api */
    app.get('/api/post', postController.all);
    app.get('/api/post/:postSlug', postController.show);
    app.get('/api/tags', postController.alltags);
    
    /* Post Param */
    app.param('postSlug', postController.post);
    
    
    var commentController = require('../app/controllers/api/comment');
    /* Admin Comment Api */
    app.put('/admin/api/comment/:commentId', commentController.update);
    app.del('/admin/api/comment/:commentId', commentController.destroy);
    
    /* Public Comment Api */
    app.post('/api/comment', commentController.create);
    app.get('/api/comment/:commentId', commentController.show);
    app.get('/api/comment/post/:postId', commentController.showByPostId);
    app.get('/api/comment', commentController.all);
    
    
    /* Comment Param */
    app.param('commentId', commentController.comment);
    app.param('postId', commentController.commentByPostId);
    
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
