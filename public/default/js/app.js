'use strict';
 
angular.module('nodblog.config',['ui.router','nodblog.api.post']).config(
    function($stateProvider,$locationProvider,RestangularProvider) {
        $stateProvider
            .state('index', {
                url: '/',
                templateUrl: '/default/views/index.html',
                controller: 'IndexCtrl'
            })
            .state('about', {
                url: '/about',
                templateUrl: 'default/views/about.html',
                controller: 'AboutCtrl'
            })
            .state('contact', {
                url: '/contact',
                templateUrl: 'default/views/contact.html',
                controller: 'ContactCtrl'
            })
            .state('blog', {
                url: '/blog',
                templateUrl: '/default/views/blog/index.html',
                resolve: {
                    posts: function(Post){
                        return Post.all();
                    }
                },
                controller: 'BlogIndexCtrl'
            })
            .state('post', {
                url: '/blog/:slug',
                templateUrl: '/default/views/blog/details.html',
                resolve: {
                    post: function(Post,$stateParams){
                        return Post.one($stateParams.slug);
                    }
                },
                controller: 'BlogDetailsCtrl'
            });
        $locationProvider.html5Mode(true).hashPrefix('!');    
        RestangularProvider.setBaseUrl('/api');
    })
    .run(function ($state,$rootScope,$log) {
        $state.transitionTo('index');
        $rootScope.$log = $log;
        $rootScope.$state = $state;
    });


angular.module('nodblog',['ngSanitize','nodblog.config','nodblog.api.comment']).controller('MainCtrl', function ($scope) {
        
    })
    .controller('IndexCtrl', function ($scope) {
        
    })
    .controller('AboutCtrl', function ($scope) {
        $scope.test = 'about';
    })
    .controller('ContactCtrl', function ($scope) {
        $scope.test = 'contact';
    })
    .controller('BlogIndexCtrl', function ($scope,posts) {
        $scope.posts = posts;
    })
    .controller('BlogDetailsCtrl', function ($scope,post,Comment) {
        $scope.post = post;
        $scope.comments = Comment.all();
        $scope.comment = {};
        $scope.comment.post_id = post._id;
        $scope.save = function(){
            Comment.store($scope.comment).then(
                function(data) {
                    console.log(data);
                }, 
                function error(err) {
                    throw new Error(err);
                }
            );
        };
    })
    .filter('words', function () {
        return function (input, words) {
            if (isNaN(words)) return input;
            if (words <= 0) return '';
            if (input) {
                var inputWords = input.split(/\s+/);
                if (inputWords.length > words) {
                    input = inputWords.slice(0, words).join(' ') + '...';
                }
            }
            return input;
        };
    })
    .filter('ucfirst', function () {
        return function (input) {
            if (input) {
               return input.charAt(0).toUpperCase() + input.slice(1);
            }
            return input;
        };
    });
    
    
    