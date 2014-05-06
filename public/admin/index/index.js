(function(window, angular, undefined) {
    'use strict';
    //Dependencies ui.router
    angular.module('nodblog.admin.index',[])
    .config(function($stateProvider) {
        $stateProvider
        .state('index', {
            url: '/',
            templateUrl: 'public/admin/index/index.tpl.html',
            controller: 'IndexCtrl'
        });
    })
    .controller('IndexCtrl', function ($scope) {
    });
})(window, angular);