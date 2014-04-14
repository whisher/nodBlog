(function(window, angular, undefined) {
'use strict';
 angular.module('nodblog',[/*'templates.app'*/,'ui.router','ngAnimate','restangular','LocalStorageModule','ui.bootstrap','nodblog.services.base','nodblog.services.socket','nodblog.site','nodblog.blog'])
    .constant('BODY_PADDING_TOP',70)
    .constant('PREFIX_LOCAL_STORAGE','xiferpgolbdon')
    .config(function(PREFIX_LOCAL_STORAGE,$locationProvider,$urlRouterProvider,localStorageServiceProvider) {
        $urlRouterProvider.otherwise('/');
        $locationProvider.html5Mode(true).hashPrefix('!'); 
        localStorageServiceProvider.setPrefix(PREFIX_LOCAL_STORAGE);
    })
    .run(function ($state,$rootScope,$log) {
        $state.transitionTo('index');
        $rootScope.$log = $log;
        $rootScope.$state = $state;
        
    })
    .controller('MainCtrl', function ($scope,socket) {
        var messages  = [];
        $scope.num = 0;
        socket.on('addedPost', function (data) {
             messages.push(data);
             $scope.num = messages.length;
        });
        $scope.isVisited = function(){
            return messages.length > 0;
        };
        $scope.update = function(){
            messages  = [];
        };
        
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
                var li = element.parent(),ul = li.parent(), 
                        offSetTop = 0;
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
                var navFooter = $('#footer').height();
                var currentElHeigh = element.height();
                var totHeight = navHeight + currentElHeigh;
                if(windowHeight > totHeight){
                    var paddding = Math.floor((windowHeight - totHeight + BODY_PADDING_TOP)/2);
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
    });
 })(window, angular);