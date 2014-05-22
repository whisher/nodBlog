angular.module('templates.app', ['public/default/blog/blog.tpl.html', 'public/default/blog/details.tpl.html', 'public/default/header.tpl.html', 'public/default/site/site.tpl.html']);

angular.module("public/default/blog/blog.tpl.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("public/default/blog/blog.tpl.html",
    "<div id=\"article-list\" class=\"row\" data-ng-if=\"hasItems\">\n" +
    "    <div class=\"panel panel-default\" data-ng-if=\"!paginator.isClean() && hasPagination\">\n" +
    "        <div class=\"panel-body\">\n" +
    "            <a href=\"#\" data-ng-click=\"paginator.filter()\">\n" +
    "                <span class=\"badge\" title=\"Tutti\">Tutti</span>\n" +
    "            </a>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"panel panel-default\" data-ng-hide=\"!paginator.isClean()\" data-ng-if=\"hasPagination\">\n" +
    "        <div class=\"panel-body clearfix\">\n" +
    "            <a class=\"pull-left\" href=\"#\" data-ng-show=\"paginator.hasOlder()\" data-ng-click=\"paginator.older()\">\n" +
    "                <span class=\"badge\" title=\"&lt;- Archivio\">&lt;- Archivio</span>\n" +
    "            </a>\n" +
    "            <a class=\"pull-right\" href=\"#\" data-ng-show=\"paginator.hasNewer()\" data-ng-click=\"paginator.newer()\">\n" +
    "                <span class=\"badge\" title=\"Recenti -&gt;\">Recenti -&gt;</span>\n" +
    "            </a>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <article class=\"col-md-12 article\" data-ng-class=\"{last:$last}\" data-ng-repeat=\"article in paginator.items\">\n" +
    "        <header class=\"article-header clearfix\">\n" +
    "            <a href=\"#\" class=\"pull-left\">\n" +
    "                <!--article thumbnail-->\n" +
    "                <img alt=\"thumbnail-article\" data-ng-src=\"/public/system/upload/{{article.avatar}}\" />\n" +
    "            </a>\n" +
    "            <h1>\n" +
    "                <a data-ui-sref=\"blog_details({ id: article.id,slug: article.slug })\" title=\"{{article.title}}\">\n" +
    "                    {{article.title}}\n" +
    "                </a>\n" +
    "                <span class=\"label label-default\" data-ng-if=\"$first\">New</span>\n" +
    "            </h1>   \n" +
    "        </header>\n" +
    "        <div class=\"article-body\">\n" +
    "            <ul class=\"article-meta\">\n" +
    "                <li>\n" +
    "                    <span class=\"glyphicon glyphicon-calendar\"></span>\n" +
    "                    <time pubdate date=\"{{article.published}}\">\n" +
    "                        <em>{{article.published}}</em>\n" +
    "                    </time> |  \n" +
    "                </li>\n" +
    "                <li>\n" +
    "                    <span class=\"btn btn-default btn-xs\">\n" +
    "                        <span class=\"glyphicon glyphicon-comment\"></span> {{article.comments}}\n" +
    "                    </span> | \n" +
    "                </li>\n" +
    "                <li class=\"article-tags\" tags=\"article.tags\" filter=\"filter(tag)\" data-nb-nav-tags></li>\n" +
    "            </ul>\n" +
    "            <!--article prologue -->\n" +
    "            <div class=\"article-content\" data-ng-bind-html=\"article.body\">\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <!--article footer -->\n" +
    "        <footer class=\"article-footer clearfix\">\n" +
    "            <a role=\"button\" data-ui-sref=\"blog_details({ id: article.id,slug: article.slug })\" class=\"label label-info pull-right\">Leggi »</a>  \n" +
    "        </footer>\n" +
    "    </article>\n" +
    "</div>");
}]);

