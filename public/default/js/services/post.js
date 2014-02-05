(function(window, angular, undefined) {
    'use strict';
    angular.module('nodblog.api.post', ['nodblog.api.base'])
        .config(function(RestangularProvider) {
            RestangularProvider.setRestangularFields({
                id: "slug"
            });
        })
        .factory('Post', function(Base) {
            return Base('post');
        });
})(window, angular);