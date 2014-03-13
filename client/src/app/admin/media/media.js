'use strict'; 
//Dependencies nodblog.ui.paginators.elastic
angular.module('nodblog.admin.media',['ui.router'])
    .config(function($stateProvider,RestangularProvider) {
        $stateProvider
            .state('media', {
                url: '/media',
                templateUrl: '/src/app/admin/media/index.tpl.html',
                resolve: {
                    medias: function(Media){
                        return Media.all();
                    }
                },
                controller:'MediaIndexCtrl'
            })
            RestangularProvider.setBaseUrl('/admin/api');
            RestangularProvider.setRequestInterceptor(function(elem, operation, what) {
                if (operation === 'put') {
                    elem._id = undefined;
                    return elem;
                }
                return elem;
            });      
    })
    .controller('UserIndexCtrl', function ($scope,$state,medias,Paginator) {
        $scope.paginator =  Paginator(2,5,medias);
    });
    