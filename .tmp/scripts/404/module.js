var ngApp;
(function (ngApp) {
    var notFound;
    (function (notFound) {
        "use strict";
        /* @ngInject */
        function notFoundConfig($stateProvider) {
            $stateProvider.state("404", {
                url: "/404",
                controller: "NotFoundController as nf",
                templateUrl: "404/templates/404.html"
            });
        }
        angular.module("ngApp.notFound", [
            "notFound.controller",
            "ui.router.state"
        ]).config(notFoundConfig);
    })(notFound = ngApp.notFound || (ngApp.notFound = {}));
})(ngApp || (ngApp = {}));
