'use strict';
 
angular.module('nodblog.route',['ngRoute','nodblog.api.post']).config(
    function($routeProvider,RestangularProvider,PostProvider) {
        $routeProvider
        .when('/', {
            templateUrl: '/default/views/index.html',
            resolve: {
                posts: function(Post){
                    return Post.all();
                }
            },
            controller: 'IndexCtrl'
        })
        .when('/post/:slug', {
            templateUrl: '/default/views/details.html',
            resolve: {
                post: function(Post,$route){
                    return Post.one($route.current.params.id);
                }
            },
            controller: 'DetailsCtrl'
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
        RestangularProvider.setBaseUrl('/api');
    }
);
angular.module('nodblog.mode',['ngRoute']).config(['$locationProvider',
    function($locationProvider) {
        $locationProvider.html5Mode(true).hashPrefix('!');
    }
]);

angular.module('nodblog',['ngSanitize','nodblog.route','nodblog.mode']).controller('MainCtrl', function ($scope) {
        
    })
    .controller('IndexCtrl', function ($scope,posts) {
        $scope.posts = posts;
    })
    .controller('DetailsCtrl', function ($scope,post) {
        $scope.post = post;
       
    })
    .controller('AboutCtrl', function ($scope) {
        $scope.test = 'about';
    })
    .controller('ContactCtrl', function ($scope) {
        $scope.test = 'contact';
    });