angular.module("public/default/blog/details.tpl.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("public/default/blog/details.tpl.html",
    "<div id=\"article-details\" class=\"row\">\n" +
    "    <div class=\"panel panel-default\" data-ng-if=\"hasNext && hasPrevious\">\n" +
    "        <div class=\"panel-body clearfix\">\n" +
    "            <a class=\"pull-left\" data-ui-sref=\"blog_details({ id: previous._id,slug: previous.slug })\" data-ng-show=\"hasPrevious\">\n" +
    "                <span class=\"badge\" title=\"{{previous.title}}\">&lt;-{{previous.title}}</span>\n" +
    "            </a>\n" +
    "            <a class=\"pull-right\" data-ui-sref=\"blog_details({ id: next._id,slug: next.slug })\" data-ng-show=\"hasNext\">\n" +
    "                <span class=\"badge\" title=\"{{next.title}}\">{{next.title}}-&gt;</span>\n" +
    "            </a>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <article class=\"col-md-12 article\">\n" +
    "        <header class=\"article-header clearfix\">\n" +
    "            <a href=\"#\" class=\"pull-left\">\n" +
    "                <!--article thumbnail-->\n" +
    "                <img alt=\"thumbnail-article\" data-ng-src=\"/public/system/upload/{{article.avatar}}\" />\n" +
    "            </a>\n" +
    "            <h1>\n" +
    "                <a data-ui-sref=\"blog_details({ id: article._id,slug: article.slug })\" title=\"{{article.title}}\">\n" +
    "                    {{article.title}}\n" +
    "                </a>\n" +
    "            </h1>   \n" +
    "        </header>\n" +
    "        <div class=\"article-body\">\n" +
    "            <ul class=\"article-meta\">\n" +
    "                <li>\n" +
    "                    <span class=\"glyphicon glyphicon-calendar\"></span>\n" +
    "                    <time pubdate date=\"{{article.published | date:'dd/MM/yyyy'}}\">\n" +
    "                        <em>{{article.published | date:'dd/MM/yyyy'}}</em>\n" +
    "                    </time> |  \n" +
    "                </li>\n" +
    "                <li>\n" +
    "                    <span class=\"btn btn-default btn-xs\">\n" +
    "                        <span class=\"glyphicon glyphicon-comment\"></span> {{article.meta.comments.approved}}\n" +
    "                    </span> | \n" +
    "                </li>\n" +
    "                <li class=\"article-tags\" tags=\"article.tags\" filter=\"filter(tag)\" data-nb-nav-tags>\n" +
    "                    \n" +
    "                </li>\n" +
    "            </ul>\n" +
    "            <!--article prologue -->\n" +
    "            <div class=\"article-content\" data-ng-bind-html=\"article.body\">\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </article>\n" +
    "</div>\n" +
    "<div class=\"row\">\n" +
    "    <div class=\"col-md-5\">\n" +
    "        <div><button class=\"btn btn-default btn-sm\" data-ng-click=\"isCollapsed = !isCollapsed\" data-ng-hide=\"commentHasStorage\">Lascia un commento</button></div>\n" +
    "        <div id=\"frm-comment-wrapper\" collapse=\"isCollapsed\" data-ng-hide=\"commentHasStorage\">\n" +
    "            <h6 class=\"text-info\">L'indirizzo email non verrà pubblicato. I campi obbligatori sono contrassegnati <span class=\"text-danger\">*</span></h6>\n" +
    "            <form name=\"form\" role=\"form\" data-ng-submit=\"save()\">\n" +
    "                <input type=\"hidden\" name=\"post_id\" data-ng-model=\"comment.post_id\" required />\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label for=\"email\">Email<span class=\"text-danger\">*</span></label>\n" +
    "                    <input type=\"email\" class=\"form-control\" name=\"email\" id=\"email\" placeholder=\"La tua email\" data-ng-model=\"comment.email\" data-input-feedback required=\"required\" />\n" +
    "                </div>\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label for=\"author\">Nome<span class=\"text-danger\">*</span></label>\n" +
    "                    <input type=\"text\" class=\"form-control\" name=\"author\" id=\"author\" placeholder=\"Il tuo nome\" data-ng-model=\"comment.author\" data-input-feedback required=\"required\" />\n" +
    "                </div>\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label for=\"web\">Sito web</label>\n" +
    "                    <input type=\"url\" class=\"form-control\" name=\"web\" id=\"web\" placeholder=\"Se hai un sito web\" data-ng-model=\"comment.web\">\n" +
    "                </div>\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label for=\"body\">Commento<span class=\"text-danger\">*</span></label>\n" +
    "                    <textarea name=\"body\" id=\"body\" rows=\"5\" class=\"form-control\" placeholder=\"Il tuo commento\" data-input-feedback data-ng-model=\"comment.body\" data-ng-minlength=\"10\" data-ng-maxlength=\"300\" required=\"required\"></textarea>\n" +
    "                </div>\n" +
    "                <div class=\"form-group pull-right\">\n" +
    "                  <button type=\"button\" class=\"btn btn-default\" data-ng-click=\"cancel()\">Cancel</button>\n" +
    "                  <button type=\"submit\" class=\"btn btn-primary\" data-ng-disabled=\"form.$invalid\">Commenta</button>  \n" +
    "                </div>\n" +
    "            </form>\n" +
    "        </div>\n" +
    "        <div class=\"panel panel-default text-info\" data-ng-show=\"commentHasStorage\">\n" +
    "            <div class=\"panel-heading\">Grazie, per aver lasciato un commento</div>\n" +
    "            <div class=\"panel-body\">Il commento sarà visibile dopo moderazione</div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"row\">\n" +
    "    <div class=\"col-md-6\">\n" +
    "        <p class=\"text-muted\" data-ng-show=\"!hasComments\">\n" +
    "            Non ci sono commenti\n" +
    "        </p>\n" +
    "        <article class=\"comment-box\" data-ng-repeat=\"comment in comments track by comment.id\">\n" +
    "            <h5>\n" +
    "                <i class=\"glyphicon glyphicon-calendar\"></i>\n" +
    "                <time pubdate date=\"{{comment.created}}\">\n" +
    "                    <em>{{comment.created}}</em>\n" +
    "                </time>\n" +
    "                <i class=\"glyphicon glyphicon-user\"></i>\n" +
    "                <span>{{comment.author}}</span>\n" +
    "            </h5>\n" +
    "            <h6>{{comment.body}}</h6>\n" +
    "            <article id=\"c_{{children._id}}\" data-ng-if=\"comment.hasChildren\" data-ng-repeat=\"children in comment.children\">\n" +
    "                <h5>\n" +
    "                    <i class=\"glyphicon glyphicon-calendar\"></i>\n" +
    "                    <time pubdate date=\"{{comment.created | date:'dd/MM/yyyy'}}\">\n" +
    "                        <em>{{children.created | date:'dd/MM/yyyy'}}</em>\n" +
    "                    </time>\n" +
    "                    <i class=\"glyphicon glyphicon-user\"></i>\n" +
    "                    <span>{{children.author}}</span>\n" +
    "                </h5>\n" +
    "                <h6 class=\"text-info\">{{children.body}}</h6>\n" +
    "           </article>\n" +
    "        </article> \n" +
    "    </div>\n" +
    "</div>    \n" +
    "");
}]);

