var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var facets;
        (function (facets) {
            angular.module("components.facets", [
                "facets.directives"
            ]);
        })(facets = components.facets || (components.facets = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));
