angular.module('templates.admin', ['src/app/admin/index/index.tpl.html', 'src/app/admin/media/index.tpl.html', 'src/app/admin/post/comments.tpl.html', 'src/app/admin/post/delete.tpl.html', 'src/app/admin/post/form.tpl.html', 'src/app/admin/post/post.tpl.html', 'src/app/admin/user/delete.tpl.html', 'src/app/admin/user/form.tpl.html', 'src/app/admin/user/user.tpl.html']);

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

angular.module("src/app/admin/media/index.tpl.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("src/app/admin/media/index.tpl.html",
    "");
}]);

angular.module("src/app/admin/post/comments.tpl.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("src/app/admin/post/comments.tpl.html",
    "<div id=\"cmt-wrapper\" class=\"col-md-6\" data-ng-show=\"comments.length > 0\">\n" +
    "    <div class=\"cmt-box\" data-ng-repeat=\"comment in comments\" data-ng-controller=\"ShowCommentsInnerCtrl\">\n" +
    "        <div class=\"cmt-email bg-info\">{{comment.email}}</div>\n" +
    "        <div class=\"cmt-author\">{{comment.author}}</div>\n" +
    "        <div class=\"cmt-web\" data-ng-if=\"comment.web\"><a href=\"{{comment.web}}\" target=\"_blank\">{{comment.web}}</a></div>\n" +
    "        <div class=\"cmt-body\">{{comment.body}}</div>\n" +
    "        <div class=\"cmt-create\">{{comment.created | date:'short'}}</div>\n" +
    "        <div class=\"cmt-children\" data-ng-if=\"comment.children.length > 0\" data-ng-repeat=\"children in comment.children\">\n" +
    "            <p class=\"text-info\">{{children.body}}</p>\n" +
    "        </div>\n" +
    "        <form class=\"clearfix\" name=\"form\" role=\"form\" collapse=\"isCollapsed\" data-ng-submit=\"doReply(comment._id)\">\n" +
    "            <div class=\"form-group\">\n" +
    "                <textarea name=\"body\" id=\"body\" rows=\"5\" class=\"form-control\" placeholder=\"Write a reply\" data-ng-model=\"reply\" required=\"required\"></textarea>\n" +
    "            </div>\n" +
    "            <button type=\"submit\" class=\"btn btn-primary pull-right btn-xs\" data-ng-disabled=\"form.$invalid\">Reply</button>\n" +
    "        </form>\n" +
    "        <div class=\"cmt-footer\">\n" +
    "            <a data-ng-click=\"approved(comment._id)\" class=\"btn btn-success btn-xs\" title=\"approve comment\">\n" +
    "                <span class=\"glyphicon glyphicon-ok\"></span> Approve\n" +
    "            </a>\n" +
    "            <a data-ng-click=\"isCollapsed = !isCollapsed\" class=\"btn btn-info btn-xs\" title=\"reply comment\">\n" +
    "                <span class=\"glyphicon glyphicon-share-alt\"></span> Reply\n" +
    "            </a>\n" +
    "            <a data-ng-href=\"#/comment/edit/{{comment._id}}\" class=\"btn btn-warning btn-xs\" title=\"edit comment\">\n" +
    "                <span class=\"glyphicon glyphicon-edit\"></span> Edit\n" +
    "            </a>\n" +
    "            <a data-ng-href=\"#/comment/delete/{{comment._id}}\" class=\"btn btn-danger btn-xs\" title=\"delete comment\">\n" +
    "                <span class=\"glyphicon glyphicon-trash\"></span> Delete\n" +
    "            </a>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>  \n" +
    "\n" +
    "\n" +
    "");
}]);

angular.module("src/app/admin/post/delete.tpl.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("src/app/admin/post/delete.tpl.html",
    "<form class=\"form-inline\" role=\"form\">\n" +
    "  <div class=\"form-group\">\n" +
    "  <h3>Are you sure you want to delete this post?</h3> \n" +
    "  <button type=\"button\" class=\"btn btn-primary\" data-ng-click=\"destroy()\">Yes</button>\n" +
    "  <button type=\"button\" class=\"btn btn-danger\" data-ng-click=\"save()\">No thanks</button>\n" +
    "  </div>\n" +
    "</form>\n" +
    "   ");
}]);

