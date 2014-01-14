'use strict';     
angular.module('nodblog.route',['ngRoute','nodblog.api.article']).config(['$routeProvider','ArticleProvider',
    function($routeProvider,ArticleProvider) {
        $routeProvider
        .when('/', {
            templateUrl: 'admin/views/index.html',
            controller: 'IndexCtrl'
        })
        .when('/blog', {
            templateUrl: 'admin/views/blog/index.html',
            resolve: {
                articles: function(Article){
                    return Article.all();
                }
            },
            controller: 'IndexCtrl'
        })
        .when('/blog/create', {
            templateUrl: 'admin/views/blog/form.html',
            controller: 'CreateCtrl'
        })
        .when('/blog/edit/:id', {
            templateUrl: 'admin/views/blog/form.html',
            resolve: {
                article: function(Article, $route){
                    return Article.one($route.current.params.id);
                }
            },
            controller: 'EditCtrl'
        })
        .when('/blog/delete/:id', {
            templateUrl: 'admin/views/blog/delete.html',
            resolve: {
                article: function(Article, $route){
                    return Article.one($route.current.params.id);
                }
            },
            controller: 'DeleteCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
    }
]);
angular.module('nodblog',['nodblog.route'])
    .controller('MainCtrl', function ($scope) {
        
    })
    .controller('IndexCtrl', function ($scope) {
       
    })
    .controller('CreateCtrl', function ($scope,$location,Article) {
        $scope.article = {};
        $scope.save = function(){
            Article.store($scope.article).then(
                function(data) {
                    return $location.path('/blog');
                }, 
                function error(reason) {
                    throw new Error(reason);
                }
            );
        };
    })
    .controller('EditCtrl', function ($scope,$location,Article,article) {
        var original = article;
        $scope.article = Article.copy(original);
        $scope.isClean = function() {
            return angular.equals(original, $scope.article);
        }
        $scope.save = function() {
            $scope.article.put().then(function() {
                return $location.path('/blog');
            });
        };
    })
    .controller('DeleteCtrl', function ($scope,$location,article) {
        var original = article;
        $scope.save = function() {
            return $location.path('/blog');
        }
        $scope.destroy = function() {
            original.remove().then(function() {
                return $location.path('/blog');
            });
        };
    });
    
