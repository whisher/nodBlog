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
    app.get('/admin/api/post',auth.apiRequiresLogin, postController.allForAdmin);
    app.get('/admin/api/post/:postId',auth.apiRequiresLogin, postController.showForAdmin);
    app.put('/admin/api/post/:postId',auth.apiRequiresLogin, postController.update);
    app.del('/admin/api/post/:postId',auth.apiRequiresLogin, postController.destroy);
    app.post('/admin/api/post/upload',auth.apiRequiresLogin, postController.upload);
    app.get('/admin/api/post/comments/:postId',auth.apiRequiresLogin, postController.commentsByPostIdForAmin);
    
    /* Public Post Api */
    app.get('/api/post',postController.all);
    app.get('/api/post/:postId',postController.show);
    app.get('/api/post/comments/:postId',postController.commentsByPostId);
    
    /* Post Id Param */
    app.param('postId', postController.post);
    
    var commentController = require('../app/controllers/api/comment');
    
    /* Admin Comment Api */
    app.post('/admin/api/comment',auth.apiRequiresLogin, commentController.create);
    app.put('/admin/api/comment/:commentId',auth.apiRequiresLogin, commentController.update);
    
    
    /* Public Comment Api */
    app.post('/api/comment', commentController.create);
    app.get('/api/comment/:commentId', commentController.show);
    
    
    /* Comment Id Param */
    app.param('commentId', commentController.comment);
    
   /* Users */
    var users = require('../app/controllers/users');
    app.get('/signin', users.signin);
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
