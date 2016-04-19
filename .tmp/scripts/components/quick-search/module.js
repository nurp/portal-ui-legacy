var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var quickSearch;
        (function (quickSearch) {
            angular.module("components.quickSearch", [
                "quickSearch.directives"
            ]);
        })(quickSearch = components.quickSearch || (components.quickSearch = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));
