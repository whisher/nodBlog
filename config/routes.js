'use strict';

module.exports = function(app) {
    var indexDefaultController = require('../app/controllers/default/index');
    app.get('/', indexDefaultController.render);
    var indexAdminController = require('../app/controllers/admin/index');
    app.get('/admin', indexAdminController.render);
}
