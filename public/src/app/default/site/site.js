(function(window, angular, undefined) {
'use strict';
angular.module('nodblog.site',[])
    .config(function($stateProvider) {
        $stateProvider
            .state('index', {
                url: '/',
                templateUrl: 'src/app/default/site/index.tpl.html',
                controller: 'IndexCtrl'
            })
    })
    .factory('Contact', function(Base) {
        function NgContact() {}
        return angular.extend(Base('contact'), new NgContact());
    })
    .controller('IndexCtrl', function ($scope,$state) {
        
    })
    .controller('AboutCtrl', function ($scope) {
        $scope.test = 'about';
    })
    .controller('ModalContactCtrl', function ($scope, $modalInstance,contact) {
         console.log($modalInstance); console.log(contact);
        $scope.contact = contact;
        $scope.ok = function () {
            $scope.contact = {};
            $modalInstance.close();
        };

        
    })
    .controller('ContactCtrl', function ($scope,$modal,Contact) {
        $scope.contact = {};
        $scope.save = function(){
            Contact.store($scope.contact).then(
                function(data) {
                    var modalInstance = $modal.open({
                        templateUrl: 'contactModalOnSubmit.html',
                        controller: 'ModalContactCtrl',
                        resolve: {
                            contact: function () {
                                return $scope.contact;
                            }
                        }
                    });
                }, 
                function error(err) {
                    throw new Error(err);
                }
            );
        };
    });
 })(window, angular);        
    
    
    