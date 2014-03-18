/*! nodBlog - v0.0.1 - 2014-03-18
 * Copyright (c) 2014 Fabio Bedini aka whisher;
 * Licensed MIT
 */
(function(window, angular, undefined) {
   'use strict';
    angular.module('nodblog.admin',['templates.admin','ui.router','restangular','ngCookies','nodblog.services.base','nodblog.services.socket','nodblog.ui.paginators.elastic','nodblog.admin.index','nodblog.admin.post','nodblog.admin.media','nodblog.admin.user'])
        .value('currentUser',nB.user)
        .run(function ($state,$rootScope,$log,$filter,$cookieStore,WindowUtils) {
            $rootScope.$state = $state;
            $state.transitionTo('index');
            $rootScope.$log = $log;
            $rootScope.$on('$locationChangeSuccess', function(evt) {
                   var stateName = $state.current.name;
                   if(stateName){
                       var title = stateName.split('_').join(' ');
                       title = $filter('ucfirst')(title);
                       WindowUtils.setTitle(title);
                   }
            });
            $cookieStore.put('titles', nB.user);
            console.log($cookieStore.get('USER'));
        })
        .factory('WindowUtils', function($window) {
            return {
               setTitle:function(title){
                  var sep = ' - ';
                  var current = $window.document.title.split(sep)[0];
                  $window.document.title = current + sep + title;
               }
            };
        })
        .controller('MainCtrl', function ($scope,$location) {
            /* Nav add tab */
            $scope.items = [
                {route:'post_create',title:'Post'},
                {route:'media_create',title:'Media'},
                {route:'page_create',title:'Page'}
            ];
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
//Dependencies ui.router
angular.module('nodblog.admin.index',[])
    .config(function($stateProvider) {
        $stateProvider
        .state('index', {
            url: '/',
            templateUrl: 'src/app/admin/index/index.tpl.html',
            controller: 'IndexCtrl'
        });
    })
    .controller('IndexCtrl', function ($scope) {
    });
})(window, angular);
(function(window, angular, undefined){
'use strict';
//Dependencies ui.router nodblog.services.base nodblog.ui.paginators.elastic
angular.module('nodblog.admin.media',[])
    .config(function($stateProvider,RestangularProvider) {
        $stateProvider
            .state('media', {
                url: '/media',
                templateUrl:'src/app/admin/media/index.tpl.html',
                resolve: {
                    medias: function(Media){
                        return Media.all();
                    }
                },
                controller:'MediaIndexCtrl'
            });
            RestangularProvider.setBaseUrl('/admin/api');
            RestangularProvider.setRestangularFields({
                id: "_id"
            });
            RestangularProvider.setRequestInterceptor(function(elem, operation, what) {
                if (operation === 'put') {
                    elem._id = undefined;
                    return elem;
                }
                return elem;
            });      
    })
    .factory('Media', function(Base) {
        function NgMedia() {}
        return angular.extend(Base('media'), new NgMedia());
    })
    .controller('MediaIndexCtrl', function ($scope,$state,medias,Paginator) {
        $scope.paginator =  Paginator(2,5,medias);
    });
})(window, angular);
(function(window, angular, undefined){
'use strict';
//Dependencies ui.router nodblog.services.base nodblog.services.socket nodblog.ui.paginators.elastic
angular.module('nodblog.admin.post',['ui.bootstrap','angularFileUpload'])
    .config(function($stateProvider,RestangularProvider) {
        $stateProvider
            .state('post', {
                url: '/post',
                templateUrl: 'src/app/admin/post/post.tpl.html',
                resolve: {
                    posts: function(Post){
                        return Post.all();
                    }
                },
                controller: 'PostIndexCtrl'
            })
            .state('post_create', {
                url: '/post/create',
                name: 'create post',
                templateUrl: 'src/app/admin/post/form.tpl.html',
                controller: 'PostCreateCtrl'
            })
            .state('post_edit', {
                url: '/post/edit/:id',
                templateUrl:'src/app/admin/post/form.tpl.html',
                resolve: {
                    post: function(Post, $stateParams){
                        return Post.one($stateParams.id);
                    }
                },
                controller: 'PostEditCtrl'
            })
            .state('post_delete', {
                url: '/post/delete/:id',
                templateUrl: 'src/app/admin/post/delete.tpl.html',
                resolve: {
                    post: function(Post,$stateParams){
                        return Post.one($stateParams.id);
                    }
                },
                controller: 'PostDeleteCtrl'
            })
            .state('post_comments', {
                url: '/post/comments/:id',
                templateUrl:'src/app/admin/post/comments.tpl.html',
                resolve: {
                    comments: function(Post,$stateParams){
                        return Post.commentsByPostId($stateParams.id);
                    }
                },
                controller: 'ShowCommentsCtrl'
            });
            RestangularProvider.setBaseUrl('/admin/api');
            RestangularProvider.setRestangularFields({
                id: "_id"
            });
            RestangularProvider.setRequestInterceptor(function(elem, operation, what) {
                if (operation === 'put') {
                    elem._id = undefined;
                    return elem;
                }
                return elem;
            }); 
    })
    .factory('Post', function(Base) {
        function NgPost() {
            this.status = ['publish','draft'];
            this.labels = {
                frmCreateHeader:'Add New Post',
                frmEditHeader:'Edit Post'
            }; 
            this.commentsByPostId = function(id){
                return this.getElements().one('comments',id).getList();
            };
        }
        return angular.extend(Base('post'), new NgPost());
    })
    .factory('Comment', function(Base) {
        return Base('comment');
    })
    .factory('PreparedPosts',function($filter){
        return {
            get:function(posts){
                var data = [];
                angular.forEach(posts, function(value, key){
                    this.push({
                        title:value.title,
                        slug:value.slug,
                        author:value.author,
                        categories:$filter('arraytostrcs')(value.categories),
                        tags:$filter('arraytostrcs')(value.tags),
                        created:$filter('date')(value.created,'short'),
                        published:$filter('date')(value.published,'short'),
                        comments:value.meta.comments,
                        votes:value.meta.votes,
                        avatar:value.avatar,
                        status:value.status
                    });
                }, data);
                return data;
            }
        };   
    })
    .service('PostUploader',function($upload){
        var that = this;
        var fileReaderSupported = window.FileReader !== null;
        this.percent = 0;
        this.notify = null;
        this.success = null;
        this.showAlert = false;
        this.avatar = '';
        this.onFileSelect = function($files) {
            var $file = $files[0];
            var filename = $file.name;
            this.avatar = filename;
            var isImage = /\.(jpeg|jpg|gif|png)$/i.test(filename);
            if(!isImage){
                this.showAlert = true;
                return;
            }
            this.showAlert = false;
            if (fileReaderSupported && $file.type.indexOf('image') > -1) {
                var fileReader = new FileReader();
                fileReader.readAsDataURL($file);
                fileReader.onload = that.notify;
            }
            $upload.upload({
                url :'/admin/api/post/upload',
		method: 'POST',
		headers: {'x-ng-file-upload': 'nodeblog'},
		data :null,
		file: $file,
		fileFormDataName: 'avatar'
            })
            .success(that.success)
            .progress(function(evt) {
                
            })
            .error(function(data, status, headers, config) {
                throw new Error('Upload error status: '+status);
            });
         
        };
        this.closeAlert = function() {
            this.showAlert = false;
        }; 
        
        
    })
    .controller('PostParentCtrl', function ($scope,$timeout,currentUser,PostUploader,socket) {
        $scope.post = {}; 
        $scope.post.author = currentUser.name;
        /* Datepicker config */
        $scope.showWeeks = true;
        $scope.minDate = new Date();
        $scope.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.opened = true;
        };
        $scope.dateOptions = {
            'year-format': "'yy'",
            'starting-day': 1
        };
        $scope.format = 'MMM d, yyyy';
        
        /* Uploader post */
        angular.extend($scope,PostUploader);
        
        PostUploader.notify = function(e){
            $timeout(function() {
                $scope.dataUrl = e.target.result;
            });
        };
        
        PostUploader.success = function(data, status, headers, config) {
           $timeout(function() {
                $scope.post.avatar = data.url;
            });
        };
        
        $scope.$watch('avatar',function(newVal, oldVal){
            if(newVal) { 
                $scope.avatar = newVal;
            }  
        });
        
        $scope.$watch('showAlert',function(newVal, oldVal){
            $scope.showAlert = newVal;
            $scope.dataUrl = null;
        });
        
        socket.on('avatarUploadProgress', function (data) {
            $scope.uploadPercent = data.percent;
        });
     
    })
    .controller('PostIndexCtrl', function ($scope,$state,$timeout,posts,PreparedPosts,Paginator) {
        var preparedPosts = PreparedPosts.get(posts);
        
        $scope.paginator =  Paginator(2,5,preparedPosts);
        
        $scope.showComments = function(post){
            $state.transitionTo('post_comments',{id:post._id});
        };
    })
    .controller('PostCreateCtrl', function ($scope,$state,$filter,$timeout,$controller,Post,PostUploader,socket) {
        
        angular.extend($scope, new $controller('PostParentCtrl', {$scope:$scope,$timeout:$timeout,PostUploader:PostUploader}));
        
        $scope.header = Post.labels.frmCreateHeader;
        $scope.status = Post.status;
        
        $scope.post.status = $scope.status[0];
        $scope.post.published = new Date();
        
        $scope.save = function(){
            $scope.post.published = $filter('datetots')($scope.post.published);
            $scope.post.categories = $filter('strcstoarray')($scope.post.categories);
            $scope.post.tags = $filter('strcstoarray')($scope.post.tags);
            Post.store($scope.post).then(
                function(data) {
                    socket.emit('addPost',data);
                    return $state.transitionTo('post');
                }, 
                function error(err) {
                    throw new Error(err);
                }
            );
        };
        
    })
    .controller('PostEditCtrl', function ($scope,$state,$timeout,$controller,$filter,PostUploader,Post,post) {
        
        angular.extend($scope, new $controller('PostParentCtrl', {$scope:$scope,$timeout:$timeout,PostUploader:PostUploader}) );
        $scope.header =  Post.labels.frmEditHeader;
        $scope.status = Post.status;
        var original = post;
        $scope.post = Post.copy(original);
        console.log($scope.post);
       
        
        $timeout(function(){
            $scope.dataUrl = '/upload/'+post.avatar;
        });
       
        $scope.isClean = function() {
            return angular.equals(original, $scope.post);
        };
      
        $scope.save = function() { 
            $scope.post.published = $filter('datetots')($scope.post.published);
            $scope.post.categories = angular.isArray($scope.post.categories)?$scope.post.categories:$filter('strcstoarray')($scope.post.categories);
            $scope.post.tags = angular.isArray($scope.post.tags)?$scope.post.tags:$filter('strcstoarray')($scope.post.tags);
            $scope.post.put().then(
                function(data) {
                    return $state.transitionTo('post');
                },
                function error(reason) {
                    throw new Error(reason);
                }
            );
        };
       
    })
    .controller('PostDeleteCtrl', function ($scope,$state,post) {
        
        $scope.save = function() {
            return $state.transitionTo('post');
        };
        
        $scope.destroy = function() {
            post.remove().then(
                function() {
                    return $state.transitionTo('post');
                },
                function error(reason) {
                    throw new Error(reason);
                }
            );
        };
    })
    .controller('ShowCommentsCtrl',function ($scope,comments) {
        $scope.comments = comments;
    })
    .controller('ShowCommentsInnerCtrl',function ($scope,$stateParams,currentUser,Comment) {
       $scope.isCollapsed = true;
        $scope.approved = function(id){
            var comment = Comment.specialCopy(id);
            comment.status = 'approved';
            comment.put().then(
                function(data) {
                    
                },
                function error(reason) {
                    throw new Error(reason);
                }
           );
        };
        
        var reply = {};
        reply.post_id = $stateParams.id;
        reply.author = currentUser.name;
        reply.email = currentUser.email;
        reply.web = 'http://ilwebdifabio.it';
        reply.status = 'approved';
        reply.is_authoring = 1;
        $scope.doReply = function(id){
            reply.parent = id;
            reply.body = $scope.reply;
            Comment.store(reply).then(
                function(data) {
                   
                }, 
                function error(err) {
                    throw new Error(err);
                }
            );
            $scope.isCollapsed = true;
            $scope.reply = '';
        }; 
    })
    .directive('uploader',function() {
        return {
            restrict: 'A',
            link: function(scope, elem, attrs, ctrl) {
                elem.find('#fileholder').click(function() {
                    elem.find('#file').click();
                }); 
            }
        };
    })
    .filter('datetots', function() {
        return function(input) {
            //Number(new Date(79,5,24))var date = new Date(("26-January-2014").replace(/-/g, " "));
            return Date.parse(input);
        };
    })
    .filter('strcstoarray', function() {
        return function(input) {
            return _.map(input.split(','), function(s){
                return s.trim();  
            });
        };
    })
    .filter('arraytostrcs', function() {
        return function(input) {
            return input.join(',');
        };
    });
})(window, angular);
(function(window, angular, undefined){
'use strict'; 
//Dependencies ui.router nodblog.services.base nodblog.ui.paginators.elastic
angular.module('nodblog.admin.user',[])
    .config(function($stateProvider,RestangularProvider) {
        $stateProvider
            .state('user', {
                url: '/user',
                templateUrl: 'src/app/admin/user/user.tpl.html',
                resolve: {
                    users: function(User){
                        return User.all();
                    }
                },
                controller:'UserIndexCtrl'
            })
            .state('user_create', {
                url: '/user/create',
                templateUrl: 'src/app/admin/user/form.tpl.html',
                resolve: {
                    users: function(User){
                        return User.all();
                    }
                },
                controller:'UserCreateCtrl'
            })
            .state('user_edit', {
                url: '/user/edit/:id',
                templateUrl:'src/app/admin/user/form.tpl.html',
                resolve: {
                    user: function(User, $stateParams){
                        return User.one($stateParams.id);
                    }
                },
                controller: 'UserEditCtrl'
            })
            .state('user_delete', {
                url: '/user/delete/:id',
                templateUrl: 'src/app/admin/user/delete.tpl.html',
                resolve: {
                    user: function(User,$stateParams){
                        return User.one($stateParams.id);
                    }
                },
                controller: 'UserDeleteCtrl'
            });
            RestangularProvider.setBaseUrl('/admin/api');
            RestangularProvider.setRestangularFields({
                id: "_id"
            });
            RestangularProvider.setRequestInterceptor(function(elem, operation, what) {
                if (operation === 'put') {
                    elem._id = undefined;
                    return elem;
                }
                return elem;
            });      
    })
    .factory('User', function(Base) {
        function NgUser() {
            this.labels = {
                frmCreateHeader:'Add New User',
                frmEditHeader:'Edit User'
            }; 
        }
        return angular.extend(Base('user'), new NgUser());
    })
    .controller('UserIndexCtrl', function ($scope,$state,users,Paginator) {
        $scope.paginator =  Paginator(2,5,users);
    })
    .controller('UserCreateCtrl', function ($scope,$state,User) {
        $scope.header =  User.labels.frmEditHeader;
        $scope.user = {};
        $scope.save = function(){
            User.store($scope.user).then(
                function(data) {
                    return $state.transitionTo('user');
                }, 
                function error(err) {
                    throw new Error(err);
                }
            );
        };
        $scope.fullName = function () {
           
            return $scope.user.name + ' ' + $scope.user.email;
        };
        $scope.$watch(function(scope) {
            
            return scope.user.name + ' ' + scope.user.email;
            }, function (newFullName) { console.log(newFullName);
            $scope.fullName = newFullName;
        });
        
    })
    .controller('UserEditCtrl', function ($scope,$state,user,User) {
        $scope.header =  User.labels.frmEditHeader;
        var original = user;
        $scope.user = User.copy(original);
        $scope.isClean = function() {
            return angular.equals(original, $scope.post);
        };
        $scope.save = function() { 
            $scope.user.put().then(
                function(data) {
                    return $state.transitionTo('user');
                },
                function error(reason) {
                    throw new Error(reason);
                }
            );
        };
    })
    .controller('UserDeleteCtrl', function ($scope,$state,user) {
        $scope.save = function() {
            return $state.transitionTo('user');
        };
        $scope.destroy = function() {
            user.remove().then(
                function() {
                    return $state.transitionTo('user');
                },
                function error(reason) {
                    throw new Error(reason);
                }
            );
        };
    });
})(window, angular);
(function(window, angular, undefined) {
'use strict';
//Dependencies restangular
    angular.module('nodblog.services.base', [])
        .factory('Base', function(Restangular) {
            return function(route){
                var elements = Restangular.all(route); 
                return {
                    one : function (id) {
                        return Restangular.one(route, id).get();
                    },
                    all : function () {
                        return elements.getList();
                    },
                    store : function(data) {
                        return elements.post(data);
                    },
                    copy : function(original) {
                        return Restangular.copy(original);
                    },
                    getElements : function() {
                        return elements;
                    },
                    specialCopy : function(id) {
                        return Restangular.one(route, id);
                    }
                };
            };  
        });
})(window, angular);
(function(window, angular, undefined) {
    'use strict';
    angular.module('nodblog.services.socket', [])
        .factory('socket', function ($rootScope) {
            var socket = io.connect();
            return {
                on: function (eventName, callback) {
                    socket.on(eventName, function () {  
                        var args = arguments;
                        $rootScope.$apply(function () {
                            callback.apply(socket, args);
                        });
                    });
                },
                emit: function (eventName, data, callback) {
                    socket.emit(eventName, data, function () {
                        var args = arguments;
                        $rootScope.$apply(function () {
                            if (callback) {
                                callback.apply(socket, args);
                            }
                        });
                    });
                }
            };
        });
})(window, angular);
(function(window, angular, undefined) {
    'use strict';
    angular.module('nodblog.ui.paginators.elastic', [])
        .factory('Paginator', function() {
            return function(pageSize,navRange,data) {
                    var cache =[];
                    var hasNext = false;
                    var currentOffset= 0;
                    var numOfItemsXpage = pageSize;
                    var pageRange = navRange;
                    var numOfItems = 0;
                    var totPages = 0;
                    var currentPage = 1;
                    var end = 0;
                    var start = 0;
                    var delta = 1;
                    var load = function() {
                        cache = data;
                        numOfItems = cache.length;
                        hasNext = numOfItems > numOfItemsXpage;
                        totPages = Math.ceil(numOfItems/numOfItemsXpage);
                        if (pageRange > totPages) {
                                pageRange = totPages;
                        }
                        loadFromCache();
                    };
                    var loadFromCache= function() { 
                        paginator.items = cache.slice(currentOffset, numOfItemsXpage*currentPage);
                        delta = Math.ceil(pageRange / 2);
                        if (currentPage - delta > totPages - pageRange) {
                            start = totPages - pageRange + 1;
                            end = totPages+1;
                        }
                        else {
                            if (currentPage - delta < 0) {
                                delta = currentPage;
                            }
                            var offset = currentPage - delta;
                            start = offset + 1;
                            end = offset + pageRange +1;
                       }
                       hasNext = numOfItems > (currentPage * numOfItemsXpage);
                    };
                    var paginator = {
                        
                        items : [],
                        hasNext: function() {
                            return hasNext;
                        },
                        hasPrevious: function() {
                            return currentOffset !== 0;
                        },
                        hasFirst: function() {
                           return currentPage !== 1; 
                        },
                        hasLast: function() {
                           return totPages > 2 && currentPage!==totPages; 
                        },
                        next: function() {
                            if (this.hasNext()) {
                                currentPage++;
                                currentOffset += numOfItemsXpage;
                                loadFromCache();
                            }
                        },
                        previous: function() {
                            if(this.hasPrevious()) {
                                currentPage--;
                                currentOffset -= numOfItemsXpage;
                                loadFromCache();
                            }
                        },
                        toPageId:function(num){
                            currentPage=num;
                            currentOffset= (num-1) * numOfItemsXpage;
                            loadFromCache();
                        },
                        first:function(){
                            this.toPageId(1);
                        },
                        last:function(){
                            this.toPageId(totPages);
                        },
                        getNumOfItems : function(){
                            return numOfItems;
                        },
                        getCurrentPage: function() {
                            return currentPage;
                        },
                        getEnd: function() {
                            return end;
                        },
                        getStart: function() {
                            return start;
                        },
                        getTotPages: function() {
                            return totPages;
                        },
                        getNumOfItemsXpage:function(){
                            return numOfItemsXpage;
                        }
                    };
                    load();
                    return paginator;
                 };
        })
        .filter('pagination', function() {
            return function(input,start,end) {
                start = parseInt(start,10);
                end = parseInt(end,10);
                for (var i = start; i < end; i++) {
                    input.push(i);
                }
                return input;
            };
        });
})(window, angular);
angular.module('templates.admin', ['src/app/admin/index/index.tpl.html', 'src/app/admin/media/index.tpl.html', 'src/app/admin/post/comments.tpl.html', 'src/app/admin/post/delete.tpl.html', 'src/app/admin/post/form.tpl.html', 'src/app/admin/post/post.tpl.html', 'src/app/admin/user/delete.tpl.html', 'src/app/admin/user/form.tpl.html', 'src/app/admin/user/user.tpl.html']);

angular.module("src/app/admin/index/index.tpl.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("src/app/admin/index/index.tpl.html",
    "<div class=\"col-6 col-sm-6 col-lg-4\">\n" +
    "    <h2>Index admin </h2>\n" +
    "    <p>Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo</p>\n" +
    "    <h3>{{test}}</h3>\n" +
    "</div>\n" +
    "");
}]);

