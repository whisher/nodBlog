(function(window, angular, undefined) {
    'use strict';
    angular.module('nodblog',['templates.app', 'ui.router', 'ngAnimate', 'restangular', 'LocalStorageModule', 'ui.bootstrap', 'hljs', 'nodblog.services.base', 'nodblog.services.socket', 'nodblog.site', 'nodblog.blog'])
    .constant('BODY_PADDING_TOP',70)
    .constant('PREFIX_LOCAL_STORAGE','xiferpgolbdon')
    .config(function(PREFIX_LOCAL_STORAGE,$urlRouterProvider,localStorageServiceProvider) {
        $urlRouterProvider.otherwise('blog');
        localStorageServiceProvider.setPrefix(PREFIX_LOCAL_STORAGE);
    })
    .config(function($locationProvider) {
        $locationProvider.html5Mode(true);
    })
    .run(function ($state,$rootScope,$log,$filter,WindowUtils) {
        //$state.transitionTo('index');
        $rootScope.$log = $log;
        $rootScope.$state = $state;
        $rootScope.isDetailsSection = false;
        /* Seo */
        var _getTopScope = function() {
            return $rootScope;
        };
        $rootScope.ready = function() {
            var $scope = _getTopScope();
            $scope.status = 'ready';
            if(!$scope.$$phase){
                $scope.$apply();
            }
        };
        $rootScope.loading = function() {
            var $scope = _getTopScope();
            $scope.status = 'loading';
            if(!$scope.$$phase){
                $scope.$apply();
            }
        };
        $rootScope.$on('$stateChangeStart', function(event, toState) {
            _getTopScope().loading();
            
        });
        
        $rootScope.$on('$stateChangeSuccess', function(event, toState) {
            var stateName = toState.name;
            if(stateName!=='index'){
                var title = stateName.split('_').join(' ');
                title = $filter('ucfirst')(title);
                WindowUtils.setTitle(title);
                $rootScope.$broadcast('resetActiveClass', 1);
                $rootScope.animation = true;
            }
            else {
                $rootScope.animation = false;
            }
        });
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
    .controller('MainCtrl', function ($scope,localStorageService,Socket) {
        /* Signals socket.io */
        $scope.signals = [];
        $scope.num = 0;
        
        Socket.on('addedPost',function (data) {
            $scope.signals.push(data);
            $scope.num = $scope.signals.length;
        });
        Socket.on('approvedComment',function (data) {
            if(localStorageService.get('comment_id_'+data.post_id)){
                localStorageService.remove('comment_id_'+data.post_id);
                localStorageService.add('comment_id_reply_'+data.post_id,data.id);
                $scope.signals.push(data);
                $scope.num = $scope.signals.length;
            }
        });
        Socket.on('repliedComment',function (data) {
            if(localStorageService.get('comment_id_reply_'+data.post_id)){
                $scope.signals.push(data);
                $scope.num = $scope.signals.length;
            }
        });
        $scope.mapLabels = {
            added_post:'Nuovo articolo',
            approved_comment:'Commento approvato',
            replied_comment:'Replica commento'
        };
        $scope.mapRoutes = {
            added_post:'blog_details({id:signal.id,slug:signal.slug})',
            approved_comment:'blog_details({id:signal.post_id,slug:signal.post_slug,scrollTo:signal.id})',
            replied_comment:'blog_details({id:signal.post_id,slug:signal.post_slug,scrollTo:signal.id})'
        };
    })
    .directive('nbScroll', function ($timeout,BODY_PADDING_TOP) {
        return {
            link:function(scope,element,attrs){
                var li = element.parent(),ul = li.parent(),offSetTop = 0;
                scope.$on('resetActiveClass',function(e){
                    ul.find('li').removeClass('active');
                });
                element.click(function(e){
                    e.preventDefault();
                    var hasRoute = !!$(e.target).attr('data-ui-sref');
                    var elId = attrs.nbScroll;
                    $timeout(function(){
                        if(hasRoute){
                            ul.find('li').removeClass('active');
                            li.addClass('active');
                        }
                        var currentEl = $('#'+elId);
                        offSetTop = Math.floor(currentEl.offset().top- BODY_PADDING_TOP);
                        $('html,body').animate({
                            scrollTop: offSetTop
                        },
                        'slow'
                        );
                    });
                });
            }
        };
    })
    .directive('nbPanel', function (BODY_PADDING_TOP) {
        return {
            compile:function(element){
                var windowHeight = $(window).height();
                var navHeight = $('#nav').height();
                var currentElHeigh = element.height();
                var totHeight = navHeight + currentElHeigh - BODY_PADDING_TOP;
                if(windowHeight > totHeight){
                   element.height(windowHeight-navHeight);
                }
            }
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
    .directive('nbSignals',function($location,$stateParams,$anchorScroll) {
        return {
            restrict: 'A',
            scope:{
                signals:'=',
                mapLabels:'=labels',
                mapRoutes:'=routes'
            },
            template:   '<a data-toggle="dropdown" href="#">'+
            '<i class="glyphicon glyphicon-inbox"></i><span class="badge" data-ng-bind="signals.length"></span>'+
            '<b class="caret"></b>'+
            '</a>'+
            '<ul class="dropdown-menu">'+
            '<li data-ng-repeat="signal in signals">'+
            '<a data-ui-sref="{{mapRoutes[signal.label]}}" data-ng-click="markAsRead($index)" title="{{signal.label}}">{{mapLabels[signal.label]}}</a>'+
            '</li>'+
            '</ul>',
            controller:function($scope,$element){
                $scope.$on('$stateChangeSuccess', function (event, toState) {
                    if($stateParams.scrollTo){
                        $location.hash($stateParams.scrollTo);
                        $anchorScroll();
                    }
                });
                $scope.markAsRead = function(index){
                    $scope.signals.splice(index, 1);
                };
                $scope.$watch('signals',function(signal){
                    $element.css('visibility', function(i, visibility) {
                        return ($scope.signals.length > 0) ? 'visible' : 'hidden';
                    });
                },true);
                
            }
        };
    })
    .directive('compile',function ($compile) {
        return function(scope, element, attrs) {
            var ensureCompileRunsOnce = scope.$watch(
                function(scope) {
                    // watch the 'compile' expression for changes
                    return scope.$eval(attrs.compile);
                },
                function(value) {
                    // when the 'compile' expression changes
                    // assign it into the current DOM
                    element.html(value);

                    // compile the new DOM and link it to the current
                    // scope.
                    // NOTE: we only compile .childNodes so that
                    // we don't get into infinite loop compiling ourselves
                    $compile(element.contents())(scope);

                    // Use un-watch feature to ensure compilation happens only once.
                    ensureCompileRunsOnce();
                }
                );
        };
    })
    .directive('nbNotFound',function($state,Post) {
        return {
            restrict: 'A',
            controller: function($scope,$element,$attrs) {
                var chunks = $attrs.nbNotFound.substring(1).replace(/\/$/, '').split('/');
                var len = chunks.length;
                if(len===1){
                    if(chunks[0]==='blog'){
                        $state.transitionTo('blog');
                    }
                    else{
                        $state.transitionTo('index');
                    }
                }
                else{
                    if((chunks[0]==='blog') && /^[0-9a-fA-F]{24}$/.test(chunks[1])){
                        Post.one(chunks[1]).then(
                            function(data){
                                $state.transitionTo('blog_details',{id:data._id,slug:data.slug});
                            },
                            function(){
                                $state.transitionTo('index');
                            }
                        );
                    }
                    else{
                        $state.transitionTo('index');
                    }
                }
            }
        };
    });
})(window, angular);
 
 