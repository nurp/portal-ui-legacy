var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var tables;
        (function (tables) {
            var directives;
            (function (directives) {
                angular.module("components.tables", [
                    "tables.directives",
                    "tableicious.directive",
                    "tables.services",
                    "pagination.directives"
                ]);
            })(directives = tables.directives || (tables.directives = {}));
        })(tables = components.tables || (components.tables = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));
