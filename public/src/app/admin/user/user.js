(function(window, angular, undefined){
'use strict'; 
//Dependencies ui.router nodblog.api.base nodblog.ui.paginators.elastic
angular.module('nodblog.admin.user',[])
    .config(function($stateProvider,RestangularProvider) {
        $stateProvider
            .state('user', {
                url: '/user',
                templateUrl: 'src/app/admin/user/user.tpl.html',
                resolve: {
                    users: function(User){
                        return User.all();
                    }
                },
                controller:'UserIndexCtrl'
            })
            .state('user_create', {
                url: '/user/create',
                templateUrl: 'src/app/admin/user/form.tpl.html',
                resolve: {
                    users: function(User){
                        return User.all();
                    }
                },
                controller:'UserCreateCtrl'
            })
            .state('user_edit', {
                url: '/user/edit/:id',
                templateUrl:'src/app/admin/user/form.tpl.html',
                resolve: {
                    user: function(User, $stateParams){
                        return User.one($stateParams.id);
                    }
                },
                controller: 'UserEditCtrl'
            })
            .state('user_delete', {
                url: '/user/delete/:id',
                templateUrl: 'src/app/admin/user/delete.tpl.html',
                resolve: {
                    user: function(User,$stateParams){
                        return User.one($stateParams.id);
                    }
                },
                controller: 'UserDeleteCtrl'
            });
            RestangularProvider.setBaseUrl('/admin/api');
            RestangularProvider.setRestangularFields({
                id: "_id"
            });
            RestangularProvider.setRequestInterceptor(function(elem, operation, what) {
                if (operation === 'put') {
                    elem._id = undefined;
                    return elem;
                }
                return elem;
            });      
    })
    .factory('User', function(Base) {
        function NgUser() {
            this.labels = {
                frmCreateHeader:'Add New User',
                frmEditHeader:'Edit User'
            }; 
        }
        return angular.extend(Base('user'), new NgUser());
    })
    .controller('UserIndexCtrl', function ($scope,$state,users,Paginator) {
        $scope.paginator =  Paginator(2,5,users);
    })
    .controller('UserCreateCtrl', function ($scope,$state,User) {
        $scope.header =  User.labels.frmEditHeader;
        $scope.user = {};
        $scope.save = function(){
            User.store($scope.user).then(
                function(data) {
                    return $state.transitionTo('user');
                }, 
                function error(err) {
                    throw new Error(err);
                }
            );
        };
        $scope.fullName = function () {
           
            return $scope.user.name + ' ' + $scope.user.email;
        };
        $scope.$watch(function(scope) {
            
            return scope.user.name + ' ' + scope.user.email;
            }, function (newFullName) { console.log(newFullName);
            $scope.fullName = newFullName;
        });
        
    })
    .controller('UserEditCtrl', function ($scope,$state,user,User) {
        $scope.header =  User.labels.frmEditHeader;
        var original = user;
        $scope.user = User.copy(original);
        $scope.isClean = function() {
            return angular.equals(original, $scope.post);
        };
        $scope.save = function() { 
            $scope.user.put().then(
                function(data) {
                    return $state.transitionTo('user');
                },
                function error(reason) {
                    throw new Error(reason);
                }
            );
        };
    })
    .controller('UserDeleteCtrl', function ($scope,$state,user) {
        $scope.save = function() {
            return $state.transitionTo('user');
        };
        $scope.destroy = function() {
            user.remove().then(
                function() {
                    return $state.transitionTo('user');
                },
                function error(reason) {
                    throw new Error(reason);
                }
            );
        };
    });
})(window, angular);     