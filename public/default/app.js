(function(window, angular, undefined) {
    'use strict';
    angular.module('nodblog',[/*'templates.app'*/,'ui.router','ngAnimate','restangular','LocalStorageModule','ui.bootstrap','seo','nodblog.services.base','nodblog.services.socket','nodblog.site','nodblog.blog'])
    .constant('BODY_PADDING_TOP',70)
    .constant('PREFIX_LOCAL_STORAGE','xiferpgolbdon')
    .config(function(PREFIX_LOCAL_STORAGE,$locationProvider,$urlRouterProvider,localStorageServiceProvider,$uiViewScrollProvider) {
        $urlRouterProvider.otherwise('/');
        $locationProvider.html5Mode(true);
        localStorageServiceProvider.setPrefix(PREFIX_LOCAL_STORAGE);
        $uiViewScrollProvider.useAnchorScroll();
    })
    .run(function ($state,$rootScope,$log,$filter,WindowUtils) {
        $state.transitionTo('index');
        $rootScope.$log = $log;
        $rootScope.$state = $state;
        $rootScope.$on('$stateChangeSuccess', function(evt) {
            var stateName = $state.current.name;
            if(stateName){
                var title = stateName.split('_').join(' ');
                if(title!=='index'){
                    title = $filter('ucfirst')(title);
                    WindowUtils.setTitle(title);
                }
            }
        });
        $rootScope.$on('$viewContentLoaded', function(evt) {
            //console.log(evt);
            $rootScope.htmlReady();
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
    /* $scope.signals.push({_id:'534f9ccb520daa8c167b3431',slug:'setting-up-email-for-my-domain','label':'added_post',title:'Ah cje bel'});
        $scope.signals.push({_id:'534f9ccb520daa8c167b3431',slug:'setting-up-email-for-my-domain','label':'approved_comment',title:'Ah cje bel'});
        $scope.signals.push({_id:'534f9ccb520daa8c167b3431',slug:'setting-up-email-for-my-domain','label':'replied_comment',title:'Ah cje bel'});*/
    })
    .controller('viewCtrl', function ($scope,$rootScope) {
        $scope.$on('$stateChangeSuccess', function (event, toState) {
            if (toState.name !== 'index') {
                $rootScope.$broadcast('resetActiveClass', 1);
                $scope.animation = true;
            } else {
                $scope.animation = false;
            }
        });
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
                //var navFooter = $('#footer').height();
                var currentElHeigh = element.height();
                var totHeight = navHeight + currentElHeigh;
                if(windowHeight > totHeight){
                    //var paddding = Math.floor((windowHeight - totHeight + BODY_PADDING_TOP)/2);
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
    });
})(window, angular);
 
 