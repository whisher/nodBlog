(function(window, angular, undefined) {
    'use strict';
    angular.module('nodblog.api.post', ['restangular'])
        .provider('Post', function() {
            this.$get = function(Restangular) {
                function ngPost() {};
                ngPost.prototype.status = ['draft','publish'];
                ngPost.prototype.posts = Restangular.all('post');
                ngPost.prototype.one = function(id) {
                    return Restangular.one('post', id).get();
                };
                ngPost.prototype.all = function() {
                    return this.posts.getList();
                };
                ngPost.prototype.store = function(data) {
                    return this.posts.post(data);
                };
                ngPost.prototype.copy = function(original) {
                    return  Restangular.copy(original);
                };
                return new ngPost;
            }
    })
})(window, angular);