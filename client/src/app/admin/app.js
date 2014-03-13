//'use strict';     
angular.module('nodblog.admin',['ui.router','nodblog.api.base','nodblog.ui.paginators.elastic','nodblog.admin.index','nodblog.admin.post','nodblog.admin.media','nodblog.admin.user'])
    .run(function ($state,$rootScope,$log,$filter,WindowUtils) {
        $rootScope.$state = $state;
        $state.transitionTo('index');
        $rootScope.$log = $log;
        $rootScope.$on('$locationChangeSuccess', function(evt) {
               var stateName = $state.current.name;
               if(stateName){
                   var title = stateName.split('_').join(' ');
                   title = $filter('ucfirst')(title);
                   WindowUtils.setTitle(title);
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
        }
    })
    .controller('MainCtrl', function ($scope,$location) {
        /* Nav add tab */
        $scope.items = [
            {route:'post_create',title:'Post'},
            {route:'media_create',title:'Media'},
            {route:'page_create',title:'Page'},
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
    