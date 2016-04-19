var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var overrides;
        (function (overrides) {
            var directives;
            (function (directives) {
                /* @ngInject */
                function AnchorOverride(CoreService) {
                    return {
                        restrict: "E",
                        link: function ($scope, element, attrs) {
                            element.on("keyup", function (event) {
                                if (event.which !== 13) {
                                    return;
                                }
                                if (attrs.href && attrs.href.charAt(0) === "#") {
                                    element[0].blur();
                                    document.querySelector(attrs.href).focus();
                                }
                            });
                        }
                    };
                }
                angular.module("overrides.directives", []).directive("a", AnchorOverride);
            })(directives = overrides.directives || (overrides.directives = {}));
        })(overrides = components.overrides || (components.overrides = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));
