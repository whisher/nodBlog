(function(window, angular, undefined){
'use strict';
//Dependencies ui.router angularFileUpload nodblog.services.base nodblog.ui.paginators.elastic
angular.module('nodblog.admin.media',[])
    .config(function($stateProvider,RestangularProvider) {
        $stateProvider
            .state('media', {
                url: '/media',
                templateUrl:'src/app/admin/media/media.tpl.html',
                resolve: {
                    medias: function(Media){
                        return Media.all();
                    }
                },
                controller:'MediaIndexCtrl'
            })
            .state('media_create', {
                url: '/media/create',
                templateUrl: 'src/app/admin/media/form.tpl.html',
                controller: 'MediaCreateCtrl'
            })
            .state('media_edit', {
                url: '/media/edit/:id',
                templateUrl:'src/app/admin/media/form.tpl.html',
                resolve: {
                    media: function(Media, $stateParams){
                        return Media.one($stateParams.id);
                    }
                },
                controller: 'MediaEditCtrl'
            })
            .state('media_delete', {
                url: '/media/delete/:id',
                templateUrl: 'src/app/admin/media/delete.tpl.html',
                resolve: {
                    media: function(Media,$stateParams){
                        return Media.one($stateParams.id);
                    }
                },
                controller: 'MediaDeleteCtrl'
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
    .factory('PreparedMedias',function($filter){
        return {
            get:function(medias){
                var data = [];
                angular.forEach(medias, function(value, key){
                    this.push({
                        id:value._id,
                        title:value.title,
                        description:value.description,
                        author:value.user.name,
                        author_id:value.user._id,
                        type:value.type,
                        url:value.url,
                        created:$filter('date')(value.created,'short')
                    });
                }, data);
                return data;
            }
        };   
    })
    .controller('MediaIndexCtrl', function ($scope,$state,medias,PreparedMedias,Paginator) {
        var preparedMedias = [];
        if(medias.length > 0){
            preparedMedias = PreparedMedias.get(medias);
        }
        $scope.paginator =  Paginator(2,5,preparedMedias);
    })
    .controller('MediaCreateCtrl', function ($scope,$timeout, $upload) {
        function setPreview(fileReader, index) {
            fileReader.onload = function(e) {
                $timeout(function() {
                    $scope.dataUrls[index] = e.target.result;
		});
            }
        }
        $scope.media = {};
        $scope.fileReaderSupported = window.FileReader != null;
	$scope.uploadRightAway = false;
	
	$scope.hasUploader = function(index) {
            return (typeof $scope.upload[index] !== 'undefined');
	};
	$scope.abort = function(index) {
            $scope.upload[index].abort(); 
            $scope.upload[index] = null;
	};
	
	$scope.onFileSelect = function($files) {
            $scope.selectedFiles = [];
            $scope.progress = [];
            if ($scope.upload && $scope.upload.length > 0) {
                for (var i = 0; i < $scope.upload.length; i++) {
                    if ($scope.upload[i] !== null) {
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
                var isImage = /\.(jpeg|jpg|gif|png)$/i.test($file.name);
                if(!isImage){
                    alert('Only images are allowed');
                    return;
                }
                if (window.FileReader && $file.type.indexOf('image') > -1) {
                    var fileReader = new FileReader();
                    fileReader.readAsDataURL($files[i]);
                    setPreview(fileReader, i);
                }
                $scope.progress[i] = -1;
                if ($scope.uploadRightAway) {
                    $scope.start(i);
                }
            }
        }
	
	$scope.start = function(index) {
            $scope.progress[index] = 0;
            $scope.upload[index] = $upload.upload({
                    url :'/admin/api/media',
                    method: 'POST',
                    headers: {'x-ng-file-upload': 'nodeblog'},
                    data :  $scope.media,
                    file: $scope.selectedFiles[index],
                    fileFormDataName: 'media'
            })
            .then(
                function(response) {
                    $scope.uploadResult.push(response.data);
                }, 
                null, 
                function(evt) {
                    $scope.progress[index] = parseInt(100.0 * evt.loaded / evt.total);
            })
            .xhr(function(xhr){
                xhr.upload.addEventListener('abort', function(){
                        console.log('aborted complete')
                    }, 
                    false
                );
            });
        }
    })
    .controller('MediaEditCtrl', function ($scope,$state,Media,media) {
        var original = media;
        $scope.media = Media.copy(original);
        $scope.isClean = function() {
            return angular.equals(original, $scope.post);
        };
      
        $scope.save = function() { 
            $scope.media.put().then(
                function(data) {
                    return $state.transitionTo('media');
                },
                function error(reason) {
                    throw new Error(reason);
                }
            );
        };
    })
    .controller('MediaDeleteCtrl', function ($scope,$state,media) {
        
        $scope.save = function() {
            return $state.transitionTo('media');
        };
        
        $scope.destroy = function() {
            media.remove().then(
                function() {
                    return $state.transitionTo('media');
                },
                function error(reason) {
                    throw new Error(reason);
                }
            );
        };
        
    });
})(window, angular);