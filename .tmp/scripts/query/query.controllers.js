var ngApp;
(function (ngApp) {
    var query;
    (function (query) {
        var controllers;
        (function (controllers) {
            var QueryController = (function () {
                /* @ngInject */
                function QueryController($scope, $state, QState, CartService, SearchService, FilesService, ParticipantsService, LocationService, UserService, CoreService, SearchTableFilesModel, SearchTableParticipantsModel, SearchChartConfigs) {
                    var _this = this;
                    this.$scope = $scope;
                    this.$state = $state;
                    this.QState = QState;
                    this.CartService = CartService;
                    this.SearchService = SearchService;
                    this.FilesService = FilesService;
                    this.ParticipantsService = ParticipantsService;
                    this.LocationService = LocationService;
                    this.UserService = UserService;
                    this.CoreService = CoreService;
                    this.SearchTableFilesModel = SearchTableFilesModel;
                    this.SearchTableParticipantsModel = SearchTableParticipantsModel;
                    this.query = "";
                    this.tabSwitch = false;
                    var data = $state.current.data || {};
                    this.QState.setActive(data.tab, "active");
                    CoreService.setPageTitle("Query");
                    $scope.$on("$locationChangeSuccess", function (event, next) {
                        if (next.indexOf("query") !== -1) {
                            _this.refresh();
                        }
                    });
                    $scope.$on("gdc-user-reset", function () {
                        _this.refresh();
                    });
                    $scope.fileTableConfig = this.SearchTableFilesModel;
                    $scope.participantTableConfig = this.SearchTableParticipantsModel;
                    this.refresh();
                    this.chartConfigs = SearchChartConfigs;
                }
                QueryController.prototype.refresh = function () {
                    var _this = this;
                    if (this.tabSwitch) {
                        if (this.QState.tabs.participants.active) {
                            this.QState.setActive("participants", "hasLoadedOnce");
                        }
                        if (this.QState.tabs.files.active) {
                            this.QState.setActive("files", "hasLoadedOnce");
                        }
                        this.tabSwitch = false;
                        return;
                    }
                    this.SearchService.getSummary().then(function (data) {
                        _this.summary = data;
                    });
                    var fileOptions = {
                        fields: this.SearchTableFilesModel.fields,
                        expand: this.SearchTableFilesModel.expand
                    };
                    var participantOptions = {
                        fields: this.SearchTableParticipantsModel.fields,
                        expand: this.SearchTableParticipantsModel.expand,
                    };
                    this.FilesService.getFiles(fileOptions).then(function (data) {
                        _this.files = _this.files || {};
                        _this.files.aggregations = data.aggregations;
                        if (!_.isEqual(_this.files.hits, data.hits)) {
                            _this.files = data;
                            _this.tabSwitch = false;
                            if (_this.QState.tabs.files.active) {
                                _this.QState.setActive("files", "hasLoadedOnce");
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
                            if (_this.QState.tabs.participants.active) {
                                _this.QState.setActive("participants", "hasLoadedOnce");
                            }
                        }
                    });
                };
                // TODO Load data lazily based on active tab
                QueryController.prototype.setState = function (tab) {
                    // Changing tabs and then navigating to another page
                    // will cause this to fire.
                    if (tab && (this.$state.current.name.match("query."))) {
                        this.tabSwitch = true;
                        this.$state.go('query.' + tab, this.LocationService.search(), { inherit: false });
                    }
                };
                QueryController.prototype.isUserProject = function (file) {
                    return this.UserService.isUserProject(file);
                };
                QueryController.prototype.select = function (tab) {
                    this.QState.setActive(tab, "active");
                    this.setState(tab);
                };
                QueryController.prototype.addFilesKeyPress = function (event, type) {
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
                QueryController.prototype.addToCart = function (files) {
                    this.CartService.addFiles(files);
                };
                QueryController.prototype.removeFiles = function (files) {
                    this.CartService.remove(_.pluck(files, "file_id"));
                };
                return QueryController;
            })();
            angular.module("query.controller", [
                "query.services",
                "search.services",
                "location.services",
                "cart.services",
                "core.services",
                "participants.services",
                "search.table.files.model",
                'search.table.participants.model',
                "files.services"
            ]).controller("QueryController", QueryController);
        })(controllers = query.controllers || (query.controllers = {}));
    })(query = ngApp.query || (ngApp.query = {}));
})(ngApp || (ngApp = {}));
