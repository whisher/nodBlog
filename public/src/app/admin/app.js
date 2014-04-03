(function(window, angular, undefined) {
    'use strict';
    angular.module('nodblog.admin',[/*'templates.admin'*/,'ui.router','restangular','ngCookies','angularFileUpload','nodblog.services.base','nodblog.services.socket','nodblog.ui.paginators.elastic','nodblog.admin.index','nodblog.admin.post','nodblog.admin.media','nodblog.admin.user'])
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
                return (this.user.id === post.author_id)
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
        var ids = [];
        var post = {};
        post.body = '';
        return {
           setPost:function(model){
              post = model;
           },
           getPost:function(){
              return post;
           },
           addToBody:function(val){
              post.body += val; 
           },
           addId:function(id){
               ids.push(id);
           },
           getIds:function(){
              return ids;
           },
           resetIds:function(){
              ids.length = 0;
           }
       }
    })
    .controller('MainCtrl', function ($scope,$location) {
            
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
            })
        }
    })
    .directive('nbPicMedia',function($state,Memory) {
        return {
            restrict: 'A',
            link: function(scope,element,attrs) {
                var $textarea = $(attrs.nbPicMedia);
                element.click(function(e){
                   e.preventDefault();
                   Memory.setPost(scope.post);
                   return $state.transitionTo('media'); 
                })
            }
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
                        Memory.addToBody(img);
                        Memory.addId(scope.media.id);
                        return $state.transitionTo('post_create'); 
                    }
                })
            }
        };
    })
    .directive('nbMemoryPost',function(Post,Memory) {
        return {
            restrict: 'A',
            controller: function($scope) {
                $scope.post = Memory.getPost(); 
                $scope.post.status = Post.status[0];
                $scope.post.published = new Date();
                $scope.post.meta  = {};
                Memory.setPost($scope.post);
            },
            link: function(scope) {
               scope.$watch('post',function(newValue,o){
                   Memory.setPost(newValue);
               },true);
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
                }
            },
            link:function (scope, element, attrs, ngModelCtrl) {
                var original;
                // If the model changes, store this since we assume it is the current value of the user's email
                // and we don't want to check the server if the user re-enters their original email
                ngModelCtrl.$formatters.unshift(function(modelValue) {
                    original = modelValue;
                    return modelValue;
                })
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
                    return content.replace(/(<([^>]+)>)/ig,"");
                }
                function countWord(){
                    var count = stripTags().split(/\s+/).length;
                    $counter.text(count);
                }
                element.bind('keyup', function(e){
                    if (e.keyCode == 32 || e.keyCode == 13 || e.keyCode == 8) { // if space or enter pressed
                        countWord();
                    }
                });
                element.bind('paste', function(e){
                    $timeout(function () {
                        countWord();
                    }, 100);
                });
            }
        }
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
    });
})(window, angular);     
