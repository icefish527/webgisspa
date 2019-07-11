define(['app', 'jquery'], function (appModule) {

    appModule.directive('errSrc', function() {
        return {
            link: function(scope, element, attrs) {
                element.bind('error', function() {
                    if (attrs.src != attrs.errSrc) {
                        attrs.$set('src', attrs.errSrc);
                    }
                });
            }
        }
    });

    appModule.directive('backgroundUrl', function() {
        return {
            link: function(scope, element, attrs) {
                var url = attrs.backgroundUrl;
                element.css("background-image", "url('" + url + "')");
            }
        }
    });

    return appModule;
});
