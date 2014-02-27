//'use strict';     
angular.module('nodblog.admin.posts',['ui.router','ui.bootstrap','angularFileUpload','nodblog.api.post','nodblog.api.comment'])
    .config(function($stateProvider,RestangularProvider) {
        $stateProvider
            .state('post', {
                url: '/post',
                templateUrl: '/src/app/admin/posts/index.tpl.html',
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
                templateUrl: '/src/app/admin/posts/form.tpl.html',
                controller: 'PostCreateCtrl'
            })
            .state('post_edit', {
                url: '/post/edit/:id',
                templateUrl: '/src/app/admin/posts/form.tpl.html',
                resolve: {
                    post: function(Post, $stateParams){
                        return Post.one($stateParams.id);
                    }
                },
                controller: 'PostEditCtrl'
            })
            .state('post_delete', {
                url: '/post/delete/:id',
                templateUrl: '/src/app/admin/posts/delete.tpl.html',
                resolve: {
                    post: function(Post,$stateParams){
                        return Post.one($stateParams.id);
                    }
                },
                controller: 'PostDeleteCtrl'
            })
            .state('post_comments', {
                url: '/post/comments/:id',
                templateUrl: '/src/app/admin/posts/comments.tpl.html',
                resolve: {
                    comments: function(Post,$stateParams){
                        return Post.commentsByPostId($stateParams.id);
                    }
                },
                controller: 'ShowCommentsCtrl'
            })
            RestangularProvider.setBaseUrl('/admin/api');
            RestangularProvider.setRequestInterceptor(function(elem, operation, what) {
                if (operation === 'put') {
                    elem._id = undefined;
                    return elem;
                }
                return elem;
            }); 
    })
    .service('PostUploader',function($upload){
        var that = this;
        var fileReaderSupported = window.FileReader !== null;
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
            })
         
        };
        this.closeAlert = function() {
            this.showAlert = false;
        };
    })
    .controller('PostParentCtrl', function ($scope,$timeout,PostUploader) {
         
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
        }
        $scope.$watch('avatar',function(newVal, oldVal){
            if(newVal) { 
                $scope.avatar = newVal;
            }  
        }); 
        $scope.$watch('showAlert',function(newVal, oldVal){
            $scope.showAlert = newVal;
            $scope.dataUrl = null;
        }); 
     
    })
    .controller('PostIndexCtrl', function ($scope,$state,WindowUtils,posts) {
        $scope.posts = posts;
        $scope.showComments = function(post){
            $state.transitionTo('post_comments',{id:post._id});
        }
        
    })
    .controller('PostCreateCtrl', function ($scope,$state,$filter,$timeout,$controller,Post,PostUploader) {
        
        
       
        $scope.header = Post.labels.frmCreateHeader;
        $scope.status = Post.status;
        $scope.post = {};
        $scope.post.status = $scope.status[0];
        $scope.post.published = new Date();
        
        angular.extend($scope, new $controller('PostParentCtrl', {$scope:$scope,$timeout:$timeout,PostUploader:PostUploader}) );
       
        $scope.save = function(){
            $scope.post.published = $filter('datetots')($scope.post.published);
            $scope.post.categories = $filter('strcstoarray')($scope.post.categories);
            $scope.post.tags = $filter('strcstoarray')($scope.post.tags);
            Post.store($scope.post).then(
                function(data) {
                    return $state.transitionTo('post');
                }, 
                function error(err) {
                    throw new Error(err);
                }
            );
        };
        
    })
    .controller('PostEditCtrl', function ($scope,$state,$timeout,$controller,$filter,PostUploader,Post,post) {
        
        $scope.header =  Post.labels.frmEditHeader;
        $scope.status = Post.status;
        
        var original = post;
        $scope.post = Post.copy(original);
        angular.extend($scope, new $controller('PostParentCtrl', {$scope:$scope,$timeout:$timeout,PostUploader:PostUploader}) );
        
        $timeout(function(){
            $scope.dataUrl = '/upload/'+post.avatar;
        });
       
        $scope.isClean = function() {
            return angular.equals(original, $scope.post);
        }
      
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
        }
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
    .controller('ShowCommentsInnerCtrl',function ($scope,$stateParams,Comment) {
       $scope.isCollapsed = true;
        $scope.approved = function(id){
            $scope.comment = Comment.specialCopy(id);
            
            $scope.comment.status = 'approved';
            $scope.comment.put().then(
                function(data) {
                    
                },
                function error(reason) {
                    throw new Error(reason);
                }
           );
        };
        
        var reply = {};
        reply.post_id = $stateParams.id;
        reply.author = 'me';
        reply.email = 'info@ilwebdifabio.it';
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
            //Number(new Date("26-January-2014"))var date = new Date(("26-January-2014").replace(/-/g, " "));
            return Date.parse(input);
        }
    })
    .filter('strcstoarray', function() {
        return function(input) {
            return _.map(input.split(','), function(s){
                return s.trim();  
            });
        }
    })
    .filter('arraytostrcs', function() {
        return function(input) {
            return input.join(',');
        }
    });

