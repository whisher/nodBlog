'use strict';
 
angular.module('nodblog.route',['ngRoute','nodblog.api.article']).config(['$routeProvider','ArticleProvider',
    function($routeProvider,ArticleProvider) {
        $routeProvider
        .when('/', {
            templateUrl: 'default/views/index.html',
            resolve: {
                articles: function(Article){
                    return Article.all();
                }
            },
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
angular.module('nodblog.mode',['ngRoute']).config(['$locationProvider',
    function($locationProvider) {
        $locationProvider.html5Mode(true).hashPrefix('!');
    }
]);

angular.module('nodblog',['nodblog.route','nodblog.mode']).controller('MainCtrl', function ($scope) {
        
    })
    .controller('IndexCtrl', function ($scope,articles) {
        $scope.articles = articles;
        console.log($scope.articles);
    })
    .controller('AboutCtrl', function ($scope) {
        $scope.test = 'about';
    })
    .controller('ContactCtrl', function ($scope) {
        $scope.test = 'contact';
    });