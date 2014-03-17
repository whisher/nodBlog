(function(window, angular, undefined) {
   'use strict';
    angular.module('nodblog.admin',['ui.router','restangular','nodblog.services.base','nodblog.services.socket','nodblog.ui.paginators.elastic','nodblog.admin.index','nodblog.admin.post','nodblog.admin.media','nodblog.admin.user'])
        .value('currentUser',nB.user)
        .run(function ($state,$rootScope,$log,$filter,WindowUtils,$templateCache) {
            $rootScope.$state = $state;
            $state.transitionTo('index');
            $rootScope.$log = $log;
            $rootScope.$on('$locationChangeSuccess', function(evt) {
                   var stateName = $state.current.name;
                   if(stateName){
                       var title = stateName.split('_').join(' ');
                       title = $filter('ucfirst')(title);
                       WindowUtils.setTitle(title);
                   }
            });
        })
        .factory('WindowUtils', function($window) {
            return {
               setTitle:function(title){
                  var sep = ' - ';
                  var current = $window.document.title.split(sep)[0];
                  $window.document.title = current + sep + title;
               }
            };
        })
        .controller('MainCtrl', function ($scope,$location) {
            /* Nav add tab */
            $scope.items = [
                {route:'post_create',title:'Post'},
                {route:'media_create',title:'Media'},
                {route:'page_create',title:'Page'}
            ];
        })
        .filter('ucfirst', function () {
            return function (input) {
                if (input) {
                   return input.charAt(0).toUpperCase() + input.slice(1);
                }
                return input;
            };
        });
})(window, angular);     
angular.module("src/app/admin/index/index.tpl.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("src/app/admin/index/index.tpl.html",
    "<div class=\"col-6 col-sm-6 col-lg-4\">\n" +
    "    <h2>Index admin </h2>\n" +
    "    <p>Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo</p>\n" +
    "    <h3>{{test}}</h3>\n" +
    "</div>\n" +
    "");
}]);