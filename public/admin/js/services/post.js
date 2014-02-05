(function(window, angular, undefined) {
    'use strict';
    angular.module('nodblog.api.post', ['nodblog.api.base'])
        .config(function(RestangularProvider) {
            RestangularProvider.setRestangularFields({
                id: "slug"
            });
        })
        .factory('Post', function(Base) {
            function NgPost() {
                this.status = ['publish','draft'];
                this.labels = {
                    frmCreateHeader:'Add New Post',
                    frmEditHeader:'Edit Post'
                }; 
            }
            return angular.extend(Base('post'), new NgPost());
        });
})(window, angular);