angular.module("public/default/header.tpl.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("public/default/header.tpl.html",
    "<div class=\"container\">\n" +
    "    <div class=\"navbar-header\">\n" +
    "        <button type=\"button\" data-toggle=\"collapse\" data-target=\"#nb-navbar-collapse\" class=\"navbar-toggle\"><span class=\"sr-only\">Toggle navigation</span><span class=\"icon-bar\"></span><span class=\"icon-bar\"></span><span class=\"icon-bar\">  </span></button><a href=\"/\" class=\"navbar-brand\"><img alt=\"il web di fabio\" title=\"il web di fabio\" src=\"/public/default/assets/img/logo.png\" class=\"img-responsive\"></a>\n" +
    "    </div>\n" +
    "    <div id=\"nb-navbar-collapse\" class=\"collapse navbar-collapse\">\n" +
    "        <ul class=\"nav navbar-nav navbar-left\">\n" +
    "            <li data-ng-class=\"{ active: $state.includes('index') }\"><a data-ui-sref=\"index\" data-nb-scroll=\"index\">Home</a></li>\n" +
    "            <li><a data-ui-sref=\"index\" data-nb-scroll=\"about\">Chi sono</a></li>\n" +
    "            <li><a data-ui-sref=\"index\" data-nb-scroll=\"contact\">Contatti</a></li>\n" +
    "            <li data-ng-class=\"{ active: $state.includes('blog') || isDetailsSection }\"><a data-ui-sref=\"blog\">Blog </a></li>\n" +
    "            <li><span href=\"#\" title=\"Versione Beta\" class=\"label label-danger\"> Beta*</span></li>\n" +
    "        </ul>\n" +
    "        <ul class=\"nav navbar-nav navbar-right\">\n" +
    "            <li data-nb-signals=\"\" signals=\"signals\" labels=\"mapLabels\" routes=\"mapRoutes\" class=\"dropdown signals\"></li>\n" +
    "            <li><a href=\"https://www.facebook.com/pages/Ilwebdifabio/756965764316135\" target=\"_blank\" class=\"btn btn-social-icon btn-facebook\"><i class=\"fa fa-facebook\"></i></a></li>\n" +
    "            <li><a href=\"https://plus.google.com/u/0/+FabioBedini/posts\" target=\"_blank\" class=\"btn btn-social-icon btn-google-plus\"><i class=\"fa fa-google-plus\"></i></a></li>\n" +
    "            <li><a href=\"https://twitter.com/ilwebdifabio\" target=\"_blank\" class=\"btn btn-social-icon btn-sm btn-twitter\"><i class=\"fa fa-twitter\"></i></a></li>\n" +
    "            <li><a class=\"btn btn-social-icon btn-instagram\"><i class=\"fa fa-instagram\"></i></a></li>\n" +
    "            <li><a href=\"http://instagram.com/whisher06\" target=\"_blank\" class=\"btn btn-social-icon btn-github\"><i class=\"fa fa-github\"></i></a></li>\n" +
    "            <li><a class=\"btn btn-social-icon btn-foursquare\"><i class=\"fa fa-foursquare\"></i></a></li>\n" +
    "            <li><a href=\"https://github.com/whisher\" target=\"_blank\" class=\"btn btn-social-icon btn-linkedin\"><i class=\"fa fa-linkedin\"></i></a></li>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("public/default/site/site.tpl.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("public/default/site/site.tpl.html",
    "<div class=\"jumbotron\" id=\"index\" role=\"index\" data-ng-controller=\"IndexCtrl\" data-nb-panel>\n" +
    "    <h2 class=\"clearfix\">Sviluppo, design e un pizzico di ...<span class=\"glyphicon glyphicon-home pull-right\"></span></h2>\n" +
    "    <h3>Siti, applicazioni web e compagnia.</h3>\n" +
    "    <p>Sviluppa il tuo marchio e la tua presenza in rete.</p>\n" +
    "    <p>Creare una buona presenza in rete aumenta la conoscenza di te azienda tra i tuoi clienti.</p>\n" +
    "    <p>Fabio con qualità, seguendo i principi del buon design, dell'usabilità e dell'accessibilità basata sugli standard W3C,\n" +
    "    realizza per te un sito solido, efficace, <strong>unico</strong>, semplice da gestire ed ottimizzato seo,\n" +
    "    collegato a Facebook, Twitter, Google+ e a tutti i social networks che desideri.</p>\n" +
    "    <p>Fai guadagnare al tuo marchio  credibilità e forza, socializzati :).</p>\n" +
    "</div>\n" +
    "<div class=\"jumbotron\" id=\"about\" role=\"about\" data-ng-controller=\"AboutCtrl\" data-nb-panel>\n" +
    "    <h2 class=\"clearfix\">Chi sono ...<span class=\"glyphicon glyphicon-user pull-right\"></span></h2>\n" +
    "    <p>Sono un programmatore web freelancer.</p>\n" +
    "    <p>Vivo nel nord italia ed ho una esperienza decennale come sviluppatore di siti/applicazioni web.</p>\n" +
    "    <p>Metto a disposizione le mie competenze per lo sviluppo di progetti sia per privati che per la piccola e media impresa italiana e internazionale.</p>\n" +
    "    <h2 class=\"clearfix\">Cosa faccio <span class=\"glyphicon glyphicon-flash pull-right\"></span></h2>\n" +
    "    <ul class=\"list-group\">\n" +
    "        <li class=\"list-group-item list-group-item-info\">HTML5/CSS/SPA/javascrip web application responsive layout</li>\n" +
    "        <li class=\"list-group-item list-group-item-info\">Mash up web application (Youtube,Facebook,Twitter,Google+,GoogleMap) Api</li>\n" +
    "        <li class=\"list-group-item list-group-item-info\">PHP web application</li>\n" +
    "        <li class=\"list-group-item list-group-item-info\">Phonegap</li>\n" +
    "        <li class=\"list-group-item list-group-item-info\">Rete social</li>\n" +
    "        <li class=\"list-group-item list-group-item-info\">CreateJS,D3</li>\n" +
    "        <li class=\"list-group-item list-group-item-info\">Seo</li>\n" +
    "        <li class=\"list-group-item list-group-item-info\">App in real time socket.io, Firebase, Pusher</li>\n" +
    "    </ul>\n" +
    "</div>\n" +
    "<div class=\"jumbotron clearfix\" id=\"contact\" role=\"contact\" data-ng-controller=\"ContactCtrl\" data-nb-panel>\n" +
    "    <h2 class=\"clearfix\">Contattami <span class=\"glyphicon glyphicon-envelope pull-right\"></span></h2>\n" +
    "    <script type=\"text/ng-template\" id=\"contactModalOnSubmit.html\">\n" +
    "        <div class=\"modal-header\">\n" +
    "           <h3 class=\"text-info\">Grazie per il feedback {{contact.username}}</h3>\n" +
    "        </div>\n" +
    "        <div class=\"modal-body\">\n" +
    "            <p class=\"text-info\">Sarai contattato al più presto</p>\n" +
    "        </div>\n" +
    "        <div class=\"modal-footer\">\n" +
    "            <button class=\"btn btn-primary\" ng-click=\"ok()\">OK</button>\n" +
    "        </div>\n" +
    "    </script>\n" +
    "    <div class=\"col-md-6\">\n" +
    "        <p>Non esitate a contattarmi per discutere i miei servizi, la mia disponibilità, e le mie tariffe, oppure solamente per salutarmi :).<br />\n" +
    "        Mi farebbe molto piacere essere contattato da voi. Comunicatemi le vostre idee e i vostri progetti, non importa dove vi troviate, posso lavorare ovunque nel mondo.</p>\n" +
    "    </div>\n" +
    "    <form class=\"form-horizontal col-md-6\" role=\"form\" name=\"form\" data-ng-submit=\"save()\">\n" +
    "        <div class=\"form-group\">\n" +
    "           <div>\n" +
    "                <input type=\"text\" class=\"form-control\" id=\"username\" placeholder=\"Il tuo nome\" required=\"required\" data-input-feedback data-ng-model=\"contact.username\" data-ng-minlength=\"3\" data-ng-maxlength=\"30\">\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <div>\n" +
    "                <input type=\"email\" class=\"form-control\" id=\"email\" placeholder=\"La tua email\" required=\"required\" data-input-feedback data-ng-model=\"contact.email\">\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <div>\n" +
    "                <textarea name=\"msg\" id=\"msg\" rows=\"4\" class=\"form-control\" placeholder=\"Il tuo messaggio\" required=\"required\" data-input-feedback data-ng-model=\"contact.msg\" data-ng-minlength=\"10\" data-ng-maxlength=\"300\"></textarea>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <div class=\"clearfix\">\n" +
    "                <button type=\"submit\" class=\"btn btn-info pull-right\" data-ng-disabled=\"form.$invalid\">Salva</button>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </form>\n" +
    "</div>\n" +
    "");
}]);
