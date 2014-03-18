(function(window, angular, undefined) {
'use strict';
//Dependencies ui.router restangular nodblog.services.base
angular.module('nodblog.blog',['ngSanitize','LocalStorageModule'])
    .constant('PREFIX_LOCAL_STORAGE','xiferpgolbdon')
    .config(function(PREFIX_LOCAL_STORAGE,$stateProvider,RestangularProvider,localStorageServiceProvider) {
        $stateProvider
            .state('blog', {
                url: '/blog',
                templateUrl: 'src/app/default/blog/index.tpl.html',
                resolve: {
                    posts: function(Post){
                        return Post.all();
                    }
                },
                controller: 'BlogIndexCtrl'
            })
            .state('post', {
                url: '/blog/:id/:slug',
                templateUrl: 'src/app/default/blog/details.tpl.html',
                resolve: {
                    post: function(Post,$stateParams){
                        return Post.one($stateParams.id);
                    },
                    comments: function(Post,$stateParams){
                        return Post.commentsByPostId($stateParams.id);
                    }
                },
                controller: 'BlogDetailsCtrl'
            });
            RestangularProvider.setBaseUrl('/api');
            RestangularProvider.setRestangularFields({
                id: "_id"
            });
            localStorageServiceProvider.setPrefix(PREFIX_LOCAL_STORAGE);
    })
    .factory('Post', function(Base) {
        function NgPost() {
            this.commentsByPostId = function(id){
                return this.getElements().one('comments',id).getList();
            };
        }
        return angular.extend(Base('post'), new NgPost());
    })
    .factory('Comment', function(Base) {
        function NgComment() {}
        return angular.extend(Base('comment'), new NgComment());
    })
    .controller('BlogIndexCtrl', function ($scope,posts) {
        $scope.posts = posts;
    })
    .controller('BlogInnerCtrl', function ($scope,$filter) {
        $scope.post.title =  $filter('ucfirst')($scope.post.title);
        $scope.post.published =  $filter('date')($scope.post.published,'short');
        $scope.post.body =  $filter('words')($scope.post.body,20);
    })
    .controller('BlogDetailsCtrl', function ($scope,localStorageService,post,comments,Comment) {
        $scope.post = post;
        $scope.comments = comments;
        var commentHasStorage = localStorageService.get('comment_id_'+post._id);
        $scope.commentHasStorage = commentHasStorage;
        if(commentHasStorage!==null){
            angular.forEach(comments, function(value, key){
                if(value._id===commentHasStorage){
                   localStorageService.remove('comment_id_'+post._id); 
                    $scope.commentHasStorage = null;
                }
            });
        }
        $scope.comment = {};
        $scope.comment.post_id = post._id;
        $scope.save = function(){
            Comment.store($scope.comment).then(
                function(data) {
                    localStorageService.add('comment_id_'+post._id,data._id);
                    $scope.commentHasStorage = data._id;
                }, 
                function error(err) {
                    throw new Error(err);
                }
            );
        };
        $scope.hasComments = function(){
            return !!$scope.comments.length;
        };
    })
    .directive('inputFeedback',function() {
        return {
            require: 'ngModel',
            restrict: 'A',
            link: function(scope, element, attrs,ctrl) {
                var $parentDiv = element.parent();
                var currentClass = $parentDiv.attr('class');
                element.on('blur',function() {
                    $parentDiv.removeClass();
                    $parentDiv.addClass(currentClass);
                    if(ctrl.$valid){
                        $parentDiv.addClass('has-success');
                     }
                     else{
                        $parentDiv.addClass('has-error'); 
                     }
                });
                
              
            }
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
 })(window, angular);         
    
    