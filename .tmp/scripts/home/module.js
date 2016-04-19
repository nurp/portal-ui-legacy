var ngApp;
(function (ngApp) {
    var home;
    (function (home) {
        "use strict";
        /* @ngInject */
        function homeConfig($stateProvider) {
            $stateProvider.state("home", {
                url: "/",
                controller: "HomeController as hc",
                templateUrl: "home/templates/home.html"
            });
        }
        angular.module("ngApp.home", [
            "home.services",
            "home.controller",
            "ui.router.state"
        ]).config(homeConfig);
    })(home = ngApp.home || (ngApp.home = {}));
})(ngApp || (ngApp = {}));