angular.module("src/app/admin/media/index.tpl.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("src/app/admin/media/index.tpl.html",
    "");
}]);

angular.module("src/app/admin/post/comments.tpl.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("src/app/admin/post/comments.tpl.html",
    "<div id=\"cmt-wrapper\" class=\"col-md-6\" data-ng-show=\"comments.length > 0\">\n" +
    "    <div class=\"cmt-box\" data-ng-repeat=\"comment in comments\" data-ng-controller=\"ShowCommentsInnerCtrl\">\n" +
    "        <div class=\"cmt-email bg-info\">{{comment.email}}</div>\n" +
    "        <div class=\"cmt-author\">{{comment.author}}</div>\n" +
    "        <div class=\"cmt-web\" data-ng-if=\"comment.web\"><a href=\"{{comment.web}}\" target=\"_blank\">{{comment.web}}</a></div>\n" +
    "        <div class=\"cmt-body\">{{comment.body}}</div>\n" +
    "        <div class=\"cmt-create\">{{comment.created | date:'short'}}</div>\n" +
    "        <div class=\"cmt-children\" data-ng-if=\"comment.children.length > 0\" data-ng-repeat=\"children in comment.children\">\n" +
    "            <p class=\"text-info\">{{children.body}}</p>\n" +
    "        </div>\n" +
    "        <form class=\"clearfix\" name=\"form\" role=\"form\" collapse=\"isCollapsed\" data-ng-submit=\"doReply(comment._id)\">\n" +
    "            <div class=\"form-group\">\n" +
    "                <textarea name=\"body\" id=\"body\" rows=\"5\" class=\"form-control\" placeholder=\"Write a reply\" data-ng-model=\"reply\" required=\"required\"></textarea>\n" +
    "            </div>\n" +
    "            <button type=\"submit\" class=\"btn btn-primary pull-right btn-xs\" data-ng-disabled=\"form.$invalid\">Reply</button>\n" +
    "        </form>\n" +
    "        <div class=\"cmt-footer\">\n" +
    "            <a data-ng-click=\"approved(comment._id)\" class=\"btn btn-success btn-xs\" title=\"approve comment\">\n" +
    "                <span class=\"glyphicon glyphicon-ok\"></span> Approve\n" +
    "            </a>\n" +
    "            <a data-ng-click=\"isCollapsed = !isCollapsed\" class=\"btn btn-info btn-xs\" title=\"reply comment\">\n" +
    "                <span class=\"glyphicon glyphicon-share-alt\"></span> Reply\n" +
    "            </a>\n" +
    "            <a data-ng-href=\"#/comment/edit/{{comment._id}}\" class=\"btn btn-warning btn-xs\" title=\"edit comment\">\n" +
    "                <span class=\"glyphicon glyphicon-edit\"></span> Edit\n" +
    "            </a>\n" +
    "            <a data-ng-href=\"#/comment/delete/{{comment._id}}\" class=\"btn btn-danger btn-xs\" title=\"delete comment\">\n" +
    "                <span class=\"glyphicon glyphicon-trash\"></span> Delete\n" +
    "            </a>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>  \n" +
    "\n" +
    "\n" +
    "");
}]);

