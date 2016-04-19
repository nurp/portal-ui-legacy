var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var user;
        (function (user) {
            angular.module("components.user", [
                "user.services"
            ]);
        })(user = components.user || (components.user = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));