angular.module("src/app/admin/post/form.tpl.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("src/app/admin/post/form.tpl.html",
    "<h2>{{header}}</h2>\n" +
    "<form name=\"form\" class=\"form-horizontal\" role=\"form\" data-ng-submit=\"save()\" uploader>\n" +
    "    <div class=\"col-md-8\">\n" +
    "        <div class=\"form-group\">\n" +
    "            <input type=\"text\" name=\"title\" id=\"title\" class=\"form-control\" placeholder=\"Enter title here\" data-ng-model=\"post.title\" required />\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <textarea name=\"body\" id=\"body\" rows=\"8\" class=\"form-control\" placeholder=\"Enter body here\" data-ng-model=\"post.body\" required></textarea>\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <input type=\"text\" class=\"form-control\" name=\"categories\" id=\"categories\" placeholder=\"Enter categories here (at least one)\" data-ng-model=\"post.categories\" ng-pattern=\"/^\\w(\\s*,?\\s*\\w)*$/\" required />\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <input type=\"text\" class=\"form-control\" name=\"tags\" id=\"tags\" placeholder=\"Enter tags here (at least one)\" data-ng-model=\"post.tags\" ng-pattern=\"/^\\w(\\s*,?\\s*\\w)*$/\" required />\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-3 col-md-offset-1\">\n" +
    "        <div class=\"form-group\">\n" +
    "            <div class=\"input-group\">\n" +
    "                <div class=\"btn-toolbar\">\n" +
    "                    <button type=\"button\" class=\"btn btn-primary\" data-ng-model=\"post.status\" data-ng-repeat=\"s in status\" btn-radio=\"s\">{{s}}</button> \n" +
    "                </div>\n" +
    "            </div> \n" +
    "        </div> \n" +
    "        <div class=\"form-group\">\n" +
    "            <div class=\"input-group\">\n" +
    "                <input type=\"text\" class=\"form-control\" id=\"datepicker\" data-ng-readonly=\"true\" datepicker-popup=\"{{format}}\" data-ng-model=\"post.published\" is-open=\"opened\" min=\"minDate\" max=\"'2015-06-22'\" datepicker-options=\"dateOptions\" date-disabled=\"disabled(date, mode)\" data-ng-required=\"true\" close-text=\"Close\" />\n" +
    "                <span class=\"input-group-btn\">\n" +
    "                    <button class=\"btn btn-default\" data-ng-click=\"open($event)\"><i class=\"glyphicon glyphicon-calendar\"></i></button>\n" +
    "                </span>  \n" +
    "            </div> \n" +
    "        </div>\n" +
    "        <div class=\"form-group\" style=\"display:none;\">\n" +
    "            <input type=\"file\" class=\"form-control\" id=\"file\" data-ng-file-select=\"onFileSelect($files)\">\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <div class=\"input-group\">\n" +
    "                <input type=\"text\" style=\"display:none;\" data-ng-model=\"post.avatar\" required />\n" +
    "                <input type=\"text\" readonly=\"readonly\" class=\"form-control\" id=\"fileholder\" title=\"click to upload an avatar\" data-ng-model=\"avatar\" />\n" +
    "                <span class=\"input-group-btn\">\n" +
    "                    <button class=\"btn btn-default\" data-ng-disabled=\"true\"><i class=\"glyphicon glyphicon-floppy-open\"></i></button>\n" +
    "                </span> \n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"form-group\" data-ng-if=\"uploadPercent > 0\">\n" +
    "            <div class=\"progress\">\n" +
    "                <div class=\"progress-bar\" role=\"progressbar\" aria-valuenow=\"{{uploadPercent}}\" aria-valuemin=\"0\" aria-valuemax=\"100\" data-ng-style=\"{width:uploadPercent+'%'}\">\n" +
    "                    {{uploadPercent}}\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <alert data-ng-show=\"showAlert\" type=\"'danger'\" close=\"closeAlert()\">\n" +
    "                Only images are allowed !  \n" +
    "            </alert>\n" +
    "            <img class=\"avatar-to-upload\" data-ng-show=\"dataUrl\" data-ng-src=\"{{dataUrl}}\">\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-8\">\n" +
    "        <div class=\"form-group\">\n" +
    "            <input type=\"submit\" class=\"btn btn-primary\" value=\"Save\" data-ng-disabled=\"isClean() || form.$invalid\" />\n" +
    "        </div>\n" +
    "    </div>    \n" +
    "</form>\n" +
    "\n" +
    "\n" +
    "");
}]);

