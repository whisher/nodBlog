(function(window, angular, undefined) {
    'use strict';
    //Dependencies ui.router nodblog.services.base nodblog.ui.paginators.elastic
    angular.module('nodblog.admin.contact',[])
    .config(function($stateProvider) {
        $stateProvider
        .state('contact', {
            url: '/contact',
            templateUrl: '/public/admin/contact/contact.tpl.html',
            resolve: {
                contacts: function(Contact){
                    return Contact.all();
                }
            },
            controller: 'ContactIndexCtrl'
        })
        .state('contact_view', {
            url: '/contact/view/:id',
            templateUrl:'/public/admin/contact/view.tpl.html',
            resolve: {
                contact: function(Contact, $stateParams){
                    return Contact.one($stateParams.id);
                }
            },
            controller: 'ContactViewCtrl'
        });
    })
    .factory('Contact', function(Base) {
        function NgContact() {}
        return angular.extend(Base('contact'), new NgContact());
    })
    .factory('PreparedContacts',function($filter){
        return {
            get:function(posts){
                var data = [];
                angular.forEach(posts, function(value, key){
                    this.push({
                        id:value._id,
                        username:value.username,
                        email:value.email,
                        msg:$filter('nbCharacters')(value.msg,50),
                        ip:value.msg,
                        referer:value.referer,
                        created:$filter('date')(value.created,'short')
                    });
                }, data);
                return data;
            }
        };
    })
    .controller('ContactIndexCtrl', function ($scope,contacts,PreparedContacts,Paginator) {
        var preparedContacts = [];
        if(contacts.length > 0){
            preparedContacts = PreparedContacts.get(contacts);
        }
        $scope.paginator =  Paginator(2,5,preparedContacts);
        $scope.hasItems = ($scope.paginator.items.length > 0);
    })
    .controller('ContactViewCtrl', function ($scope,contact) {
        $scope.contact = contact;
    });
})(window, angular);