(function(window, angular, undefined) {
    'use strict';
    //Dependencies restangular
    angular.module('nodblog.services.base', [])
    .factory('Base', function(Restangular) {
        return function(route){
            var elements = Restangular.all(route);
            return {
                one : function (id) {
                    return Restangular.one(route, id).get();
                },
                all : function () {
                    return elements.getList();
                },
                store : function(data) {
                    return elements.post(data);
                },
                copy : function(original) {
                    return Restangular.copy(original);
                },
                getElements : function() {
                    return elements;
                },
                specialCopy : function(id) {
                    return Restangular.one(route, id);
                }
            };
        };
    });
})(window, angular);