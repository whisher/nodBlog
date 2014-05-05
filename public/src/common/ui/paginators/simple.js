(function(window, angular, undefined) {
    'use strict';
    angular.module('nodblog.ui.paginators.simple',[])
        .factory('Paginator', function() {
            return function(pageSize,data) {
                    var cache =[];
                    var staticCache =[];
                    var hasNext = false;
                    var currentOffset= 0;
                    var numOfItemsXpage = pageSize;
                    var numOfItems = 0;
                    var totPages = 0;
                    var currentPage = 1;
                   
                    var load = function() {
                        staticCache = data;
                        cache = data;
                        loadFromCache();
                    };
                    var loadFromCache= function() {
                        numOfItems = cache.length;
                        totPages = Math.ceil(numOfItems/numOfItemsXpage);
                        paginator.items = cache.slice(currentOffset, numOfItemsXpage*currentPage);
                    };
                    var paginator = {
                        items : [],
                        hasOlder: function() {
                            return numOfItems > (currentPage * numOfItemsXpage);
                        },
                        hasNewer: function() {
                            return (numOfItems > numOfItemsXpage) && (currentPage!==1);
                        },
                        older: function() {
                            if (this.hasOlder()) {
                                currentPage++;
                                currentOffset += numOfItemsXpage;
                                loadFromCache();
                            }
                        },
                        newer: function() {
                            if(this.hasNewer()) {
                                currentPage--;
                                currentOffset -= numOfItemsXpage;
                                loadFromCache();
                            }
                        },
                        getNumOfItems : function(){
                            return numOfItems;
                        },
                        getCurrentPage: function() {
                            return currentPage;
                        },
                        getTotPages: function() {
                            return totPages;
                        },
                        getNumOfItemsXpage:function(){
                            return numOfItemsXpage;
                        },
                        filter:function(callback){
                            if(typeof callback === 'undefined'){
                                if(this.isClean()){
                                    return;
                                }
                                cache = staticCache;
                            }
                            else{
                                cache = staticCache;
                                cache = _.filter(cache, callback);
                            }
                            currentPage = 1;
                            currentOffset= 0;
                            loadFromCache();
                        },
                        isClean:function(){
                            return angular.equals(staticCache, cache);
                        }
                    };
                    load();
                    return paginator;
                 }
            });
        
})(window, angular);