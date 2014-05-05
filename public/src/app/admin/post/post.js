(function(window, angular, undefined){
'use strict';
//Dependencies ui.router angularFileUpload ui.bootstrap nodblog.services.base nodblog.services.socket nodblog.ui.paginators.elastic
angular.module('nodblog.admin.post',[])
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
                url: '/post/comments/:id/:slug',
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
                        id:value._id,
                        title:value.title,
                        slug:value.slug,
                        author:value.user.name,
                        author_id:value.user._id,
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
    .controller('PostParentCtrl', function ($scope,$timeout,PostUploader,Memory,Socket) {
       
        $scope.post = {}; 
        
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
        
        Socket.on('avatarUploadProgress', function (data) {
            $scope.uploadPercent = data.percent;
        });
     
    })
    .controller('PostIndexCtrl', function ($scope,$state,posts,PreparedPosts,Paginator) {
        var preparedPosts = [];
        if(posts.length > 0){
            preparedPosts = PreparedPosts.get(posts);
        }
        $scope.paginator =  Paginator(2,5,preparedPosts);
        $scope.hasItems = ($scope.paginator.items.length > 0);
    })
    .controller('PostCreateCtrl', function ($scope,$state,$filter,$timeout,$controller,Post,PostUploader,Memory,Socket) {
        
        angular.extend($scope, new $controller('PostParentCtrl', {$scope:$scope,$timeout:$timeout,PostUploader:PostUploader}));
        
        $scope.header = Post.labels.frmCreateHeader;
        
        $scope.status = Post.status;
        
        $scope.post.status = Post.status[0];
        $scope.post.published = new Date();
        $scope.post.meta  = {};
        
        var memoryPost = Memory.getPost();
        var dataUrl = Memory.getDataUrl();
        
        if(!_.isEmpty(memoryPost)){
            $scope.post = memoryPost;
        }
        
        if(dataUrl){
            $timeout(function(){
                $scope.dataUrl = dataUrl;
            });
        }
        
        $scope.save = function(){
            $scope.post.published = $filter('datetots')($scope.post.published);
            $scope.post.categories = $filter('strcstoarray')($scope.post.categories);
            $scope.post.tags = $filter('strcstoarray')($scope.post.tags);
            $scope.post.meta.medias  = Memory.getMediaIds();
            Post.store($scope.post).then(
                function(data) {
                    if( ($scope.post.status==='publish') && !($scope.post.published > Date.now()) ){
                       Socket.emit('addPost',{id:data._id,slug:data.slug}); 
                    }
                    Memory.resetAll();
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
        
       
        
        $timeout(function(){
            $scope.dataUrl = '/upload/'+post.avatar;
        });
       
        $scope.isClean = function() {
            return angular.equals(original, $scope.post);
        };
      
        $scope.save = function() { 
            $scope.post.author = $scope.currentUser.name;
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
    .controller('ShowCommentsInnerCtrl',function ($scope,$stateParams,Comment,Socket) {
        $scope.isCollapsed = true;
        
        $scope.approved = function(id){
            var comment = Comment.specialCopy(id);
            
            comment.status = 'approved';
            comment.put().then(
                function(data) {
                    Socket.emit('approveComment',{post_id:data.post_id,post_slug:$stateParams.slug,id:data._id});   
                },
                function error(reason) {
                    throw new Error(reason);
                }
                );
        };
        
       
        $scope.doReply = function(id){
            var currentUser = $scope.currentUser.user;
            var reply = {};
            reply.post_id = $stateParams.id;
            reply.author = currentUser.name;
            reply.email = currentUser.email;
            reply.web = 'http://ilwebdifabio.it';
            reply.status = 'approved';
            reply.is_authoring = 1;
            reply.parent = id;
            reply.body = $scope.reply;
            Comment.store(reply).then(
                function(data) {
                  Socket.emit('replyComment',{post_id:reply.post_id,post_slug:$stateParams.slug,id:data._id});   
                }, 
                function error(err) {
                    throw new Error(err);
                }
                );
            $scope.isCollapsed = true;
            $scope.reply = '';
        }; 
    })
    .directive('nbMemoryPost',function($timeout,$state,Memory) {
        return {
            restrict: 'A',
            link: function(scope,element) {
                var $pickUpMedia = element.find('#pick-up-media');
                $pickUpMedia.on('click',function(e){
                    e.preventDefault();
                    Memory.setPost(scope.post);
                    Memory.setDataUrl(scope.dataUrl);
                    return $state.transitionTo('media'); 
                })
            }
        };
    })
    .directive('nbTabs',function() {
        return {
            restrict: 'A',
            link: function(scope,element) {
                var tabs = element.find('a'),
                    $body = $('#body'),
                    $visual = $('#show-as-html');
                tabs.click(function (e) {
                    e.preventDefault();
                    var $this = $(this);
                    if($this.attr('href') === '#show-as-html'){
                        $visual.height($body.height());
                        $visual.html($body.val()); 
                    }
                    $this.tab('show');
                });
            }
        };
    });
})(window, angular);
