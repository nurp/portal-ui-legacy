var ngApp;
(function (ngApp) {
    var reports;
    (function (reports) {
        var services;
        (function (services) {
            var ReportsService = (function () {
                /* @ngInject */
                function ReportsService(Restangular, $q, ProjectsService) {
                    this.$q = $q;
                    this.ProjectsService = ProjectsService;
                    this.ds = Restangular.all("reports/data-download-statistics");
                }
                ReportsService.prototype.getReports = function (params) {
                    if (params === void 0) { params = {}; }
                    if (params.hasOwnProperty("fields")) {
                        params["fields"] = params["fields"].join();
                    }
                    if (params.hasOwnProperty("expand")) {
                        params["expand"] = params["expand"].join();
                    }
                    if (params.hasOwnProperty("facets")) {
                        params["facets"] = params["facets"].join();
                    }
                    var size = 999999;
                    if (this.ProjectsService.projectIdMapping) {
                        size = _.size(this.ProjectsService.projectIdMapping);
                    }
                    var defaults = {
                        size: size,
                        from: 0
                    };
                    var abort = this.$q.defer();
                    var prom = this.ds.withHttpConfig({
                        timeout: abort.promise
                    }).get("", angular.extend(defaults, params)).then(function (response) {
                        return response["data"];
                    });
                    return prom;
                };
                return ReportsService;
            })();
            angular.module("reports.services", ["restangular"]).service("ReportsService", ReportsService);
        })(services = reports.services || (reports.services = {}));
    })(reports = ngApp.reports || (ngApp.reports = {}));
})(ngApp || (ngApp = {}));
