var ngApp;
(function (ngApp) {
    var reports;
    (function (reports) {
        "use strict";
        var reportServiceExpand = [
            "data_access",
            "data_subtypes",
            "tags",
            "countries",
            "data_formats",
            "experimental_strategies",
            "platforms",
            "user_access_types",
            "data_types",
            "centers"
        ];
        /* @ngInject */
        function reportsConfig($stateProvider) {
            $stateProvider.state("reports", {
                url: "/reports/data-download-statistics",
                controller: "ReportsController as rsc",
                templateUrl: "reports/templates/reports.html",
                resolve: {
                    reports: function (ReportsService) {
                        return ReportsService.getReports({
                            expand: reportServiceExpand
                        });
                    }
                }
            });
        }
        angular.module("ngApp.reports", [
            "reports.controller",
            "ui.router.state"
        ]).value("reportServiceExpand", reportServiceExpand).config(reportsConfig);
    })(reports = ngApp.reports || (ngApp.reports = {}));
})(ngApp || (ngApp = {}));
