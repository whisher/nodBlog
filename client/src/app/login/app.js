'use strict';
 angular.module('nodblog.login',[])
     .factory('Auth', function($http,$q,$window) {
        return {
            send : function(data){
                var deferred = $q.defer();
                $http.post('/user/auth',data)
                    .success(function (response) {
                        deferred.resolve(response);
                    })
                    .error(function(data, status, headers, config) {
                        deferred.reject([]);
                    });
                return deferred.promise; 
            },
            authenticate:function(data){
               this.send(data).then(function(response){
                   if( (typeof response.data !== 'undefined') && (response.data === data.email)){
                       $window.location.href = 'http://localhost:3000/admin';
                   }
               },function(reject){
                 
               }
               ); 
            }
        }
    })
    .controller('MainCtrl', function ($scope,Auth) {
        $scope.user = {};
        $scope.getAuth = function(){
          Auth.authenticate($scope.user);  
        };
    });