angular.module("src/app/admin/post/post.tpl.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("src/app/admin/post/post.tpl.html",
    "<div class=\"well\">\n" +
    "    <a data-ui-sref=\"post_create\" class=\"btn btn-primary\">New</a>\n" +
    "</div>\n" +
    "<table class=\"table table-striped\" data-ng-show=\"paginator.items.length > 0\">\n" +
    "    <thead>\n" +
    "        <tr>\n" +
    "            <th>Title</th>\n" +
    "            <th>Slug</th>\n" +
    "            <th>Author</th>\n" +
    "            <th>Categories</th>\n" +
    "            <th>Tags</th>\n" +
    "            <th>Created</th>\n" +
    "            <th>Published</th>\n" +
    "            <th><span class=\"glyphicon glyphicon-thumbs-up\" title=\"Votes\"></th>\n" +
    "            <th><span class=\"glyphicon glyphicon-comment\" title=\"Comments\"></span></th>\n" +
    "            <th>Avatar</th>\n" +
    "            <th>Status</th>\n" +
    "            <th>Actions</th>\n" +
    "        </tr>\n" +
    "    </thead>\n" +
    "    <tbody>\n" +
    "        <tr data-ng-repeat=\"post in paginator.items\">\n" +
    "            <td>{{post.title}}</td>\n" +
    "            <td>{{post.slug}}</td>\n" +
    "            <td>{{post.author}}</td>\n" +
    "            <td>{{post.categories}}</td>\n" +
    "            <td>{{post.tags}}</td>\n" +
    "            <td>{{post.created}}</td>\n" +
    "            <td>{{post.published}}</td>\n" +
    "            <td>{{post.votes}}</td>\n" +
    "            <td ng-switch=\"post.meta.comments\">\n" +
    "                <span class=\"badge\" ng-switch-when=\"0\">0</span>\n" +
    "                <a class=\"badge\" data-ng-click=\"showComments(post)\" data-ng-switch-default>\n" +
    "                    <span class=\"text-warning\" title=\"pending\">{{post.comments.pending}}</span>/<span class=\"text-success\" title=\"approved\">{{post.comments.approved}}</span>\n" +
    "                </a>\n" +
    "            </td>\n" +
    "            <td><img alt=\"{{post.title}}\" title=\"{{post.title}}\" class=\"img-thumbnail post-avatar\" data-ng-src=\"/upload/{{post.avatar}}\"></td>\n" +
    "            <td>{{post.status}}</td>\n" +
    "            <td>\n" +
    "                <a data-ui-sref=\"post_edit({ id: post._id })\" class=\"btn btn-warning btn-sm\" title=\"edit post\">\n" +
    "                    <span class=\"glyphicon glyphicon-edit\"></span> Edit\n" +
    "                </a>\n" +
    "                <a data-ui-sref=\"post_delete({ id: post._id })\" class=\"btn btn-danger btn-sm\" title=\"delete post\">\n" +
    "                    <span class=\"glyphicon glyphicon-trash\"></span> Delete\n" +
    "                </a>\n" +
    "            </td>\n" +
    "        </tr>\n" +
    "    </tbody>\n" +
    "</table>\n" +
    "<div class=\"text-center\">\n" +
    "    <ul class=\"pagination\">\n" +
    "        <li data-ng-class=\"{disabled: !paginator.hasPrevious()}\">\n" +
    "            <a href data-ng-click=\"paginator.previous()\">&laquo; </a>\n" +
    "        </li>\n" +
    "        <li data-ng-class=\"{disabled: !paginator.hasFirst()}\">\n" +
    "            <a href data-ng-click=\"paginator.first()\">&lsaquo;</a>\n" +
    "        </li>\n" +
    "        <li data-ng-repeat=\"n in [] | pagination:paginator.getStart():paginator.getEnd()\" data-ng-class=\"{active: n == paginator.getCurrentPage()}\">\n" +
    "            <a  href data-ng-click=\"paginator.toPageId(n)\">{{n}}</a>\n" +
    "        </li>\n" +
    "        <li data-ng-class=\"{disabled: !paginator.hasLast()}\">\n" +
    "            <a href data-ng-click=\"paginator.last()\">&rsaquo; </a>\n" +
    "        </li>\n" +
    "        <li data-ng-class=\"{disabled: !paginator.hasNext()}\">\n" +
    "            <a href data-ng-click=\"paginator.next()\">&raquo;</a>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "");
}]);

