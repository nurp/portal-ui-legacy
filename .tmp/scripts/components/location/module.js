var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var location;
        (function (location) {
            angular.module("components.location", [
                "location.services"
            ]);
        })(location = components.location || (components.location = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));
