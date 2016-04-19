var ngApp;
(function (ngApp) {
    var overrides;
    (function (overrides) {
        angular.module("components.overrides", [
            "overrides.directives"
        ]);
    })(overrides = ngApp.overrides || (ngApp.overrides = {}));
})(ngApp || (ngApp = {}));
