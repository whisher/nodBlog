(function(window, angular, undefined) {
    'use strict';
    angular.module('nodblog.api.comment', ['nodblog.api.base'])
        .config(function(RestangularProvider) {
            RestangularProvider.setRestangularFields({
                id: "_id"
            });
        })
        .factory('Comment', function(Base) {
            function NgComment() {
                
            };
            return angular.extend(Base('comment'), new NgComment());
        });
})(window, angular);