angular.module("src/app/admin/user/delete.tpl.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("src/app/admin/user/delete.tpl.html",
    "<form class=\"form-inline\" role=\"form\">\n" +
    "  <div class=\"form-group\">\n" +
    "  <h3>Are you sure you want to delete this user?</h3> \n" +
    "  <button type=\"button\" class=\"btn btn-primary\" data-ng-click=\"destroy()\">Yes</button>\n" +
    "  <button type=\"button\" class=\"btn btn-danger\" data-ng-click=\"save()\">No thanks</button>\n" +
    "  </div>\n" +
    "</form>\n" +
    "   ");
}]);

angular.module("src/app/admin/user/form.tpl.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("src/app/admin/user/form.tpl.html",
    "<h2>{{header}}</h2>\n" +
    "<form name=\"form\" class=\"form-horizontal\" role=\"form\" data-ng-submit=\"save()\">\n" +
    "    <div class=\"col-md-8\">\n" +
    "        <div class=\"form-group\">\n" +
    "            <input type=\"text\" name=\"name\" id=\"name\" class=\"form-control\" placeholder=\"Name\" data-ng-model=\"user.name\" required />\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <input type=\"text\" name=\"username\" id=\"username\" class=\"form-control\" placeholder=\"Username\" data-ng-model=\"user.username\" required />\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <input type=\"email\" name=\"email\" id=\"name\" class=\"form-control\" placeholder=\"Email\" data-ng-model=\"user.email\" required />\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <input type=\"password\" name=\"password\" id=\"password\" class=\"form-control\" placeholder=\"Password\" data-ng-model=\"user.password\" required />\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <div class=\"pull-right\">\n" +
    "                <button type=\"submit\" class=\"btn btn-primary\" data-ng-disabled=\"isClean() || form.$invalid\">Add</button>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</form>\n" +
    "\n" +
    "");
}]);

angular.module("src/app/admin/user/user.tpl.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("src/app/admin/user/user.tpl.html",
    "<div class=\"well\">\n" +
    "    <a class=\"btn btn-primary\" data-ui-sref=\"user_create\">New</a>\n" +
    "</div>\n" +
    "<table class=\"table table-striped\" data-ng-show=\"paginator.items.length > 0\">\n" +
    "    <thead>\n" +
    "        <tr>\n" +
    "            <th>Name</th>\n" +
    "            <th>Email</th>\n" +
    "            <th>Username</th>\n" +
    "            <th>Actions</th>\n" +
    "        </tr>\n" +
    "    </thead>\n" +
    "    <tbody>\n" +
    "        <tr data-ng-repeat=\"user in paginator.items\">\n" +
    "            <td>{{user.name}}</td>\n" +
    "            <td>{{user.email}}</td>\n" +
    "            <td>{{user.username}}</td>\n" +
    "            <td>\n" +
    "                <a data-ui-sref=\"user_edit({ id: user._id })\" class=\"btn btn-warning btn-sm\" title=\"edit user\">\n" +
    "                    <span class=\"glyphicon glyphicon-edit\"></span> Edit\n" +
    "                </a>\n" +
    "                <a data-ui-sref=\"user_delete({ id: user._id })\" class=\"btn btn-danger btn-sm\" title=\"delete user\">\n" +
    "                    <span class=\"glyphicon glyphicon-trash\"></span> Delete\n" +
    "                </a>\n" +
    "            </td>\n" +
    "        </tr>\n" +
    "    </tbody>\n" +
    "</table>\n" +
    "<div class=\"text-center\">\n" +
    "    <ul class=\"pagination\">\n" +
    "        <li data-ng-class=\"{disabled: !paginator.hasPrevious()}\">\n" +
    "            <a href data-ng-click=\"paginator.previous()\">&laquo; </a>\n" +
    "        </li>\n" +
    "        <li data-ng-class=\"{disabled: !paginator.hasFirst()}\">\n" +
    "            <a href data-ng-click=\"paginator.first()\">&lsaquo;</a>\n" +
    "        </li>\n" +
    "        <li data-ng-repeat=\"n in [] | pagination:paginator.getStart():paginator.getEnd()\" data-ng-class=\"{active: n == paginator.getCurrentPage()}\">\n" +
    "            <a  href data-ng-click=\"paginator.toPageId(n)\">{{n}}</a>\n" +
    "        </li>\n" +
    "        <li data-ng-class=\"{disabled: !paginator.hasLast()}\">\n" +
    "            <a href data-ng-click=\"paginator.last()\">&rsaquo; </a>\n" +
    "        </li>\n" +
    "        <li data-ng-class=\"{disabled: !paginator.hasNext()}\">\n" +
    "            <a href data-ng-click=\"paginator.next()\">&raquo;</a>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "</div>\n" +
    "\n" +
    "");
}]);