angular.module("src/app/admin/post/delete.tpl.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("src/app/admin/post/delete.tpl.html",
    "<form class=\"form-inline\" role=\"form\">\n" +
    "  <div class=\"form-group\">\n" +
    "  <h3>Are you sure you want to delete this post?</h3> \n" +
    "  <button type=\"button\" class=\"btn btn-primary\" data-ng-click=\"destroy()\">Yes</button>\n" +
    "  <button type=\"button\" class=\"btn btn-danger\" data-ng-click=\"save()\">No thanks</button>\n" +
    "  </div>\n" +
    "</form>\n" +
    "   ");
}]);

angular.module("src/app/admin/post/form.tpl.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("src/app/admin/post/form.tpl.html",
    "<h2>{{header}}</h2>\n" +
    "<form name=\"form\" class=\"form-horizontal\" role=\"form\" data-ng-submit=\"save()\" uploader>\n" +
    "    <div class=\"col-md-8\">\n" +
    "        <div class=\"form-group\">\n" +
    "            <input type=\"text\" name=\"title\" id=\"title\" class=\"form-control\" placeholder=\"Enter title here\" data-ng-model=\"post.title\" required />\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <textarea name=\"body\" id=\"body\" rows=\"8\" class=\"form-control\" placeholder=\"Enter body here\" data-ng-model=\"post.body\" required></textarea>\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <input type=\"text\" class=\"form-control\" name=\"categories\" id=\"categories\" placeholder=\"Enter categories here (at least one)\" data-ng-model=\"post.categories\" ng-pattern=\"/^\\w(\\s*,?\\s*\\w)*$/\" required />\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <input type=\"text\" class=\"form-control\" name=\"tags\" id=\"tags\" placeholder=\"Enter tags here (at least one)\" data-ng-model=\"post.tags\" ng-pattern=\"/^\\w(\\s*,?\\s*\\w)*$/\" required />\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-3 col-md-offset-1\">\n" +
    "        <div class=\"form-group\">\n" +
    "            <div class=\"input-group\">\n" +
    "                <div class=\"btn-toolbar\">\n" +
    "                    <button type=\"button\" class=\"btn btn-primary\" data-ng-model=\"post.status\" data-ng-repeat=\"s in status\" btn-radio=\"s\">{{s}}</button> \n" +
    "                </div>\n" +
    "            </div> \n" +
    "        </div> \n" +
    "        <div class=\"form-group\">\n" +
    "            <div class=\"input-group\">\n" +
    "                <input type=\"text\" class=\"form-control\" id=\"datepicker\" data-ng-readonly=\"true\" datepicker-popup=\"{{format}}\" data-ng-model=\"post.published\" is-open=\"opened\" min=\"minDate\" max=\"'2015-06-22'\" datepicker-options=\"dateOptions\" date-disabled=\"disabled(date, mode)\" data-ng-required=\"true\" close-text=\"Close\" />\n" +
    "                <span class=\"input-group-btn\">\n" +
    "                    <button class=\"btn btn-default\" data-ng-click=\"open($event)\"><i class=\"glyphicon glyphicon-calendar\"></i></button>\n" +
    "                </span>  \n" +
    "            </div> \n" +
    "        </div>\n" +
    "        <div class=\"form-group\" style=\"display:none;\">\n" +
    "            <input type=\"file\" class=\"form-control\" id=\"file\" data-ng-file-select=\"onFileSelect($files)\">\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <div class=\"input-group\">\n" +
    "                <input type=\"text\" style=\"display:none;\" data-ng-model=\"post.avatar\" required />\n" +
    "                <input type=\"text\" readonly=\"readonly\" class=\"form-control\" id=\"fileholder\" title=\"click to upload an avatar\" data-ng-model=\"avatar\" />\n" +
    "                <span class=\"input-group-btn\">\n" +
    "                    <button class=\"btn btn-default\" data-ng-disabled=\"true\"><i class=\"glyphicon glyphicon-floppy-open\"></i></button>\n" +
    "                </span> \n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"form-group\" data-ng-if=\"uploadPercent > 0\">\n" +
    "            <div class=\"progress\">\n" +
    "                <div class=\"progress-bar\" role=\"progressbar\" aria-valuenow=\"{{uploadPercent}}\" aria-valuemin=\"0\" aria-valuemax=\"100\" data-ng-style=\"{width:uploadPercent+'%'}\">\n" +
    "                    {{uploadPercent}}\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <alert data-ng-show=\"showAlert\" type=\"'danger'\" close=\"closeAlert()\">\n" +
    "                Only images are allowed !  \n" +
    "            </alert>\n" +
    "            <img class=\"avatar-to-upload\" data-ng-show=\"dataUrl\" data-ng-src=\"{{dataUrl}}\">\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-8\">\n" +
    "        <div class=\"form-group\">\n" +
    "            <input type=\"submit\" class=\"btn btn-primary\" value=\"Save\" data-ng-disabled=\"isClean() || form.$invalid\" />\n" +
    "        </div>\n" +
    "    </div>    \n" +
    "</form>\n" +
    "\n" +
    "\n" +
    "");
}]);

