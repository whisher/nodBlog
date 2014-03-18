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
