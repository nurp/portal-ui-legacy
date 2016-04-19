var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var ui;
        (function (ui) {
            var scrollTo;
            (function (scrollTo) {
                /* @ngInject */
                function ScrollTo($window) {
                    return function ($scope, elm, attrs) {
                        elm.bind("click", function (e) {
                            var top;
                            e.preventDefault();
                            if (attrs.href) {
                                attrs.scrollto = attrs.href;
                            }
                            top = $window.jQuery(attrs.scrollto).offset().top - 60;
                            $window.jQuery("body,html").animate({ scrollTop: top }, 800);
                        });
                    };
                }
                angular.module("ui.scroll.scrollTo", []).directive("scrollTo", ScrollTo);
            })(scrollTo = ui.scrollTo || (ui.scrollTo = {}));
        })(ui = components.ui || (components.ui = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));
