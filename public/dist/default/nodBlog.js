/*! nodBlog - v0.0.1 - 2014-03-18
 * Copyright (c) 2014 Fabio Bedini aka whisher;
 * Licensed MIT
 */
(function(window, angular, undefined) {
'use strict';
 angular.module('nodblog',['templates.app','ui.router','restangular','nodblog.services.base','nodblog.services.socket','nodblog.site','nodblog.blog'])
    .config(function($locationProvider) {
        $locationProvider.html5Mode(true).hashPrefix('!');    
     })
    .run(function ($state,$rootScope,$log) {
        $state.transitionTo('index');
        $rootScope.$log = $log;
        $rootScope.$state = $state;
    })
    .controller('MainCtrl', function ($scope,socket) {
      var messages  = [];
      $scope.num = 0;
      socket.on('addedPost', function (data) {
           messages.push(data);
           $scope.num = messages.length;
      });
      $scope.isVisited = function(){
          return messages.length > 0;
      };
      $scope.update = function(){
          messages  = [];
      };
    });
})(window, angular);
(function(window, angular, undefined) {
'use strict';
//Dependencies ui.router restangular nodblog.services.base
angular.module('nodblog.blog',['ngSanitize','LocalStorageModule'])
    .constant('PREFIX_LOCAL_STORAGE','xiferpgolbdon')
    .config(function(PREFIX_LOCAL_STORAGE,$stateProvider,RestangularProvider,localStorageServiceProvider) {
        $stateProvider
            .state('blog', {
                url: '/blog',
                templateUrl: 'src/app/default/blog/index.tpl.html',
                resolve: {
                    posts: function(Post){
                        return Post.all();
                    }
                },
                controller: 'BlogIndexCtrl'
            })
            .state('post', {
                url: '/blog/:id/:slug',
                templateUrl: 'src/app/default/blog/details.tpl.html',
                resolve: {
                    post: function(Post,$stateParams){
                        return Post.one($stateParams.id);
                    },
                    comments: function(Post,$stateParams){
                        return Post.commentsByPostId($stateParams.id);
                    }
                },
                controller: 'BlogDetailsCtrl'
            });
            RestangularProvider.setBaseUrl('/api');
            RestangularProvider.setRestangularFields({
                id: "_id"
            });
            localStorageServiceProvider.setPrefix(PREFIX_LOCAL_STORAGE);
    })
    .factory('Post', function(Base) {
        function NgPost() {
            this.commentsByPostId = function(id){
                return this.getElements().one('comments',id).getList();
            };
        }
        return angular.extend(Base('post'), new NgPost());
    })
    .factory('Comment', function(Base) {
        function NgComment() {}
        return angular.extend(Base('comment'), new NgComment());
    })
    .controller('BlogIndexCtrl', function ($scope,posts) {
        $scope.posts = posts;
    })
    .controller('BlogInnerCtrl', function ($scope,$filter) {
        $scope.post.title =  $filter('ucfirst')($scope.post.title);
        $scope.post.published =  $filter('date')($scope.post.published,'short');
        $scope.post.body =  $filter('words')($scope.post.body,20);
    })
    .controller('BlogDetailsCtrl', function ($scope,localStorageService,post,comments,Comment) {
        $scope.post = post;
        $scope.comments = comments;
        var commentHasStorage = localStorageService.get('comment_id_'+post._id);
        $scope.commentHasStorage = commentHasStorage;
        if(commentHasStorage!==null){
            angular.forEach(comments, function(value, key){
                if(value._id===commentHasStorage){
                   localStorageService.remove('comment_id_'+post._id); 
                    $scope.commentHasStorage = null;
                }
            });
        }
        $scope.comment = {};
        $scope.comment.post_id = post._id;
        $scope.save = function(){
            Comment.store($scope.comment).then(
                function(data) {
                    localStorageService.add('comment_id_'+post._id,data._id);
                    $scope.commentHasStorage = data._id;
                }, 
                function error(err) {
                    throw new Error(err);
                }
            );
        };
        $scope.hasComments = function(){
            return !!$scope.comments.length;
        };
    })
    .directive('inputFeedback',function() {
        return {
            require: 'ngModel',
            restrict: 'A',
            link: function(scope, element, attrs,ctrl) {
                var $parentDiv = element.parent();
                var currentClass = $parentDiv.attr('class');
                element.on('blur',function() {
                    $parentDiv.removeClass();
                    $parentDiv.addClass(currentClass);
                    if(ctrl.$valid){
                        $parentDiv.addClass('has-success');
                     }
                     else{
                        $parentDiv.addClass('has-error'); 
                     }
                });
                
              
            }
        };
    })
    .filter('words', function () {
        return function (input, words) {
            if (isNaN(words)) return input;
            if (words <= 0) return '';
            if (input) {
                var inputWords = input.split(/\s+/);
                if (inputWords.length > words) {
                    input = inputWords.slice(0, words).join(' ') + '...';
                }
            }
            return input;
        };
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
            .state('about', {
                url: '/about',
                templateUrl: 'src/app/default/site/about.tpl.html',
                controller: 'AboutCtrl'
            })
            .state('contact', {
                url: '/contact',
                templateUrl: 'src/app/default/site/contact.tpl.html',
                controller: 'ContactCtrl'
            });
    })
    .controller('IndexCtrl', function ($scope) {
        
    })
    .controller('AboutCtrl', function ($scope) {
        $scope.test = 'about';
    })
    .controller('ContactCtrl', function ($scope) {
        $scope.test = 'contact';
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
angular.module('templates.app', ['src/app/default/blog/details.tpl.html', 'src/app/default/blog/index.tpl.html', 'src/app/default/site/about.tpl.html', 'src/app/default/site/contact.tpl.html', 'src/app/default/site/index.tpl.html']);

angular.module("src/app/default/blog/details.tpl.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("src/app/default/blog/details.tpl.html",
    "<article class=\"post col-xs-12 col-md-12\">\n" +
    "        <header>\n" +
    "            <img alt=\"{{post.title}}\" title=\"{{post.title}}\" class=\"img-responsive\" data-ng-src=\"/upload/{{post.avatar}}\" /> \n" +
    "            <a href=\"#\" rel=\"bookmark\" title=\"post title\"><h1>{{post.title | ucfirst}}</h1></a>\n" +
    "            <h2 data-ng-bind-html=\"post.body\"></h2>\n" +
    "        </header>\n" +
    "        <footer>\n" +
    "            <time pubdate date=\"{{post.created | date:'short'}}\">\n" +
    "               <em>{{post.created | date:'short'}}</em>\n" +
    "            </time>, \n" +
    "            <span class=\"btn btn-default btn-xs\">\n" +
    "                <span class=\"glyphicon glyphicon-comment\"></span> {{post.meta.comments.approved}}\n" +
    "            </span>\n" +
    "        </footer>\n" +
    " </article>\n" +
    "<div class=\"col-xs-6 col-md-6\">\n" +
    "    <p class=\"text-muted\" data-ng-hide=\"hasComments()\">\n" +
    "        Non ci sono commenti\n" +
    "    </p>\n" +
    "    <article class=\"comment-box\" data-ng-repeat=\"comment in comments\">\n" +
    "        <header>\n" +
    "            <h1>{{comment.author}}</h1>\n" +
    "            <p>{{comment.body}}</p>\n" +
    "        </header>\n" +
    "        <footer>\n" +
    "            <time pubdate date=\"{{comment.created | date:'short'}}\">\n" +
    "               <em>{{comment.created | date:'short'}}</em>\n" +
    "            </time>\n" +
    "        </footer>\n" +
    "        <article data-ng-if=\"comment.children.length > 0\" data-ng-repeat=\"children in comment.children\">\n" +
    "            <header>\n" +
    "                <h1>{{children.author}}</h1>\n" +
    "                <p class=\"text-info\">{{children.body}}</p>\n" +
    "            </header> \n" +
    "            <footer>\n" +
    "                <time pubdate date=\"{{children.created | date:'short'}}\">\n" +
    "                    <em>{{children.created | date:'short'}}</em>\n" +
    "                </time>\n" +
    "            </footer>\n" +
    "        </article>\n" +
    "    </article> \n" +
    "    <div id=\"frm-comment-wrapper\" data-ng-hide=\"commentHasStorage\">\n" +
    "        <h3 class=\"text-info\">Lascia un Commento</h3>\n" +
    "        <h4 class=\"text-info\">L'indirizzo email non verrà pubblicato. I campi obbligatori sono contrassegnati <span class=\"text-danger\">*</span></h4>\n" +
    "        <form name=\"form\" role=\"form\" data-ng-submit=\"save()\">\n" +
    "            <input type=\"hidden\" name=\"post_id\" data-ng-model=\"comment.post_id\" required />\n" +
    "            <div class=\"form-group\">\n" +
    "                <label for=\"email\">Email<span class=\"text-danger\">*</span></label>\n" +
    "                <input type=\"email\" class=\"form-control\" name=\"email\" id=\"email\" placeholder=\"La tua email\" data-ng-model=\"comment.email\" data-input-feedback required=\"required\" />\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <label for=\"author\">Nome<span class=\"text-danger\">*</span></label>\n" +
    "                <input type=\"text\" class=\"form-control\" name=\"author\" id=\"author\" placeholder=\"Il tuo nome\" data-ng-model=\"comment.author\" data-input-feedback required=\"required\" />\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <label for=\"web\">Sito web</label>\n" +
    "                <input type=\"text\" class=\"form-control\" name=\"web\" id=\"web\" placeholder=\"Se hai un sito web\" data-ng-model=\"comment.web\">\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <label for=\"body\">Commento<span class=\"text-danger\">*</span></label>\n" +
    "                <textarea name=\"body\" id=\"body\" rows=\"5\" class=\"form-control\" placeholder=\"Il tuo commento\" data-input-feedback data-ng-model=\"comment.body\" data-ng-minlength=\"10\" data-ng-maxlength=\"300\" required=\"required\"></textarea>\n" +
    "            </div>\n" +
    "          <button type=\"submit\" class=\"btn btn-primary\" data-ng-disabled=\"form.$invalid\">Commenta</button>\n" +
    "        </form>\n" +
    "    </div>\n" +
    "    <div class=\"text-success\" data-ng-show=\"commentHasStorage\">\n" +
    "        <p>Grazie, per aver lasciato un commento</p>\n" +
    "        <p>Il commento sarà visibile dopo moderazione</p>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("src/app/default/blog/index.tpl.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("src/app/default/blog/index.tpl.html",
    "<div class=\"row\">\n" +
    "    <article class=\"prologue col-6 col-sm-6 col-lg-4\" data-ng-repeat=\"post in posts\" data-ng-controller=\"BlogInnerCtrl\">\n" +
    "        <header>\n" +
    "            <img alt=\"{{post.title}}\" title=\"{{post.title}}\" class=\"img-responsive\" data-ng-src=\"/upload/{{post.avatar}}\" /> \n" +
    "            <h1>{{post.title}}</h1>\n" +
    "            <h2 data-ng-bind-html=\"post.body\"></h2>\n" +
    "        </header>\n" +
    "        <footer>\n" +
    "            <time pubdate date=\"{{post.published}}\">\n" +
    "               <em>{{post.published}}</em>\n" +
    "            </time> \n" +
    "            <span class=\"btn btn-default btn-xs\">\n" +
    "                <span class=\"glyphicon glyphicon-comment\"></span> {{post.meta.comments.approved}}\n" +
    "            </span>\n" +
    "            <p><a role=\"button\" data-ng-href=\"/blog/{{post._id}}/{{post.slug}}\" class=\"btn btn-default\">Leggi »</a></p>\n" +
    "        </footer>\n" +
    "    </article>\n" +
    "</div>");
}]);

angular.module("src/app/default/site/about.tpl.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("src/app/default/site/about.tpl.html",
    "<div class=\"row\">\n" +
    "<div class=\"col-6 col-sm-6 col-lg-4\">\n" +
    "<h2>About</h2>\n" +
    "<p>Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo</p>\n" +
    "<p>{{test}}</p>\n" +
    "</div>\n" +
    "</div>");
}]);