angular.module("src/app/admin/post/post.tpl.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("src/app/admin/post/post.tpl.html",
    "<div class=\"well\">\n" +
    "    <a data-ui-sref=\"post_create\" class=\"btn btn-primary\">New</a>\n" +
    "</div>\n" +
    "<table class=\"table table-striped\" data-ng-show=\"paginator.items.length > 0\">\n" +
    "    <thead>\n" +
    "        <tr>\n" +
    "            <th>Title</th>\n" +
    "            <th>Slug</th>\n" +
    "            <th>Author</th>\n" +
    "            <th>Categories</th>\n" +
    "            <th>Tags</th>\n" +
    "            <th>Created</th>\n" +
    "            <th>Published</th>\n" +
    "            <th><span class=\"glyphicon glyphicon-thumbs-up\" title=\"Votes\"></th>\n" +
    "            <th><span class=\"glyphicon glyphicon-comment\" title=\"Comments\"></span></th>\n" +
    "            <th>Avatar</th>\n" +
    "            <th>Status</th>\n" +
    "            <th>Actions</th>\n" +
    "        </tr>\n" +
    "    </thead>\n" +
    "    <tbody>\n" +
    "        <tr data-ng-repeat=\"post in paginator.items\">\n" +
    "            <td>{{post.title}}</td>\n" +
    "            <td>{{post.slug}}</td>\n" +
    "            <td>{{post.author}}</td>\n" +
    "            <td>{{post.categories}}</td>\n" +
    "            <td>{{post.tags}}</td>\n" +
    "            <td>{{post.created}}</td>\n" +
    "            <td>{{post.published}}</td>\n" +
    "            <td>{{post.votes}}</td>\n" +
    "            <td ng-switch=\"post.meta.comments\">\n" +
    "                <span class=\"badge\" ng-switch-when=\"0\">0</span>\n" +
    "                <a class=\"badge\" data-ng-click=\"showComments(post)\" data-ng-switch-default>\n" +
    "                    <span class=\"text-warning\" title=\"pending\">{{post.comments.pending}}</span>/<span class=\"text-success\" title=\"approved\">{{post.comments.approved}}</span>\n" +
    "                </a>\n" +
    "            </td>\n" +
    "            <td><img alt=\"{{post.title}}\" title=\"{{post.title}}\" class=\"img-thumbnail post-avatar\" data-ng-src=\"/upload/{{post.avatar}}\"></td>\n" +
    "            <td>{{post.status}}</td>\n" +
    "            <td>\n" +
    "                <a data-ui-sref=\"post_edit({ id: post._id })\" class=\"btn btn-warning btn-sm\" title=\"edit post\">\n" +
    "                    <span class=\"glyphicon glyphicon-edit\"></span> Edit\n" +
    "                </a>\n" +
    "                <a data-ui-sref=\"post_delete({ id: post._id })\" class=\"btn btn-danger btn-sm\" title=\"delete post\">\n" +
    "                    <span class=\"glyphicon glyphicon-trash\"></span> Delete\n" +
    "                </a>\n" +
    "            </td>\n" +
    "        </tr>\n" +
    "    </tbody>\n" +
    "</table>\n" +
    "<div class=\"text-center\">\n" +
    "    <ul class=\"pagination\">\n" +
    "        <li data-ng-class=\"{disabled: !paginator.hasPrevious()}\">\n" +
    "            <a href data-ng-click=\"paginator.previous()\">&laquo; </a>\n" +
    "        </li>\n" +
    "        <li data-ng-class=\"{disabled: !paginator.hasFirst()}\">\n" +
    "            <a href data-ng-click=\"paginator.first()\">&lsaquo;</a>\n" +
    "        </li>\n" +
    "        <li data-ng-repeat=\"n in [] | pagination:paginator.getStart():paginator.getEnd()\" data-ng-class=\"{active: n == paginator.getCurrentPage()}\">\n" +
    "            <a  href data-ng-click=\"paginator.toPageId(n)\">{{n}}</a>\n" +
    "        </li>\n" +
    "        <li data-ng-class=\"{disabled: !paginator.hasLast()}\">\n" +
    "            <a href data-ng-click=\"paginator.last()\">&rsaquo; </a>\n" +
    "        </li>\n" +
    "        <li data-ng-class=\"{disabled: !paginator.hasNext()}\">\n" +
    "            <a href data-ng-click=\"paginator.next()\">&raquo;</a>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "");
}]);

