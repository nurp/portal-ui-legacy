var ngApp;
(function (ngApp) {
    var home;
    (function (home) {
        var controllers;
        (function (controllers) {
            /*
            export interface IHomeScope extends ng.IScope {
            }*/
            var HomeController = (function () {
                /* @ngInject */
                function HomeController(HomeService, ProjectTableModel, CoreService, $filter) {
                    this.HomeService = HomeService;
                    this.ProjectTableModel = ProjectTableModel;
                    this.CoreService = CoreService;
                    this.$filter = $filter;
                    CoreService.setPageTitle("Welcome to The Genomics Data Commons Data Portal");
                    this.numberFilter = $filter("number");
                    this.tooltipFn = _.bind(function (d) {
                        var str = "";
                        if (arguments.length === 0) {
                            return str;
                        }
                        str = "<h4>" + d._key + "</h4>\n<p>" + this.numberFilter(d._count) + " cases (" + this.numberFilter(d.fileCount) + " files)\n" + "</p>";
                        return str;
                    }, this);
                    this.projectStatsList = [
                        { title: "Projects", value: 0, icon: "icon-gdc-projects", url: "/projects/t" },
                        { title: "Cases", value: 0, icon: "icon-gdc-cases", url: "/search/c" },
                        { title: "Files", value: 0, icon: "fa fa-file-o", url: "/search/f" },
                        { title: "Primary Sites", value: 0, icon: "cancer_type_hardcode", url: "/projects/t" },
                        { title: "Downloads to Date", value: 0, icon: "fa fa-download", url: "/reports/data-download-statistics" }
                    ];
                    this.projectStatsOrdering = { projects: 0, cases: 1, files: 2, cancerTypes: 3, downloads: 4 };
                    this.exampleSearchQueries = [
                        {
                            description: "Brain cancer cases over the age of 40 at diagnosis",
                            filters: { "op": "and", "content": [{ "op": "in", "content": { "field": "cases.project.primary_site", "value": ["Brain"] } }, { "op": ">=", "content": { "field": "cases.clinical.age_at_diagnosis", "value": [14965] } }] },
                            caseCount: null,
                            fileCount: null
                        },
                        {
                            description: "All female cases from the TARGET-NBL project",
                            filters: { "op": "and", "content": [{ "op": "in", "content": { "field": "cases.project.project_id", "value": ["TARGET-NBL"] } }, { "op": "in", "content": { "field": "cases.clinical.gender", "value": ["female"] } }] },
                            caseCount: null,
                            fileCount: null
                        },
                        {
                            description: "All Asian cases with disease type Thyroid Carcinoma",
                            filters: { "op": "and", "content": [{ "op": "in", "content": { "field": "cases.project.disease_type", "value": ["Thyroid Carcinoma"] } }, { "op": "in", "content": { "field": "cases.clinical.race", "value": ["asian"] } }] },
                            caseCount: null,
                            fileCount: null
                        },
                    ];
                    this.defaultParams = {
                        fields: this.ProjectTableModel.fields,
                        expand: this.ProjectTableModel.expand,
                        facets: [
                            "disease_type",
                            "program.name",
                            "project_id",
                            "primary_site",
                            "summary.experimental_strategies.experimental_strategy",
                            "summary.data_types.data_type"
                        ],
                        size: 100
                    };
                    this.refresh();
                }
                HomeController.prototype.fetchExampleSearchQueryStats = function () {
                    var _controller = this, exampleQueries = _controller.exampleSearchQueries, defaultParams = _controller.defaultParams;
                    for (var i = 0; i < exampleQueries.length; i++) {
                        var query = exampleQueries[i];
                        (function (q) {
                            var params = _.cloneDeep(defaultParams);
                            params.filters = q.filters;
                            _controller.HomeService.getParticipants(params).then(function (projectData) {
                                q.caseCount = _.get(projectData, 'pagination.total', 0);
                            });
                            _controller.HomeService.getFiles(params).then(function (projectData) {
                                q.fileCount = _.get(projectData, 'pagination.total', 0);
                            });
                        })(query);
                    }
                };
                HomeController.prototype.getExampleSearchQueries = function () {
                    return this.exampleSearchQueries;
                };
                HomeController.prototype.transformProjectData = function (data) {
                    var _controller = this, hits = _.get(data, 'hits', false);
                    if (!hits) {
                        return;
                    }
                    // reduce the array keyed on projectID
                    var primarySites = _.reduce(hits, function (primarySiteData, project) {
                        var primarySite = project.primary_site;
                        _controller.projectStatsList[_controller.projectStatsOrdering.projects].value += 1;
                        if (!primarySite) {
                            console.warn("Project has no primary site using project id instead: ", project);
                            primarySite = project.project_id;
                        }
                        if (!_.isArray(primarySiteData[primarySite])) {
                            primarySiteData[primarySite] = [];
                        }
                        primarySiteData[primarySite].push(project);
                        return primarySiteData;
                    }, {});
                    var primarySiteIDs = _.keys(primarySites);
                    if (primarySiteIDs.length === 0) {
                        return;
                    }
                    _controller.projectChartData = _.filter(_.map(primarySiteIDs, function (pID) {
                        var primarySiteData = primarySites[pID], caseCount = 0, fileCount = 0;
                        for (var i = 0; i < primarySiteData.length; i++) {
                            caseCount += +(_.get(primarySiteData[i], 'summary.case_count', 0));
                            fileCount += +(_.get(primarySiteData[i], 'summary.file_count', 0));
                        }
                        _controller.projectStatsList[_controller.projectStatsOrdering.cases].value += caseCount;
                        _controller.projectStatsList[_controller.projectStatsOrdering.files].value += fileCount;
                        /* _key and _count are required data properties for the marked bar chart */
                        return { _key: pID, values: primarySiteData, _count: caseCount, fileCount: fileCount };
                    }), function (d) {
                        return d._count > 0;
                    });
                    _controller.projectStatsList[_controller.projectStatsOrdering.cancerTypes].value += primarySiteIDs.length;
                    console.log(_controller.projectStatsList);
                };
                HomeController.prototype.getChartFilteredData = function () {
                    return this.projectChartData;
                };
                HomeController.prototype.getChartTooltipFunction = function () {
                    return this.tooltipFn;
                };
                HomeController.prototype.setChartDataFilter = function () {
                };
                HomeController.prototype.getProjectStatsList = function () {
                    return this.projectStatsList;
                };
                HomeController.prototype.getProjects = function (filters) {
                    if (filters === void 0) { filters = null; }
                    var params = this.defaultParams;
                    if (filters) {
                        params.filters = filters;
                    }
                    return this.HomeService.getProjects(params);
                };
                HomeController.prototype.fetchAllStatsData = function () {
                    var _controller = this;
                    _controller.getProjects().then(function (projectData) {
                        _controller.projectData = projectData;
                        _controller.chartData = _controller.transformProjectData(projectData);
                    }).then(function () {
                        _controller.fetchReportData({ size: _controller.projectStatsList[_controller.projectStatsOrdering.projects].value });
                    });
                };
                HomeController.prototype.fetchReportData = function (params) {
                    if (params === void 0) { params = {}; }
                    var _controller = this;
                    _controller.HomeService.getReports(params).then(function (reportData) {
                        var hits = _.get(reportData, 'hits', false);
                        if (!hits) {
                            return;
                        }
                        _controller.projectStatsList[_controller.projectStatsOrdering.downloads].value = 0;
                        _controller.projectStatsList[_controller.projectStatsOrdering.downloads].value = _.reduce(hits, function (total, hit) {
                            return total + parseInt(_.get(hit, "count", 0));
                        }, 0);
                    });
                };
                HomeController.prototype.refresh = function () {
                    this.fetchExampleSearchQueryStats();
                    this.fetchAllStatsData();
                };
                return HomeController;
            })();
            angular.module("home.controller", []).controller("HomeController", HomeController);
        })(controllers = home.controllers || (home.controllers = {}));
    })(home = ngApp.home || (ngApp.home = {}));
})(ngApp || (ngApp = {}));
