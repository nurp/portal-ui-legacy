var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var header;
        (function (_header) {
            var directives;
            (function (directives) {
                function header() {
                    return {
                        restrict: "E",
                        templateUrl: "components/header/templates/header.html",
                        controller: "HeaderController as hc"
                    };
                }
                angular.module("header.directives", []).directive("ngaHeader", header);
            })(directives = _header.directives || (_header.directives = {}));
        })(header = components.header || (components.header = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));
