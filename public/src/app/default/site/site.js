(function(window, angular, undefined) {
'use strict';
angular.module('nodblog.site',[])
    .config(function($stateProvider) {
        $stateProvider
            .state('index', {
                url: '/',
                templateUrl: 'src/app/default/site/index.tpl.html',
                controller: 'IndexCtrl'
            })
            .state('about', {
                url: '/about',
                templateUrl: 'src/app/default/site/about.tpl.html',
                controller: 'AboutCtrl'
            })
            .state('contact', {
                url: '/contact',
                templateUrl: 'src/app/default/site/contact.tpl.html',
                controller: 'ContactCtrl'
            });
    })
    .controller('IndexCtrl', function ($scope) {
        
    })
    .controller('AboutCtrl', function ($scope) {
        $scope.test = 'about';
    })
    .controller('ContactCtrl', function ($scope) {
        $scope.test = 'contact';
    });
 })(window, angular);        
    
    
    