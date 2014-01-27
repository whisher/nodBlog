//'use strict';     
angular.module('nodblog.route',['ui.router','nodblog.api.post','nodblog.api.posts','nodblog.api.media'])
    .config(function($stateProvider,RestangularProvider,PostProvider,PostsProvider,MediaProvider) {
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
                    posts: function(Posts){
                        return Posts.all();
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
                url: '/media',
                templateUrl: 'admin/views/media/index.html',
                resolve: {
                    medias: function(Media){
                        return Media.all();
                    }
                },
                controller: 'MediaIndexCtrl'
            })
            .state('mediacreate', {
                url: '/media/create',
                templateUrl: 'admin/views/media/form.html',
                controller: 'MediaCreateCtrl'
            })
            .state('mediaedit', {
                url: '/media/edit/:id',
                templateUrl: 'admin/views/media/form.html',
                resolve: {
                    media: function(Media, $stateParams){
                        return Media.one($stateParams.id);
                    }
                },
                controller: 'MediaEditCtrl'
            })
            .state('mediadelete', {
                url: '/media/delete/:id',
                templateUrl: 'admin/views/media/delete.html',
                resolve: {
                    media: function(Media, $stateParams){
                        return Media.one($stateParams.id);
                    }
                },
                controller: 'MediaDeleteCtrl'
            });
            RestangularProvider.setBaseUrl('/api');
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
    .run(function ($state,$rootScope, $log) {
       $state.transitionTo('index');
       $rootScope.$log = $log;
    });

angular.module('nodblog',['nodblog.route','ui.bootstrap','angularFileUpload'])

    .controller('MainCtrl', function ($scope,$location) {
        $scope.items = [
            {route:'#/post/create',title:'Post'},
            {route:'#/media/create',title:'Media'},
            {route:'#/page/create',title:'Page'},
        ];
        
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
    })
    .controller('HomeCtrl', function ($scope) {
       
    })
    .controller('PostIndexCtrl', function ($scope,posts) {
        $scope.posts = posts;
    })
    .controller('PostCreateCtrl', function ($scope,$location,$filter,Post) {
        $scope.header = 'Add New Post';
        $scope.status = Post.status;
        $scope.post = {};
        $scope.post.status = $scope.status[0];
        $scope.post.published = new Date();
        $scope.save = function(){
            $scope.post.published = $filter('datetots')($scope.post.published);
            $scope.post.tags = $filter('strcstoarray')($scope.post.tags);
            Post.store($scope.post).then(
                function(data) {
                    return $location.path('/post');
                }, 
                function error(err) {
                    throw new Error(err);
                }
            );
        };
    })
    .controller('PostEditCtrl', function ($scope,$location,Post,post) {
        $scope.header = 'Edit Post';
        $scope.status = Post.status;
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
    .controller('MediaIndexCtrl', function ($scope,medias) {
       $scope.medias = medias;
    })
    .controller('MediaCreateCtrl', function ($scope,$location,$timeout,$upload,Media) {
        $scope.media = {};
        $scope.isUploaded = false;
        $scope.fileReaderSupported = window.FileReader != null;
	$scope.uploadRightAway = false;
	$scope.changeAngularVersion = function() {
		window.location.hash = $scope.angularVersion;
		window.location.reload(true);
	}
	$scope.hasUploader = function(index) {
		return $scope.upload[index] != null;
	};
	$scope.abort = function(index) {
		$scope.upload[index].abort(); 
		$scope.upload[index] = null;
	};
	$scope.angularVersion = window.location.hash.length > 1 ? window.location.hash.substring(1) : '1.2.0';
	$scope.onFileSelect = function($files) {
		$scope.selectedFiles = [];
		$scope.progress = [];
		if ($scope.upload && $scope.upload.length > 0) {
                    for (var i = 0; i < $scope.upload.length; i++) {
                        if ($scope.upload[i] != null) {
                            $scope.upload[i].abort();
			}
                    }
		}
		$scope.upload = [];
		$scope.uploadResult = [];
		$scope.selectedFiles = $files;
		$scope.dataUrls = [];
		for ( var i = 0; i < $files.length; i++) {
                    var $file = $files[i];
                    if (window.FileReader && $file.type.indexOf('image') > -1) {
                        var fileReader = new FileReader();
                        fileReader.readAsDataURL($files[i]);
                        function setPreview(fileReader, index) {
                            fileReader.onload = function(e) {
                                $timeout(function() {
                                    $scope.dataUrls[index] = e.target.result;
                                });
                            }
                        }
                        setPreview(fileReader, i);
                    }
                    $scope.progress[i] = -1;
                    if ($scope.uploadRightAway) {
                        $scope.start(i);
                    }
                    $scope.media.avatar = $scope.selectedFiles[i].name;
                }
                
        }
	
	$scope.start = function(index) {
            $scope.progress[index] = 0;
            $scope.upload[index] = $upload.upload({
                url :'/api/media',
		method: 'POST',
		headers: {'x-ng-file-upload': 'nodeblog'},
		data :$scope.media,
		file: $scope.selectedFiles[index],
		fileFormDataName: 'media'
            })
            .then(
                function(response) {
                    $scope.uploadResult.push(response.data.result);
                }, 
                function error(reason) {
                    throw new Error(reason);
                }, 
                function(evt) {console.log(evt);
                    $scope.progress[index] = parseInt(100.0 * evt.loaded / evt.total);
            });
            } 
    })
    .controller('MediaEditCtrl', function ($scope,medias) {
       $scope.medias = medias;
    })
    .controller('MediaDeleteCtrl', function ($scope,$location,media) {
        $scope.save = function() {
            return $location.path('/media');
        }
        $scope.destroy = function() {
            media.remove().then(
                function() {
                    return $location.path('/media');
                },
                function error(reason) {
                    throw new Error(reason);
                }
            );
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
    