angular.module("src/app/default/site/contact.tpl.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("src/app/default/site/contact.tpl.html",
    "<div class=\"row\">\n" +
    "<div class=\"col-6 col-sm-6 col-lg-4\">\n" +
    "<h2>Contact</h2>\n" +
    "<p>Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo</p>\n" +
    "<p>{{test}}</p>\n" +
    "</div>\n" +
    "</div>");
}]);

angular.module("src/app/default/site/index.tpl.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("src/app/default/site/index.tpl.html",
    "\n" +
    "<div class=\"jumbotron\">\n" +
    "    <h2>Sviluppo e design e un pizzico di ...</h2>\n" +
    "    <h2>siti applicazioni web e compagnia</h2>\n" +
    "    <p>Sviluppa il tuo marchio e la tua presenza in rete.</p>\n" +
    "    <p>Creare una buona presenza in rete aumenta la conoscenza di te azienda tra i tuoi clienti.Fabio  con qualità, seguendo i principi del buon design, dell'usabilità e dell'accessibilità collegato Social media Facebook, Twitter, Social Networks è compito di Il web di Fabio (me)  realizzare per te un sito solido, efficace e semplice da gestire.</p>\n" +
    "    <p>Fai guadagnare al tuo marchio  credibilità e forza, socializzati :).</p>\n" +
    "    <p>Social media agency</p>\n" +
    "</div>\n" +
    "");
}]);

angular.module('templates.common', []);

