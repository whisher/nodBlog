'use strict';     
angular.module('nodblog.route',['ngRoute','nodblog.api.post']).config(['$routeProvider','PostProvider',
    function($routeProvider,PostProvider) {
        $routeProvider
        .when('/', {
            templateUrl: 'admin/views/index.html',
            controller: 'HomeCtrl'
        })
        .when('/post', {
            templateUrl: 'admin/views/post/index.html',
            resolve: {
                posts: function(Post){
                    return Post.all();
                }
            },
            controller: 'PostIndexCtrl'
        })
        .when('/post/create', {
            templateUrl: 'admin/views/post/form.html',
            controller: 'PostCreateCtrl'
        })
        .when('/post/edit/:id', {
            templateUrl: 'admin/views/post/form.html',
            resolve: {
                post: function(Post, $route){
                    return Post.one($route.current.params.id);
                }
            },
            controller: 'PostEditCtrl'
        })
        .when('/post/delete/:id', {
            templateUrl: 'admin/views/post/delete.html',
            resolve: {
                post: function(Post, $route){
                    return Post.one($route.current.params.id);
                }
            },
            controller: 'PostDeleteCtrl'
        })
        .when('/media', {
            templateUrl: 'admin/views/media/index.html',
            controller: 'MediaIndexCtrl'
        })
        .when('/media/create', {
            templateUrl: 'admin/views/media/form.html',
            controller: 'MediaCreateCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
    }
]);
angular.module('nodblog',['nodblog.route','ui.bootstrap'])
.directive("autosaveForm", function($timeout,$location,Post) {
    var promise;
    return {
        restrict: "A",
        controller:function($scope){
            $scope.save = function(){
                $timeout.cancel(promise);
                if(typeof $scope.post.put === 'function'){
                    $scope.post.put().then(function() {
                        return $location.path('/post');
                    });
                }
                else{
                    Post.store($scope.post).then(
                        function(data) {
                            return $location.path('/post');
                        }, 
                        function error(reason) {
                            throw new Error(reason);
                        }
                    );
                }
            };
            
        },
        link: function (scope, element, attrs) {
            scope.$watch('form.$valid', function(validity) {
                element.find('#status').removeClass('btn-success');
                element.find('#status').addClass('btn-danger');
                if(validity){
                    Post.store(scope.post).then(
                        function(data) {
                            element.find('#status').removeClass('btn-danger');
                            element.find('#status').addClass('btn-success');
                            scope.post = Post.copy(data);
                            _autosave();
                        }, 
                        function error(reason) {
                            throw new Error(reason);
                        }
                    );
                }  
            })
            function _autosave(){
                    scope.post.put().then(
                    function() {
                        promise = $timeout(_autosave, 2000);
                    },
                    function error(reason) {
                        throw new Error(reason);
                    }
                );
            }
        }
    }
})

    .controller('MainCtrl', function ($scope,$location) {
        $scope.items = [
            {route:'#/post/create',title:'Post'},
            {route:'#/media/create',title:'Media'},
            {route:'#/page/create',title:'Page'},
        ];
        
    })
    .controller('HomeCtrl', function ($scope) {
       
    })
    .controller('PostIndexCtrl', function ($scope,posts) {
       $scope.posts = posts;
    })
    .controller('PostCreateCtrl', function ($scope,$location,Post) {
        
     })
    .controller('PostEditCtrl', function ($scope,$location,Post,post) {
        var original = post;
        
        $scope.post = Post.copy(original);
        $scope.isClean = function() {
            return angular.equals(original, $scope.post);
        }
        $scope.save = function() {
            $scope.post.put().then(function() {
                return $location.path('/post');
            });
        };
    })
    .controller('PostDeleteCtrl', function ($scope,$location,post) {
        $scope.save = function() {
            return $location.path('/post');
        }
        $scope.destroy = function() {
            post.remove().then(function() {
                return $location.path('/post');
            });
        };
    })
    .controller('MediaIndexCtrl', function ($scope) {
       
    })
    .controller('MediaCreateCtrl', function ($scope) {
        $scope.media = {};
    });
    
    
    
