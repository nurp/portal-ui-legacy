var ngApp;
(function (ngApp) {
    var projects;
    (function (projects) {
        var controllers;
        (function (controllers) {
            var ProjectsController = (function () {
                /* @ngInject */
                function ProjectsController($scope, ProjectsService, CoreService, ProjectTableModel, $state, ProjectsState, LocationService, $filter, ProjectsGithutConfig, ProjectsGithutColumns, ProjectsGithut) {
                    var _this = this;
                    this.$scope = $scope;
                    this.ProjectsService = ProjectsService;
                    this.CoreService = CoreService;
                    this.ProjectTableModel = ProjectTableModel;
                    this.$state = $state;
                    this.ProjectsState = ProjectsState;
                    this.LocationService = LocationService;
                    this.$filter = $filter;
                    this.ProjectsGithutConfig = ProjectsGithutConfig;
                    this.ProjectsGithutColumns = ProjectsGithutColumns;
                    this.ProjectsGithut = ProjectsGithut;
                    this.tabSwitch = false;
                    this.numPrimarySites = 0;
                    CoreService.setPageTitle("Projects");
                    $scope.$on("$locationChangeSuccess", function (event, next) {
                        if (next.indexOf("projects") !== -1) {
                            _this.refresh();
                        }
                    });
                    $scope.$on("$stateChangeSuccess", function (event, toState) {
                        if (toState.name.indexOf("projects") !== -1) {
                            _this.ProjectsState.setActive("tabs", toState.name.split(".")[1], "active");
                        }
                    });
                    $scope.$on("gdc-user-reset", function () {
                        _this.refresh();
                    });
                    var data = $state.current.data || {};
                    this.ProjectsState.setActive("tabs", data.tab);
                    $scope.tableConfig = ProjectTableModel;
                    this.refresh();
                }
                ProjectsController.prototype.refresh = function () {
                    var _this = this;
                    if (!this.tabSwitch) {
                        this.ProjectsService.getProjects({
                            fields: this.ProjectTableModel.fields,
                            expand: this.ProjectTableModel.expand,
                            facets: [
                                "disease_type",
                                "program.name",
                                "project_id",
                                "primary_site",
                                "summary.experimental_strategies.experimental_strategy",
                                "summary.data_categories.data_category"
                            ],
                            size: 100
                        }).then(function (data) {
                            _this.projects = data;
                            if (_this.ProjectsState.tabs.graph.active) {
                                _this.drawGraph(_this.projects);
                            }
                            else if (_this.ProjectsState.tabs.summary.active || _this.numPrimarySites === 0) {
                                _this.numPrimarySites = _.unique(_this.projects.hits, function (project) {
                                    return project.primary_site;
                                }).length;
                            }
                        });
                    }
                    else {
                        this.tabSwitch = false;
                        if (this.ProjectsState.tabs.graph.active) {
                            this.drawGraph(this.projects);
                        }
                    }
                };
                ProjectsController.prototype.drawGraph = function (data) {
                    var githut = this.ProjectsGithut(data);
                    this.githutData = githut.data;
                    this.githutConfig = githut.config;
                };
                ProjectsController.prototype.select = function (section, tab) {
                    this.ProjectsState.setActive(section, tab);
                    this.setState(tab);
                };
                // TODO Load data lazily based on active tab
                ProjectsController.prototype.setState = function (tab) {
                    // Changing tabs and then navigating to another page
                    // will cause this to fire.
                    if (tab && (this.$state.current.name.match("projects."))) {
                        this.tabSwitch = true;
                        this.$state.go("projects." + tab, this.LocationService.search(), { inherit: false });
                    }
                };
                ProjectsController.prototype.gotoQuery = function () {
                    var stateParams = {};
                    var f = this.LocationService.filters();
                    var prefixed = {
                        "op": "and",
                        "content": _.map(f.content, function (x) { return ({
                            op: "in",
                            content: {
                                field: x.content.field.indexOf("summary") === 0 ? "files." + x.content.field.split(".")[2] : "cases.project." + x.content.field,
                                value: x.content.value
                            }
                        }); })
                    };
                    if (f) {
                        stateParams = {
                            filters: angular.toJson(prefixed)
                        };
                    }
                    this.$state.go("search.participants", stateParams, { inherit: true });
                };
                return ProjectsController;
            })();
            var ProjectController = (function () {
                /* @ngInject */
                function ProjectController(project, CoreService, AnnotationsService, ExperimentalStrategyNames, DataCategoryNames, $state, $filter) {
                    var _this = this;
                    this.project = project;
                    this.CoreService = CoreService;
                    this.AnnotationsService = AnnotationsService;
                    this.ExperimentalStrategyNames = ExperimentalStrategyNames;
                    this.DataCategoryNames = DataCategoryNames;
                    this.$state = $state;
                    this.$filter = $filter;
                    CoreService.setPageTitle("Project", project.project_id);
                    this.experimentalStrategies = _.reduce(ExperimentalStrategyNames.slice(), function (result, name) {
                        var strat = _.find(project.summary.experimental_strategies, function (item) {
                            return item.experimental_strategy.toLowerCase() === name.toLowerCase();
                        });
                        if (strat) {
                            result.push(strat);
                        }
                        return result;
                    }, []);
                    this.dataCategories = _.reduce(DataCategoryNames.slice(), function (result, name) {
                        var type = _.find(project.summary.data_categories, function (item) {
                            return item.data_category.toLowerCase() === name.toLowerCase();
                        });
                        if (type) {
                            result.push(type);
                        }
                        else {
                            result.push({
                                data_category: name,
                                file_count: 0
                            });
                        }
                        return result;
                    }, []);
                    this.expStratConfig = {
                        sortKey: "file_count",
                        showParticipant: true,
                        displayKey: "experimental_strategy",
                        defaultText: "experimental strategy",
                        pluralDefaultText: "experimental strategies",
                        hideFileSize: true,
                        tableTitle: "Case and File Counts by Experimental Strategy",
                        noResultsText: "No files or cases with Experimental Strategies",
                        state: {
                            name: "search.files"
                        },
                        filters: {
                            "default": {
                                params: {
                                    filters: function (value) {
                                        return $filter("makeFilter")([
                                            {
                                                field: "cases.project.project_id",
                                                value: [
                                                    project.project_id
                                                ]
                                            },
                                            {
                                                field: "files.experimental_strategy",
                                                value: [
                                                    value
                                                ]
                                            }
                                        ], true);
                                    }
                                }
                            }
                        }
                    };
                    this.dataCategoriesConfig = {
                        sortKey: "file_count",
                        showParticipant: true,
                        displayKey: "data_category",
                        defaultText: "data category",
                        hideFileSize: true,
                        tableTitle: "Case and File Counts by Data Category",
                        pluralDefaultText: "data categories",
                        noResultsText: "No files or cases with Data Categories",
                        state: {
                            name: "search.files"
                        },
                        filters: {
                            "default": {
                                params: {
                                    filters: function (value) {
                                        return $filter("makeFilter")([
                                            {
                                                field: "cases.project.project_id",
                                                value: [
                                                    project.project_id
                                                ]
                                            },
                                            {
                                                field: "files.data_category",
                                                value: [
                                                    value
                                                ]
                                            }
                                        ], true);
                                    }
                                }
                            }
                        }
                    };
                    AnnotationsService.getAnnotations({
                        filters: {
                            content: [
                                {
                                    content: {
                                        field: "project.project_id",
                                        value: project.project_id
                                    },
                                    op: "in"
                                }
                            ],
                            op: "and"
                        },
                        size: 0
                    }).then(function (data) {
                        _this.project.annotations = data;
                    });
                }
                return ProjectController;
            })();
            angular.module("projects.controller", [
                "projects.services",
                "core.services",
                "projects.table.model",
                "projects.githut.config",
                "annotations.services"
            ]).controller("ProjectsController", ProjectsController).controller("ProjectController", ProjectController);
        })(controllers = projects.controllers || (projects.controllers = {}));
    })(projects = ngApp.projects || (ngApp.projects = {}));
})(ngApp || (ngApp = {}));
