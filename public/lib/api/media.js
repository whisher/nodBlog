(function(window, angular, undefined) {
    'use strict';
    angular.module('nodblog.api.media', ['restangular'])
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
        .provider('Media', function() {
            this.$get = function(Restangular) {
                function ngMedia() {};
                ngMedia.prototype.medias = Restangular.all('media');
                ngMedia.prototype.one = function(id) {
                    return Restangular.one('media', id).get();
                };
                ngMedia.prototype.all = function() {
                    return this.medias.getList();
                };
                ngMedia.prototype.store = function(data) {
                    return this.medias.post(data);
                };
                ngMedia.prototype.copy = function(original) {
                    return  Restangular.copy(original);
                };
                return new ngMedia;
            }
    })
})(window, angular);