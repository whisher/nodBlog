(function(window, angular, undefined) {
    'use strict';
    angular.module('nodblog.api.post', ['restangular'])
        .config(function (RestangularProvider) {
            RestangularProvider.setBaseUrl('/api');
            RestangularProvider.setRestangularFields({
                id: "_id"
            });
            RestangularProvider.setRequestInterceptor(function(elem, operation, what) {
                if (operation === 'put') {
                    elem._id = undefined;
                    return elem;
                }
                return elem;
            }); 
        })
        .provider('Post', function() {
            this.$get = function(Restangular) {
                function ngPost() {};
                ngPost.prototype.articles = Restangular.all('post');
                ngPost.prototype.one = function(id) {
                    return Restangular.one('post', id).get();
                };
                ngPost.prototype.all = function() {
                    return this.articles.getList();
                };
                ngPost.prototype.store = function(data) {
                    return this.articles.post(data);
                };
                ngPost.prototype.copy = function(original) {
                    return  Restangular.copy(original);
                };
                return new ngPost;
            }
    })
})(window, angular);