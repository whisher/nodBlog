'use strict';

module.exports = function(app, passport,auth) {
    var indexDefaultController = require('../app/controllers/default/index');
    app.get('/', indexDefaultController.render);
    var indexAdminController = require('../app/controllers/admin/index');
    app.get('/admin',auth.requiresLogin ,indexAdminController.render);
    
    var postController = require('../app/controllers/api/post');
    app.post('/api/post', postController.create);
    app.get('/api/post', postController.all);
    app.put('/api/post/:id', postController.update);
    app.del('/api/post/:id', postController.destroy);
    app.get('/api/post/:id', postController.show);
    
    app.param('id', postController.post);
    
    var users = require('../app/controllers/users');
    app.get('/signin', users.signin);
    app.get('/signup', users.signup);
    app.get('/signout', users.signout);
    app.get('/users/me', users.me);

    //Setting up the users api
    app.post('/users', users.create);

    //Setting the local strategy route
    app.post('/users/session', passport.authenticate('local', {
        failureRedirect: '/signin',
        failureFlash: true
    }), users.session);
    
     //Finish with setting up the userId param
    app.param('userId', users.user);
}
