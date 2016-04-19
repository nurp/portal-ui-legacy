var ngApp;
(function (ngApp) {
    var search;
    (function (search) {
        "use strict";
        /* @ngInject */
        function searchConfig($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.when("/search", "/search/f");
            $stateProvider.state("search", {
                url: "/search?filters&pagination",
                controller: "SearchController as sc",
                templateUrl: "search/templates/search.html",
                reloadOnSearch: false
            });
            $stateProvider.state("search.files", {
                url: "/f",
                data: {
                    tab: "files"
                },
                reloadOnSearch: false
            });
        }
        angular.module("ngApp.search", [
            "search.controller",
            "ui.router.state"
        ]).config(searchConfig);
    })(search = ngApp.search || (ngApp.search = {}));
})(ngApp || (ngApp = {}));
