(function(window, angular, undefined) {
    'use strict';
    angular.module('nodblog.api.post', ['nodblog.api.base'])
        .config(function(RestangularProvider) {
            RestangularProvider.setRestangularFields({
                id: "_id"
            });
        })
        .factory('Post', function(Base) {
            function NgPost() {
                this.status = ['publish','draft'];
                this.labels = {
                    frmCreateHeader:'Add New Post',
                    frmEditHeader:'Edit Post'
                }; 
                this.commentsByPostId = function(id){
                    return this.getElements().one('comments',id).getList();
                }
            }
            return angular.extend(Base('post'), new NgPost());
        });
})(window, angular);