(function(window, angular, undefined) {
    'use strict';
    angular.module('nodblog.api.posts', ['restangular'])
        .provider('Posts', function() {
            this.$get = function(Restangular) {
                function ngPosts() {};
                ngPosts.prototype.posts = Restangular.all('posts');
                ngPosts.prototype.all = function() {
                    return this.posts.getList();
                };
                return new ngPosts;
            }
    })
})(window, angular);