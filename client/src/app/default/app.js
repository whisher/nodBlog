'use strict';
 angular.module('nodblog',['nodblog.site','nodblog.blog'])
    .config(function($locationProvider) {
        $locationProvider.html5Mode(true).hashPrefix('!');    
     })
    .run(function ($state,$rootScope,$log) {
        $state.transitionTo('index');
        $rootScope.$log = $log;
        $rootScope.$state = $state;
    })
    .factory('socket', function ($rootScope) {
        var socket = io.connect();
        return {
          on: function (eventName, callback) {
            socket.on(eventName, function () {  
              var args = arguments;
              $rootScope.$apply(function () {
                callback.apply(socket, args);
              });
            });
          },
          emit: function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
              var args = arguments;
              $rootScope.$apply(function () {
                if (callback) {
                  callback.apply(socket, args);
                }
              });
            })
          }
        };
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
    
  


