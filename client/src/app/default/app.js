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
    .controller('MainCtrl', function ($scope) {
        
    });


