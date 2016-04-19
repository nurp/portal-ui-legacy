var ngApp;
(function (ngApp) {
    var reports;
    (function (_reports) {
        var controllers;
        (function (controllers) {
            var ReportsController = (function () {
                /* @ngInject */
                function ReportsController(reports, CoreService, $scope, $timeout, ReportsGithutColumns, ReportsGithut, reportServiceExpand) {
                    this.reports = reports;
                    this.CoreService = CoreService;
                    this.$scope = $scope;
                    this.$timeout = $timeout;
                    this.ReportsGithutColumns = ReportsGithutColumns;
                    this.ReportsGithut = ReportsGithut;
                    this.reportServiceExpand = reportServiceExpand;
                    CoreService.setPageTitle("Reports");
                    var dataNoZeros = _.reject(reports.hits, function (hit) {
                        return hit.count === 0 && hit.size === 0;
                    });
                    this.byProject = this.dataNest("project_id").entries(dataNoZeros);
                    this.byDisease = this.dataNest("disease_type").entries(dataNoZeros);
                    this.byProgram = this.dataNest("program").entries(dataNoZeros);
                    this.byDataType = this.dataNest("data_type").entries(this.reduceBy(dataNoZeros, "data_types"));
                    this.bySubtype = this.dataNest("data_subtype").entries(this.reduceBy(dataNoZeros, "data_subtypes"));
                    this.byStrat = this.dataNest("experimental_strategy").entries(this.reduceBy(dataNoZeros, "experimental_strategies"));
                    this.byDataAccess = this.dataNest("access").entries(this.reduceBy(dataNoZeros, "data_access"));
                    this.byUserType = this.dataNest("user_access_type").entries(this.reduceBy(dataNoZeros, "user_access_types"));
                    this.byLocation = this.dataNest("country").entries(this.reduceBy(dataNoZeros, "countries"));
                    $timeout(function () {
                        var githut = ReportsGithut(dataNoZeros);
                        $scope.githutData = githut.data;
                        $scope.githutConfig = githut.config;
                    }, 500);
                }
                ReportsController.prototype.dataNest = function (key) {
                    return d3.nest().key(function (d) {
                        return d[key];
                    }).rollup(function (d) {
                        return {
                            file_count: d3.sum(d.map(function (x) {
                                return x.count;
                            })),
                            file_size: d3.sum(d.map(function (x) {
                                return x.size;
                            })),
                            project_name: d[0].disease_type
                        };
                    }).sortValues(function (a, b) {
                        return a.file_count - b.file_count;
                    });
                };
                ReportsController.prototype.reduceBy = function (data, key) {
                    return _.reduce(data, function (result, datum) {
                        if (datum[key]) {
                            result = result.concat(datum[key]);
                        }
                        return result;
                    }, []);
                };
                return ReportsController;
            })();
            angular.module("reports.controller", [
                "reports.services",
                "core.services",
                "reports.githut.config"
            ]).controller("ReportsController", ReportsController);
        })(controllers = _reports.controllers || (_reports.controllers = {}));
    })(reports = ngApp.reports || (ngApp.reports = {}));
})(ngApp || (ngApp = {}));
