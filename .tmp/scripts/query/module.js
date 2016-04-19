var ngApp;
(function (ngApp) {
    var query;
    (function (query) {
        "use strict";
        /* @ngInject */
        function queryConfig($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.when("/query", "/query/f");
            $stateProvider.state("query", {
                url: "/query?query&filters&pagination",
                controller: "QueryController as qc",
                templateUrl: "query/templates/query.html",
                reloadOnQuery: false
            });
            $stateProvider.state("query.summary", {
                url: "/s",
                data: {
                    tab: "summary"
                },
                reloadOnSearch: false
            });
            $stateProvider.state("query.participants", {
                url: "/c",
                data: {
                    tab: "participants"
                },
                reloadOnQuery: false
            });
            $stateProvider.state("query.files", {
                url: "/f",
                data: {
                    tab: "files"
                },
                reloadOnQuery: false
            });
        }
        angular.module("ngApp.query", [
            "query.controller",
            "ui.router.state"
        ]).config(queryConfig);
    })(query = ngApp.query || (ngApp.query = {}));
})(ngApp || (ngApp = {}));
