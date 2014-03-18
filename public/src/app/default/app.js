(function(window, angular, undefined) {
'use strict';
 angular.module('nodblog',['templates.app','ui.router','restangular','nodblog.services.base','nodblog.services.socket','nodblog.site','nodblog.blog'])
    .config(function($locationProvider) {
        $locationProvider.html5Mode(true).hashPrefix('!');    
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
    });
})(window, angular);