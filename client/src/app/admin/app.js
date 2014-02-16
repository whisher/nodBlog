//'use strict';     
angular.module('nodblog.admin',['nodblog.admin.posts'])
    .config(function($stateProvider) {
        $stateProvider
            .state('index', {
                url: '/',
                templateUrl: '/src/app/admin/index.tpl.html',
                controller: 'IndexCtrl'
            })
            
    })
    .run(function ($state,$rootScope, $log) {
        $rootScope.$state = $state;
        $state.transitionTo('index');
        $rootScope.$log = $log;
    })
    .controller('MainCtrl', function ($scope,$location) {
        /* Nav add tab */
        $scope.items = [
            {route:'post_create',title:'Post'},
            {route:'media_create',title:'Media'},
            {route:'page_create',title:'Page'},
        ];
        
       
        
        
        
        
    })
    
    
    .controller('IndexCtrl', function ($scope) {
      
       
    });
    