(function(window, angular, undefined) {
    'use strict';
    angular.module('nodblog.api.user', ['nodblog.api.base'])
        .config(function(RestangularProvider) {
            RestangularProvider.setRestangularFields({
                id: "_id"
            });
        })
        .factory('User', function(Base) {
            function NgUser() {
                this.labels = {
                    frmCreateHeader:'Add New User',
                    frmEditHeader:'Edit User'
                }; 
            }
            return angular.extend(Base('user'), new NgUser());
        });
})(window, angular);