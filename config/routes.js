'use strict';

module.exports = function(app, passport,auth) {
    var indexDefaultController = require('../app/controllers/default/index');
    app.get('/', indexDefaultController.render);
    var indexAdminController = require('../app/controllers/admin/index');
    app.get('/admin',auth.requiresLogin ,indexAdminController.render);
    
    var articleController = require('../app/controllers/api/articles');
    app.post('/api/articles', articleController.create);
    app.get('/api/articles', articleController.all);
    app.put('/api/articles/:id', articleController.update);
    app.del('/api/articles/:id', articleController.destroy);
    app.get('/api/articles/:id', articleController.show);
    
    app.param('id', articleController.article);
    
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
