(function(window, angular, undefined) {
'use strict';
angular.module('nodblog.admin.index',['ui.router'])
    .config(function($stateProvider) {
        $stateProvider
        .state('index', {
            url: '/',
            templateUrl: '/src/app/admin/index/index.tpl.html',
            controller: 'IndexCtrl'
        });
    })
    .controller('IndexCtrl', function ($scope) {
    });
})(window, angular);  
