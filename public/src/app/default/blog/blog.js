(function(window, angular, undefined) {
'use strict';
//Dependencies ui.router restangular LocalStorageModule nodblog.services.base
angular.module('nodblog.blog',['ngSanitize','nodblog.ui.paginators.simple'])
    .config(function($stateProvider,RestangularProvider) {
        $stateProvider
            .state('blog', {
                url: '/blog',
                templateUrl: 'src/app/default/blog/blog.tpl.html',
                resolve: {
                    posts: function(Post){
                        return Post.all();
                    }
                },
                controller: 'BlogIndexCtrl'
            })
            .state('blog_details', {
                url: '/blog/:id/:slug',
                templateUrl: 'src/app/default/blog/details.tpl.html',
                resolve: {
                    current: function(Post,$stateParams){
                        return Post.one($stateParams.id);
                    },
                    comments: function(Post,$stateParams){
                        return Post.commentsByPostId($stateParams.id);
                    },
                    next: function(Post,$stateParams){
                        return Post.next($stateParams.id);
                    },
                    previous: function(Post,$stateParams){
                        return Post.previous($stateParams.id);
                    }
                },
                controller: 'BlogDetailsCtrl'
            })
            .state('blog_tag', {
                url: '/blog/tag/:tag',
                templateUrl: 'src/app/default/blog/blog.tpl.html',
                resolve: {
                    post: function(Post,$stateParams){
                        return Post.one($stateParams.tag);
                    }
                },
                controller: 'BlogTagCtrl'
            });
            RestangularProvider.setBaseUrl('/api');
            RestangularProvider.setRestangularFields({
                id: "_id"
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
                        tags : value.tags
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
             var cb = function(item){  return _.indexOf(item.tags, tag)!==-1; }
             $scope.paginator.filter(cb);
        };
        $scope.hasItems = ($scope.paginator.items.length > 0);
    })
    .controller('BlogDetailsCtrl', function ($scope,$state,localStorageService,current,next,previous,comments,Comment) {
        $scope.isCollapsed = true;
        $scope.article = current;
        $scope.comments = comments;
        $scope.next = (typeof next[0] === 'undefined')?[]:next[0];
        $scope.previous = (typeof previous[0] === 'undefined')?[]:previous[0];
        $scope.hasComments = ($scope.comments > 0);
        $scope.hasNext = (typeof $scope.next._id !== 'undefined');
        $scope.hasPrevious = (typeof $scope.previous._id !== 'undefined');
        var commentHasStorage = localStorageService.get('comment_id_'+current._id);
        $scope.commentHasStorage = commentHasStorage;
        if(commentHasStorage!==null){
            angular.forEach(comments, function(value, key){
                if(value._id===commentHasStorage){
                   localStorageService.remove('comment_id_'+current._id); 
                    $scope.commentHasStorage = null;
                }
            });
        }
        $scope.comment = {};
        $scope.comment.post_id = current._id;
        $scope.save = function(){
            Comment.store($scope.comment).then(
                function(data) {
                    localStorageService.add('comment_id_'+current._id,data._id);
                    $scope.commentHasStorage = data._id;
                }, 
                function error(err) {
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
            return input.replace(/<\/?[^>]+(>|$)/g, "");
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
    
    
(function(window, angular, undefined) {
    'use strict';
    angular.module('nodblog.ui.paginators.simple',[])
        .factory('Paginator', function() {
            return function(pageSize,data) {
                    var cache =[];
                    var staticCache =[];
                    var hasNext = false;
                    var currentOffset= 0;
                    var numOfItemsXpage = pageSize;
                    var numOfItems = 0;
                    var totPages = 0;
                    var currentPage = 1;
                   
                    var load = function() {
                        staticCache = data;
                        cache = data;
                        loadFromCache();
                    };
                    var loadFromCache= function() {
                        numOfItems = cache.length;
                        totPages = Math.ceil(numOfItems/numOfItemsXpage);
                        paginator.items = cache.slice(currentOffset, numOfItemsXpage*currentPage);
                    };
                    var paginator = {
                        items : [],
                        hasOlder: function() {
                            return numOfItems > (currentPage * numOfItemsXpage);
                        },
                        hasNewer: function() {
                            return (numOfItems > numOfItemsXpage) && (currentPage!==1);
                        },
                        older: function() {
                            if (this.hasOlder()) {
                                currentPage++;
                                currentOffset += numOfItemsXpage;
                                loadFromCache();
                            }
                        },
                        newer: function() {
                            if(this.hasNewer()) {
                                currentPage--;
                                currentOffset -= numOfItemsXpage;
                                loadFromCache();
                            }
                        },
                        getNumOfItems : function(){
                            return numOfItems;
                        },
                        getCurrentPage: function() {
                            return currentPage;
                        },
                        getTotPages: function() {
                            return totPages;
                        },
                        getNumOfItemsXpage:function(){
                            return numOfItemsXpage;
                        },
                        filter:function(callback){
                            if(typeof callback === 'undefined'){
                                if(this.isClean()){
                                    return;
                                }
                                cache = staticCache;
                            }
                            else{
                                cache = staticCache;
                                cache = _.filter(cache, callback);
                            }
                            currentPage = 1;
                            currentOffset= 0;
                            loadFromCache();
                        },
                        isClean:function(){
                            return angular.equals(staticCache, cache);
                        }
                    };
                    load();
                    return paginator;
                 }
            });
        
})(window, angular);
    