'use strict';     
angular.module('nodblog.route',['ui.router','nodblog.api.post']).config(function($stateProvider,PostProvider) {
        $stateProvider
        .state('index', {
            url: '/',
            templateUrl: 'admin/views/index.html',
            controller: 'HomeCtrl'
        })
        .state('post', {
            url: '/post',
            templateUrl: 'admin/views/post/index.html',
            resolve: {
                posts: function(Post){
                    return Post.all();
                }
            },
            controller: 'PostIndexCtrl'
        })
        .state('postcreate', {
            url: '/post/create',
            templateUrl: 'admin/views/post/form.html',
            controller: 'PostCreateCtrl'
        })
        .state('postedit', {
            url: '/post/edit/:id',
            templateUrl: 'admin/views/post/form.html',
            resolve: {
                post: function(Post, $stateParams){
                    return Post.one($stateParams.id);
                }
            },
            controller: 'PostEditCtrl'
        })
        .state('postdelete', {
            url: '/post/delete/:id',
            templateUrl: 'admin/views/post/delete.html',
            resolve: {
                post: function(Post,$stateParams){
                    return Post.one($stateParams.id);
                }
            },
            controller: 'PostDeleteCtrl'
        })
        .state('media', {
            url: 'media',
            templateUrl: 'admin/views/media/index.html',
            controller: 'MediaIndexCtrl'
        })
        .state('/media/create', {
            url: 'media',
            templateUrl: 'admin/views/media/form.html',
            controller: 'MediaCreateCtrl'
        });
    }
)
.run(function ($state) {
   $state.transitionTo('index');
})

angular.module('nodblog',['nodblog.route','ui.bootstrap'])

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
        $scope.save = function(){
            Post.store($scope.post).then(
                function(data) {
                    return $location.path('/post');
                }, 
                function error(reason) {
                    throw new Error(reason);
                }
           );
        };
    })
    .controller('PostEditCtrl', function ($scope,$location,Post,post) {
        var original = post;
        $scope.post = Post.copy(original);
        $scope.isClean = function() {
            return angular.equals(original, $scope.post);
        }
        $scope.save = function() {
            $scope.post.put().then(
                function(data) {
                    return $location.path('/post');
                },
                function error(reason) {
                    throw new Error(reason);
                }
            );
        };
    })
    .controller('PostDeleteCtrl', function ($scope,$location,post) {
        $scope.save = function() {
            return $location.path('/post');
        }
        $scope.destroy = function() {
            post.remove().then(
                function() {
                    return $location.path('/post');
                },
                function error(reason) {
                    throw new Error(reason);
                }
            );
        };
    })
    .controller('MediaIndexCtrl', function ($scope) {
       
    })
    .controller('MediaCreateCtrl', function ($scope) {
        $scope.media = {};
    });
    
    
    
