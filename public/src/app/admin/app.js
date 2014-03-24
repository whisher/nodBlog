(function(window, angular, undefined) {
    'use strict';
    angular.module('nodblog.admin',[/*'templates.admin'*/,'ui.router','restangular','ngCookies','nodblog.services.base','nodblog.services.socket','nodblog.ui.paginators.elastic','nodblog.admin.index','nodblog.admin.post','nodblog.admin.media','nodblog.admin.user'])
    .config(function($urlRouterProvider) {
        $urlRouterProvider.otherwise('index');
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
