(function(window, angular, undefined) {
'use strict';
angular.module('nodblog.admin.index',['ui.router'])
    .config(function($stateProvider,pathView) {
        $stateProvider
        .state('index', {
            url: '/',
            templateUrl: pathView+ 'index/index.tpl.html',
            controller: 'IndexCtrl'
        });
    })
    .controller('IndexCtrl', function ($scope) {
    });
})(window, angular);  
