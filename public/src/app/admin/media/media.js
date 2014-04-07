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
                templateUrl: 'src/app/admin/media/create.tpl.html',
                controller: 'MediaCreateCtrl'
            })
            .state('media_edit', {
                url: '/media/edit/:id',
                templateUrl:'src/app/admin/media/edit.tpl.html',
                resolve: {
                    media: function(Media, $stateParams){
                        return Media.one($stateParams.id);
                    }
                },
                controller: 'MediaEditCtrl'
            })
            .state('media_view', {
                url: '/media/view/:id',
                templateUrl:'src/app/admin/media/view.tpl.html',
                resolve: {
                    media: function(Media, $stateParams){
                        return Media.one($stateParams.id);
                    }
                },
                controller: 'MediaViewCtrl'
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
        function NgMedia() {
            this.crop = function(id,data){
               this.specialCopy(id).post('crop',data);
            };
            this.resize = function(id,data){
               this.specialCopy(id).post('resize',data);
            };
        }
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
                        url:value.url,
                        description:value.description,
                        author:value.user.name,
                        author_id:value.user._id,
                        type:value.type,
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
        $scope.hasItems = ($scope.paginator.items.length > 0);
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
    .controller('MediaEditCtrl', function ($scope,$state,media,Media) {
        $scope.crop = {};
        $scope.resize = {};
        var original = media;
        $scope.media = Media.copy(original);
        $scope.isClean = function() {
            return angular.equals(original, $scope.media);
        };
        $scope.edited = function() { 
            $scope.media.put().then(
                function(data) {
                    return $state.transitionTo('media');
                },
                function error(reason) {
                    throw new Error(reason);
                }
            );
        };
        $scope.cropped = function() { 
           Media.crop(media._id,$scope.crop);
           $state.transitionTo('media');
        };
        $scope.resized = function() { 
            Media.resize(media._id,$scope.resize);
            $state.transitionTo('media');
        };
    })
    .controller('MediaViewCtrl', function ($scope,$state,media) {
        $scope.media = media;
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
        
    })
    .directive('nbAddMemory',function($state,Memory) {
        return {
            restrict: 'A',
            scope:{
              media:'='  
            },
            link: function(scope,element) {
                element.click(function(e){
                    var $this = $(this);
                    if($this.is(':checked')){
                        var img = ' <img alt="'+scope.media.title+'" title="'+scope.media.title+'" src="/upload/'+scope.media.url+'" />';
                        Memory.addBody(img);
                        Memory.addMediaId(scope.media.id);
                        return $state.transitionTo('post_create'); 
                    }
                })
            }
        };
    })
    .directive('nbTabs',function() {
        return {
            restrict: 'A',
            link: function(scope,element) {
                var tabs = element.find('button');
                tabs.click(function (e) {
                    e.preventDefault();
                    var $this = $(this);
                    $this.tab('show');
                });
            }
        };
    })
    .directive('nbJcrop',function($interpolate) {
        return {
            restrict: 'A',
            link: function(scope,element) {
                function showCoords(c)
                {   
                    scope.crop.x = c.x;
                    scope.crop.y = c.y;
                    scope.crop.w = c.w;
                    scope.crop.h = c.h;
                    scope.$apply();
                };
                var url = $interpolate($(element).attr('data-ng-src'))(scope);
                var $element = $(element).parent();
                var img = new Image();
                img.onload = function () {
                    scope.crop.cw = $element.width();
                    scope.crop.ch = $element.height();
                    $(element).Jcrop({
                        onChange: showCoords,
                        onSelect: showCoords
                    });
                };
                img.src = url;
           }
        };
    })
    .directive('nbUiResize',function($interpolate) {
        return {
            restrict: 'A',
            link: function(scope,element) {
                var $parentContainer = $('#media-edit'),
                    $element = $(element),
                    $resizable = $element.find('#media-wrapper'),
                    $image = $element.find('#media-resize-img');
                
                var url = $interpolate($image.attr('data-ng-src'))(scope);
                var img = new Image();
                img.onload = function () {
                    var imgW = img.width,
                    imgH = img.height,
                    pcW = $parentContainer.width(),
                    pcH = $parentContainer.height(),
                    reW = (pcW > imgW)?imgW:pcW,
                    reH = (pcH > imgW)?imgH:pcH;
                    $resizable.width(reW); 
                    $resizable.height(reH);
                    $resizable.resizable({
                        alsoResize: "#media-resize-img",
                        resize: function( event, ui ) {
                            scope.resize.w = ui.size.width;
                            scope.resize.h =ui.size.height;
                            scope.$apply();
                        }
                       
                    }); 
                };
                img.src = url;
            }
        };
    });
})(window, angular);

