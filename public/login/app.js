(function(window, angular, undefined) {
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
            authenticate:function(data,callBackOnError){
                this.send(data).then(
                    function(response){
                        if( (typeof response.data !== 'undefined') && (response.data === data.email)){
                            $window.location.href = 'http://localhost:3000/admin';
                        }
                    },
                    callBackOnError
                );
            }
        };
    })
    .controller('MainCtrl', function ($scope) {
        $scope.user = {};
    })
    .directive('auth',function($window,Auth) {
        return {
            restrict: 'A',
            controller: function($scope,$element) {
                $scope.getAuth = function(){
                    Auth.authenticate(
                        $scope.user,
                        function(reject){
                            $('#invalid-login').remove();
                            $element.prepend('<p id="invalid-login" class="text-danger text-center">Invalid login</p>');
                        }
                    );
                };
            }
        };
    });
})(window, angular);