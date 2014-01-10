'use strict';
 
angular.module('nodblog',['ngRoute']).config(['$routeProvider',
    function($routeProvider) {
        $routeProvider
        .when('/', {
            templateUrl: 'default/views/index.html',
            controller: 'IndexCtrl'
        })
        .when('/about', {
            templateUrl: 'default/views/about.html',
            controller: 'AboutCtrl'
        })
        .when('/contact', {
            templateUrl: 'default/views/contact.html',
            controller: 'ContactCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
    }
]);
angular.module('nodblog').config(['$locationProvider',
    function($locationProvider) {
        $locationProvider.html5Mode(true).hashPrefix('!');
    }
]);
angular.module('nodblog').controller('MainCtrl', function ($scope) {
        
    })
    .controller('IndexCtrl', function ($scope) {
        $scope.test = 'index';
    })
    .controller('AboutCtrl', function ($scope) {
        $scope.test = 'about';
    })
    .controller('ContactCtrl', function ($scope) {
        $scope.test = 'contact';
    });