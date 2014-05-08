(function(window, angular, undefined) {
    'use strict';
    //Dependencies ui.router restangular LocalStorageModule nodblog.services.base
    angular.module('nodblog.blog',['ngSanitize','nodblog.ui.paginators.simple'])
    .config(function($stateProvider,RestangularProvider) {
        $stateProvider
        .state('blog', {
            url: '/blog',
            templateUrl: '/public/default/blog/blog.tpl.html',
            resolve: {
                posts: function(Post){
                    return Post.all();
                }
            },
            controller: 'BlogIndexCtrl'
        })
        .state('blog_details', {
            url: '/blog/:id/:slug?scrollTo',
            templateUrl: '/public/default/blog/details.tpl.html',
            resolve: {
                current: function(Post,$stateParams){
                    return Post.one($stateParams.id);
                },
                next: function(Post,$stateParams){
                    return Post.next($stateParams.id);
                },
                previous: function(Post,$stateParams){
                    return Post.previous($stateParams.id);
                },
                comments: function(Post,$stateParams){
                    return Post.commentsByPostId($stateParams.id);
                }
            },
            controller: 'BlogDetailsCtrl'
        })
        .state('blog_tag', {
            url: '/blog/tag/:tag',
            templateUrl: '/public/default/blog/blog.tpl.html',
            resolve: {
                post: function(Post,$stateParams){
                    return Post.one($stateParams.tag);
                }
            },
            controller: 'BlogTagCtrl'
        });
        RestangularProvider.setBaseUrl('/api');
        RestangularProvider.setRestangularFields({
            id: '_id'
        });
    })
    .factory('Post', function(Base) {
        function NgPost() {
            this.commentsByPostId = function(id){
                return this.getElements().one('comments',id).getList();
            };
            this.next = function(id){
                return this.specialCopy(id).getList('next');
            };
            this.previous = function(id){
                return this.specialCopy(id).getList('previous');
            };
        }
        return angular.extend(Base('post'), new NgPost());
    })
    .factory('Comment', function(Base) {
        function NgComment() {}
        return angular.extend(Base('comment'), new NgComment());
    })
    .factory('PreparedPosts',function($filter){
        return {
            get:function(posts){
                var data = [];
                angular.forEach(posts, function(value, key){
                    var text = $filter('nbStripTags')(value.body);
                    this.push({
                        id: value._id,
                        title : $filter('ucfirst')(value.title),
                        slug : value.slug,
                        published : $filter('date')(value.published,'dd/MM/yyyy'),
                        body : $filter('words')(text,35),
                        avatar: value.avatar,
                        tags : value.tags,
                        comments : value.meta.comments.approved
                    });
                }, data);
                return data;
            }
        };
    })
    .factory('PreparedComments',function($filter){
        return {
            get:function(comments){
                var data = [];
                angular.forEach(comments, function(value, key){
                    var text = $filter('nbStripTags')(value.body);
                    this.push({
                        id: value._id,
                        author:value.author,
                        created : $filter('date')(value.created,'dd/MM/yyyy'),
                        body : text,
                        children: value.children,
                        hasChildren: value.children.length > 0
                    });
                }, data);
                return data;
            }
        };
    })
    .controller('BlogIndexCtrl', function ($scope,posts,PreparedPosts,Paginator,$filter) {
        var preparedPosts = [];
        if(posts.length > 0){
            preparedPosts = PreparedPosts.get(posts);
        }
        $scope.paginator =  Paginator(2,preparedPosts);
        $scope.filter = function(tag){
            var cb = function(item){
                return _.indexOf(item.tags, tag)!==-1;
            };
            $scope.paginator.filter(cb);
        };
        var itemsLength = $scope.paginator.items.length;
        $scope.hasItems = (itemsLength > 0);
        $scope.hasPagination = $scope.hasItems && ($scope.paginator.getNumOfItems() > itemsLength);
        
    })
    .controller('BlogDetailsCtrl', function ($scope,$state,localStorageService,current,next,previous,comments,Comment,PreparedComments,Socket) {
        $scope.isCollapsed = true;
        $scope.article = current;
        $scope.comments = PreparedComments.get(comments);
        $scope.next = (typeof next[0] === 'undefined')?[]:next[0];
        $scope.previous = (typeof previous[0] === 'undefined')?[]:previous[0];
        $scope.hasComments = ($scope.comments.length > 0);
        $scope.hasNext = (typeof $scope.next._id !== 'undefined');
        $scope.hasPrevious = (typeof $scope.previous._id !== 'undefined');
        var commentHasStorage = localStorageService.get('comment_id_'+current._id);
        $scope.commentHasStorage = commentHasStorage;
        if(commentHasStorage!==null){
            angular.forEach(comments, function(value, key){
                if(value._id===commentHasStorage){
                    localStorageService.remove('comment_id_'+current._id);
                    localStorageService.add('comment_id_reply_'+current._id,value._id);
                    $scope.commentHasStorage = null;
                }
            });
        }
        $scope.comment = {};
        $scope.comment.post_id = current._id;
        $scope.save = function(){
            Comment.store($scope.comment).then(
                function(data) {
                    Socket.emit('addComment',data);
                    localStorageService.add('comment_id_'+current._id,data._id);
                    $scope.commentHasStorage = data._id;
                },
                function(err) {
                    throw new Error(err);
                }
                );
        };
        
        $scope.filter = function(tag){
            return $state.transitionTo('blog');
        };
        $scope.cancel = function(){
            $scope.isCollapsed = true;
        };
    })
    .directive('nbNavTags',function() {
        return {
            restrict: 'A',
            template:'<i class="glyphicon glyphicon-tags"></i> <span data-ng-repeat="tag in tags"> <a data-ng-click="filter({tag:tag})"> {{tag}}</a><span data-ng-if="!$last">,</span></span> ',
            scope: {
                tags: '=',
                filter: '&'
            },
            link: function(scope, elem) {
              
            }
        };
    })
    .filter('nbStripTags', function () {
        return function(input) {
            return input.replace(/<\/?[^>]+(>|$)/g, '');
        };
    })
    .filter('words', function () {
        return function (input, words) {
            if (isNaN(words)) {
                return input;
            }
            if (words <= 0){
                return '';
            }
            if (input) {
                var inputWords = input.split(/\s+/);
                if (inputWords.length > words) {
                    input = inputWords.slice(0, words).join(' ') + '...';
                }
            }
            return input;
        };
    })
    .filter('arraytostrcs', function() {
        return function(input) {
            return input.join(',');
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