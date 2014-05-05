(function(window, angular, undefined) {
    'use strict';
    angular.module('nodblog.admin',[/*'templates.admin'*/,'ui.router','restangular','ui.bootstrap','ngCookies','angularFileUpload','nodblog.services.base','nodblog.services.socket','nodblog.ui.paginators.elastic','nodblog.admin.index','nodblog.admin.post','nodblog.admin.media','nodblog.admin.user','nodblog.admin.contact'])
    .config(function($urlRouterProvider) {
        $urlRouterProvider.otherwise('/');
    })
    .run(function ($state,$rootScope,$log,$filter,Global,WindowUtils) {
        $rootScope.$state = $state;
        $state.transitionTo('index');
        $rootScope.$log = $log;
        $rootScope.$on('$stateChangeSuccess', function(evt) {
            var stateName = $state.current.name;
            if(stateName){
                var title = stateName.split('_').join(' ');
                title = $filter('ucfirst')(title);
                WindowUtils.setTitle(title);
            }
        });
        $rootScope.currentUser = Global;
    })
    .factory('Global', function($cookieStore) {
        var user = $cookieStore.get('USER');
        var _this = this;
        _this._data = {
            user: user,
            _authenticated: !!user,
            _isAdmin: (user.role==='admin'),
            isAuthenticated: function() {
                return this._authenticated;
            },
            isAdmin: function() {
                return this._isAdmin;
            },
            isActionDisabled:function(post){
                if(this.isAdmin()){
                    return false;
                }
                return (this.user.id === post.author_id);
            }
        };
        return _this._data;
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
    .factory('Memory', function() {
        var mediaIds = [],
            post = {},
            dataUrl = '';
        return {
            setPost:function(model){
                post = model;
            },
            getPost:function(){
                return post;
            },
            addBody:function(val){
                if(typeof post.body === 'undefined'){
                    post.body = '';
                }
                post.body += val;
            },
            resetPost:function(){
                post = {};
            },
            getMediaIds:function(){
                return mediaIds;
            },
            addMediaId:function(id){
                mediaIds.push(id);
            },
            resetMediaIds:function(){
                mediaIds.length = 0;
            },
            getDataUrl:function(){
                return dataUrl;
            },
            setDataUrl:function(src){
                dataUrl = src;
            },
            resetDataUrl:function(){
                dataUrl = '';
            },
            resetAll:function(){
                this.resetPost();
                this.resetMediaIds();
                this.resetDataUrl();
            }
        };
    })
    .controller('MainCtrl', function ($scope,$location,Socket) {
            
        /* Nav add tab */
        $scope.items = [
            {
                route:'post_create',
                title:'Post'
            },
            {
                route:'media_create',
                title:'Media'
            },
            {
                route:'page_create',
                title:'Page'
            }
        ];
        if($scope.currentUser.isAdmin()){
            $scope.items.push({
                route:'user_create',
                title:'User'
            });
        }
        /* Signals socket.io */
        $scope.signals = [];
        $scope.num = 0;
        Socket.on('addedContact', function (data) {
             $scope.signals.push(data);
             $scope.num = $scope.signals.length;
             console.log(data);
        });
        Socket.on('addedComment', function (data) {
             $scope.signals.push(data);
             $scope.num = $scope.signals.length;
             console.log(data);
        });
        $scope.isVisited = function(){
            return $scope.signals.length > 0;
        };
        $scope.update = function(){
            $scope.signals  = [];
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
    .directive('uniqueEmail',function (User) {
        return {
            require:'ngModel',
            restrict:'A',
            priority:0,
            controller:function ($scope) {
                var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
                $scope.isEmail = function(value){
                    return emailRegex.test(value);
                };
            },
            link:function (scope, element, attrs, ngModelCtrl) {
                var original;
                // If the model changes, store this since we assume it is the current value of the user's email
                // and we don't want to check the server if the user re-enters their original email
                ngModelCtrl.$formatters.unshift(function(modelValue) {
                    original = modelValue;
                    return modelValue;
                });
                // using push() here to run it as the last parser, after we are sure that other validators were run
                ngModelCtrl.$parsers.push(function (viewValue) {
                    if (viewValue && viewValue !== original ) {
                        if(scope.isEmail(viewValue)){
                            User.isUniqueEmail(viewValue).then(function(data){
                                ngModelCtrl.$setValidity('uniqueEmail', !data.email);
                            });
                        }
                        return viewValue;
                    }
                });
                
            }
        };
    })
    .directive('nbUploader',function() {
        return {
            restrict: 'A',
            link: function(scope, elem, attrs, ctrl) {
                elem.find('#fileholder').click(function() {
                    elem.find('#file').click();
                });
            }
        };
    })
    .directive('validateEquals', function() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, element, attrs, ngModelCtrl) {
                function validateEqual(myValue) {
                    var valid = (myValue === scope.$eval(attrs.validateEquals));
                    ngModelCtrl.$setValidity('equal', valid);
                    return valid ? myValue : undefined;
                }
                ngModelCtrl.$parsers.push(validateEqual);
                ngModelCtrl.$formatters.push(validateEqual);
                scope.$watch(attrs.validateEquals, function() {
                    ngModelCtrl.$setViewValue(ngModelCtrl.$viewValue);
                });
            }
        };
    })
    .directive('wordcount',function($timeout){
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var $counter = $(attrs.wordcount);
                $counter.text(0);
                function stripTags() {
                    var content = element.val().trim();
                    return content.replace(/(<([^>]+)>)/ig,'');
                }
                function countWord(){
                    var count = stripTags().split(/\s+/).length;
                    $counter.text(count);
                }
                element.bind('keyup', function(e){
                    if (e.keyCode === 32 || e.keyCode === 13 || e.keyCode === 8) { // if space or enter pressed
                        countWord();
                    }
                });
                element.bind('paste', function(e){
                    $timeout(function () {
                        countWord();
                    }, 100);
                });
            }
        };
    })
    .filter('arraytostrcs', function() {
        return function(input) {
            return input.join(',');
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
    .filter('ucfirst', function () {
        return function (input) {
            if (input) {
                return input.charAt(0).toUpperCase() + input.slice(1);
            }
            return input;
        };
    })
    .filter('nbWords', function () {
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
    .filter('nbCharacters', function () {
        return function (input, chars, breakOnWord) {
            if (isNaN(chars)) return input;
            if (chars <= 0) return '';
            if (input && input.length >= chars) {
                input = input.substring(0, chars);
                if (!breakOnWord) {
                    var lastspace = input.lastIndexOf(' ');
                    //get last space
                    if (lastspace !== -1) {
                        input = input.substr(0, lastspace);
                    }
                }else{
                    while(input.charAt(input.length-1) == ' '){
                        input = input.substr(0, input.length -1);
                    }
                }
                return input + '...';
            }
            return input;
        };
    });
})(window, angular);