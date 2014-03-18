/*! nodBlog - v0.0.1 - 2014-03-18
 * Copyright (c) 2014 Fabio Bedini aka whisher;
 * Licensed MIT
 */
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
(function(window, angular, undefined) {
'use strict';
//Dependencies restangular
    angular.module('nodblog.services.base', [])
        .factory('Base', function(Restangular) {
            return function(route){
                var elements = Restangular.all(route); 
                return {
                    one : function (id) {
                        return Restangular.one(route, id).get();
                    },
                    all : function () {
                        return elements.getList();
                    },
                    store : function(data) {
                        return elements.post(data);
                    },
                    copy : function(original) {
                        return Restangular.copy(original);
                    },
                    getElements : function() {
                        return elements;
                    },
                    specialCopy : function(id) {
                        return Restangular.one(route, id);
                    }
                };
            };  
        });
})(window, angular);
(function(window, angular, undefined) {
    'use strict';
    angular.module('nodblog.services.socket', [])
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
                    });
                }
            };
        });
})(window, angular);
(function(window, angular, undefined) {
    'use strict';
    angular.module('nodblog.ui.paginators.elastic', [])
        .factory('Paginator', function() {
            return function(pageSize,navRange,data) {
                    var cache =[];
                    var hasNext = false;
                    var currentOffset= 0;
                    var numOfItemsXpage = pageSize;
                    var pageRange = navRange;
                    var numOfItems = 0;
                    var totPages = 0;
                    var currentPage = 1;
                    var end = 0;
                    var start = 0;
                    var delta = 1;
                    var load = function() {
                        cache = data;
                        numOfItems = cache.length;
                        hasNext = numOfItems > numOfItemsXpage;
                        totPages = Math.ceil(numOfItems/numOfItemsXpage);
                        if (pageRange > totPages) {
                                pageRange = totPages;
                        }
                        loadFromCache();
                    };
                    var loadFromCache= function() { 
                        paginator.items = cache.slice(currentOffset, numOfItemsXpage*currentPage);
                        delta = Math.ceil(pageRange / 2);
                        if (currentPage - delta > totPages - pageRange) {
                            start = totPages - pageRange + 1;
                            end = totPages+1;
                        }
                        else {
                            if (currentPage - delta < 0) {
                                delta = currentPage;
                            }
                            var offset = currentPage - delta;
                            start = offset + 1;
                            end = offset + pageRange +1;
                       }
                       hasNext = numOfItems > (currentPage * numOfItemsXpage);
                    };
                    var paginator = {
                        
                        items : [],
                        hasNext: function() {
                            return hasNext;
                        },
                        hasPrevious: function() {
                            return currentOffset !== 0;
                        },
                        hasFirst: function() {
                           return currentPage !== 1; 
                        },
                        hasLast: function() {
                           return totPages > 2 && currentPage!==totPages; 
                        },
                        next: function() {
                            if (this.hasNext()) {
                                currentPage++;
                                currentOffset += numOfItemsXpage;
                                loadFromCache();
                            }
                        },
                        previous: function() {
                            if(this.hasPrevious()) {
                                currentPage--;
                                currentOffset -= numOfItemsXpage;
                                loadFromCache();
                            }
                        },
                        toPageId:function(num){
                            currentPage=num;
                            currentOffset= (num-1) * numOfItemsXpage;
                            loadFromCache();
                        },
                        first:function(){
                            this.toPageId(1);
                        },
                        last:function(){
                            this.toPageId(totPages);
                        },
                        getNumOfItems : function(){
                            return numOfItems;
                        },
                        getCurrentPage: function() {
                            return currentPage;
                        },
                        getEnd: function() {
                            return end;
                        },
                        getStart: function() {
                            return start;
                        },
                        getTotPages: function() {
                            return totPages;
                        },
                        getNumOfItemsXpage:function(){
                            return numOfItemsXpage;
                        }
                    };
                    load();
                    return paginator;
                 };
        })
        .filter('pagination', function() {
            return function(input,start,end) {
                start = parseInt(start,10);
                end = parseInt(end,10);
                for (var i = start; i < end; i++) {
                    input.push(i);
                }
                return input;
            };
        });
})(window, angular);
angular.module('templates.login', []);


angular.module('templates.common', []);