angular.module("src/app/admin/user/delete.tpl.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("src/app/admin/user/delete.tpl.html",
    "<form class=\"form-inline\" role=\"form\">\n" +
    "  <div class=\"form-group\">\n" +
    "  <h3>Are you sure you want to delete this user?</h3> \n" +
    "  <button type=\"button\" class=\"btn btn-primary\" data-ng-click=\"destroy()\">Yes</button>\n" +
    "  <button type=\"button\" class=\"btn btn-danger\" data-ng-click=\"save()\">No thanks</button>\n" +
    "  </div>\n" +
    "</form>\n" +
    "   ");
}]);

angular.module("src/app/admin/user/form.tpl.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("src/app/admin/user/form.tpl.html",
    "<h2>{{header}}</h2>\n" +
    "<form name=\"form\" class=\"form-horizontal\" role=\"form\" data-ng-submit=\"save()\">\n" +
    "    <div class=\"col-md-8\">\n" +
    "        <div class=\"form-group\">\n" +
    "            <input type=\"text\" name=\"name\" id=\"name\" class=\"form-control\" placeholder=\"Name\" data-ng-model=\"user.name\" required />\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <input type=\"text\" name=\"username\" id=\"username\" class=\"form-control\" placeholder=\"Username\" data-ng-model=\"user.username\" required />\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <input type=\"email\" name=\"email\" id=\"name\" class=\"form-control\" placeholder=\"Email\" data-ng-model=\"user.email\" required />\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <input type=\"password\" name=\"password\" id=\"password\" class=\"form-control\" placeholder=\"Password\" data-ng-model=\"user.password\" required />\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <div class=\"pull-right\">\n" +
    "                <button type=\"submit\" class=\"btn btn-primary\" data-ng-disabled=\"isClean() || form.$invalid\">Add</button>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</form>\n" +
    "\n" +
    "");
}]);

