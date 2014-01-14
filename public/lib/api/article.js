(function(window, angular, undefined) {
    'use strict';
    angular.module('nodblog.api.article', ['restangular'])
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
        .provider('Article', function() {
            this.$get = function(Restangular) {
                function ngArticle() {};
                ngArticle.prototype.articles = Restangular.all('articles');
                ngArticle.prototype.one = function(id) {
                    return Restangular.one('articles', id).get();
                };
                ngArticle.prototype.all = function() {
                    return this.articles.getList();
                };
                ngArticle.prototype.store = function(data) {
                    return this.articles.post(data);
                };
                ngArticle.prototype.copy = function(original) {
                    return  Restangular.copy(original);
                };
                return new ngArticle;
            }
    })
})(window, angular);