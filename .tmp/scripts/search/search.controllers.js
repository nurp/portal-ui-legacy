var ngApp;
(function (ngApp) {
    var search;
    (function (search) {
        var controllers;
        (function (controllers) {
            var SearchController = (function () {
                /* @ngInject */
                function SearchController($scope, $state, SearchState, CartService, SearchService, FilesService, ParticipantsService, LocationService, UserService, CoreService, SearchTableFilesModel, SearchTableParticipantsModel, FacetsConfigService, FacetService, SearchChartConfigs) {
                    var _this = this;
                    this.$scope = $scope;
                    this.$state = $state;
                    this.SearchState = SearchState;
                    this.CartService = CartService;
                    this.SearchService = SearchService;
                    this.FilesService = FilesService;
                    this.ParticipantsService = ParticipantsService;
                    this.LocationService = LocationService;
                    this.UserService = UserService;
                    this.CoreService = CoreService;
                    this.SearchTableFilesModel = SearchTableFilesModel;
                    this.SearchTableParticipantsModel = SearchTableParticipantsModel;
                    this.FacetsConfigService = FacetsConfigService;
                    this.FacetService = FacetService;
                    this.tabSwitch = false;
                    var data = $state.current.data || {};
                    this.SearchState.setActive("tabs", data.tab, "active");
                    this.SearchState.setActive("facets", data.tab, "active");
                    CoreService.setPageTitle("Search");
                    $scope.$on("$locationChangeSuccess", function (event, next) {
                        if (next.indexOf("search") !== -1) {
                            _this.refresh();
                        }
                    });
                    $scope.$on("$stateChangeSuccess", function (event, toState) {
                        if (toState.name.indexOf("search") !== -1) {
                            _this.SearchState.setActive("tabs", toState.name.split(".")[1], "active");
                        }
                    });
                    $scope.$on("gdc-user-reset", function () {
                        _this.refresh();
                    });
                    $scope.fileTableConfig = this.SearchTableFilesModel;
                    $scope.participantTableConfig = this.SearchTableParticipantsModel;
                    this.refresh();
                    this.chartConfigs = SearchChartConfigs;
                    this.ageAtDiagnosisUnitsMap = [
                        {
                            "label": "years",
                            "conversionDivisor": 365,
                        },
                        {
                            "label": "days",
                            "conversionDivisor": 1,
                        }
                    ];
                    this.daysToDeathUnitsMap = [
                        {
                            "label": "days",
                            "conversionDivisor": 1,
                        }
                    ];
                }
                SearchController.prototype.refresh = function () {
                    var _this = this;
                    if (this.tabSwitch) {
                        if (this.SearchState.tabs.participants.active) {
                            this.SearchState.setActive("tabs", "participants", "hasLoadedOnce");
                        }
                        if (this.SearchState.tabs.files.active) {
                            this.SearchState.setActive("tabs", "files", "hasLoadedOnce");
                        }
                        this.tabSwitch = false;
                        return;
                    }
                    this.SearchService.getSummary().then(function (data) {
                        _this.summary = data;
                        _this.tabSwitch = false;
                    });
                    this.FacetsConfigService.setFields('files', this.SearchTableFilesModel.facets);
                    var fileOptions = {
                        fields: this.SearchTableFilesModel.fields,
                        expand: this.SearchTableFilesModel.expand,
                        facets: _.pluck(this.FacetsConfigService.fieldsMap['files'], 'name')
                    };
                    this.FacetsConfigService.setFields('cases', this.SearchTableParticipantsModel.facets);
                    var participantOptions = {
                        fields: this.SearchTableParticipantsModel.fields,
                        expand: this.SearchTableParticipantsModel.expand,
                        facets: _.pluck(this.FacetsConfigService.fieldsMap['cases'], 'name')
                    };
                    this.FilesService.getFiles(fileOptions).then(function (data) {
                        _this.files = _this.files || {};
                        _this.files.aggregations = data.aggregations;
                        if (!_.isEqual(_this.files.hits, data.hits)) {
                            _this.files = data;
                            _this.tabSwitch = false;
                            if (_this.SearchState.tabs.files.active) {
                                _this.SearchState.setActive("tabs", "files", "hasLoadedOnce");
                            }
                            for (var i = 0; i < _this.files.hits.length; i++) {
                                _this.files.hits[i].related_ids = _.pluck(_this.files.hits[i].related_files, "file_id");
                            }
                        }
                    });
                    this.ParticipantsService.getParticipants(participantOptions).then(function (data) {
                        _this.participants = _this.participants || {};
                        _this.participants.aggregations = data.aggregations;
                        if (!_.isEqual(_this.participants.hits, data.hits)) {
                            _this.participants = data;
                            _this.tabSwitch = false;
                            if (_this.SearchState.tabs.participants.active) {
                                _this.SearchState.setActive("tabs", "participants", "hasLoadedOnce");
                            }
                        }
                    });
                };
                SearchController.prototype.setState = function (tab) {
                    // Changing tabs and then navigating to another page
                    // will cause this to fire.
                    if (tab && (this.$state.current.name.match("search."))) {
                        this.tabSwitch = true;
                        this.$state.go("search." + tab, this.LocationService.search(), { inherit: false });
                    }
                };
                SearchController.prototype.select = function (section, tab) {
                    this.SearchState.setActive(section, tab, "active");
                    this.setState(tab);
                };
                SearchController.prototype.addFilesKeyPress = function (event, type) {
                    if (event.which === 13) {
                        if (type === "all") {
                            // TODO add filtered list of files
                            this.CartService.addFiles(this.files.hits);
                        }
                        else {
                            this.CartService.addFiles(this.files.hits);
                        }
                    }
                };
                SearchController.prototype.addToCart = function (files) {
                    this.CartService.addFiles(files);
                };
                SearchController.prototype.removeFiles = function (files) {
                    this.CartService.remove(_.pluck(files, "file_id"));
                };
                SearchController.prototype.gotoQuery = function () {
                    var stateParams = {};
                    var f = this.LocationService.filters();
                    var q = this.LocationService.filter2query(f);
                    var toTab = this.$state.current.name.split(".")[1];
                    if (q) {
                        stateParams = {
                            query: q,
                            filters: angular.toJson(f)
                        };
                    }
                    this.$state.go("query." + toTab, stateParams, { inherit: true });
                };
                return SearchController;
            })();
            angular.module("search.controller", [
                "search.services",
                "location.services",
                "cart.services",
                "core.services",
                "participants.services",
                "search.table.files.model",
                "search.table.participants.model",
                "files.services",
                "facets.services"
            ]).controller("SearchController", SearchController);
        })(controllers = search.controllers || (search.controllers = {}));
    })(search = ngApp.search || (ngApp.search = {}));
})(ngApp || (ngApp = {}));