angular.module("src/app/admin/user/user.tpl.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("src/app/admin/user/user.tpl.html",
    "<div class=\"well\">\n" +
    "    <a class=\"btn btn-primary\" data-ui-sref=\"user_create\">New</a>\n" +
    "</div>\n" +
    "<table class=\"table table-striped\" data-ng-show=\"paginator.items.length > 0\">\n" +
    "    <thead>\n" +
    "        <tr>\n" +
    "            <th>Name</th>\n" +
    "            <th>Email</th>\n" +
    "            <th>Username</th>\n" +
    "            <th>Actions</th>\n" +
    "        </tr>\n" +
    "    </thead>\n" +
    "    <tbody>\n" +
    "        <tr data-ng-repeat=\"user in paginator.items\">\n" +
    "            <td>{{user.name}}</td>\n" +
    "            <td>{{user.email}}</td>\n" +
    "            <td>{{user.username}}</td>\n" +
    "            <td>\n" +
    "                <a data-ui-sref=\"user_edit({ id: user._id })\" class=\"btn btn-warning btn-sm\" title=\"edit user\">\n" +
    "                    <span class=\"glyphicon glyphicon-edit\"></span> Edit\n" +
    "                </a>\n" +
    "                <a data-ui-sref=\"user_delete({ id: user._id })\" class=\"btn btn-danger btn-sm\" title=\"delete user\">\n" +
    "                    <span class=\"glyphicon glyphicon-trash\"></span> Delete\n" +
    "                </a>\n" +
    "            </td>\n" +
    "        </tr>\n" +
    "    </tbody>\n" +
    "</table>\n" +
    "<div class=\"text-center\">\n" +
    "    <ul class=\"pagination\">\n" +
    "        <li data-ng-class=\"{disabled: !paginator.hasPrevious()}\">\n" +
    "            <a href data-ng-click=\"paginator.previous()\">&laquo; </a>\n" +
    "        </li>\n" +
    "        <li data-ng-class=\"{disabled: !paginator.hasFirst()}\">\n" +
    "            <a href data-ng-click=\"paginator.first()\">&lsaquo;</a>\n" +
    "        </li>\n" +
    "        <li data-ng-repeat=\"n in [] | pagination:paginator.getStart():paginator.getEnd()\" data-ng-class=\"{active: n == paginator.getCurrentPage()}\">\n" +
    "            <a  href data-ng-click=\"paginator.toPageId(n)\">{{n}}</a>\n" +
    "        </li>\n" +
    "        <li data-ng-class=\"{disabled: !paginator.hasLast()}\">\n" +
    "            <a href data-ng-click=\"paginator.last()\">&rsaquo; </a>\n" +
    "        </li>\n" +
    "        <li data-ng-class=\"{disabled: !paginator.hasNext()}\">\n" +
    "            <a href data-ng-click=\"paginator.next()\">&raquo;</a>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "</div>\n" +
    "\n" +
    "");
}]);

angular.module('templates.common', []);

