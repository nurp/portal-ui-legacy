var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var tables;
        (function (tables) {
            var controllers;
            (function (controllers) {
                var TableSortController = (function () {
                    /* @ngInject */
                    function TableSortController($scope, LocationService, $window, LocalStorageService) {
                        this.$scope = $scope;
                        this.LocationService = LocationService;
                        this.$window = $window;
                        this.LocalStorageService = LocalStorageService;
                        this.paging = $scope.paging || { size: 20 };
                        var currentSorting = this.paging.sort || '';
                        var headings = $scope.saved.length ? _.map($scope.saved, function (s) { return _.merge(_.find($scope.config.headings, { id: s.id }), s); }) : $scope.config.headings;
                        $scope.sortColumns = _.reduce(headings, function (cols, col) {
                            if (col.sortable) {
                                var obj = {
                                    id: col.id,
                                    name: col.name,
                                    sort: false
                                };
                                if (col.sortMethod) {
                                    obj.sortMethod = col.sortMethod;
                                }
                                cols.push(obj);
                            }
                            return cols;
                        }, []);
                        // We need to manually check the URL and parse any active sorting down
                        if (currentSorting) {
                            currentSorting = currentSorting.split(",");
                            _.each(currentSorting, function (sort) {
                                var sortField = sort.split(":");
                                var sortObj = _.find($scope.sortColumns, function (col) {
                                    return col.id === sortField[0];
                                });
                                // Update the internal sorting object to have sorting from URL values applied
                                if (sortObj) {
                                    sortObj.sort = true;
                                    sortObj.order = sortField[1];
                                }
                            });
                            if ($scope.update) {
                                this.clientSorting();
                            }
                        }
                    }
                    TableSortController.prototype.clientSorting = function () {
                        var _this = this;
                        function defaultSort(a, b, order) {
                            if (order === "asc") {
                                if (isNaN(a)) {
                                    if (a < b)
                                        return -1;
                                    if (a > b)
                                        return 1;
                                    return 0;
                                }
                                else {
                                    return a - b;
                                }
                            }
                            if (order === "desc") {
                                if (isNaN(a)) {
                                    if (a > b)
                                        return -1;
                                    if (a < b)
                                        return 1;
                                    return 0;
                                }
                                else {
                                    return b - a;
                                }
                            }
                        }
                        _.forEach(this.$scope.sortColumns, function (sortValue, sortIndex) {
                            if (sortValue.sort) {
                                var order = sortValue.order || "asc";
                                _this.$scope.data.sort(function (a, b) {
                                    if (sortValue.sortMethod) {
                                        return sortValue.sortMethod(a[sortValue.id], b[sortValue.id], order);
                                    }
                                    return defaultSort(a[sortValue.id], b[sortValue.id], order);
                                });
                            }
                        });
                    };
                    TableSortController.prototype.toggleSorting = function (item) {
                        if (!item.sort) {
                            item.sort = true;
                            item.order = "asc";
                        }
                        else {
                            item.sort = false;
                        }
                        this.updateSorting();
                    };
                    TableSortController.prototype.saveToLocalStorage = function () {
                        var save = _.map(this.$scope.config.headings, function (h) { return _.pick(h, 'id', 'hidden', 'sort', 'order'); });
                        this.LocalStorageService.setItem('gdc-archive-' + this.$scope.config.title + '-col', save);
                    };
                    TableSortController.prototype.updateSorting = function () {
                        var _this = this;
                        this.saveToLocalStorage();
                        if (this.$scope.update) {
                            this.clientSorting();
                            return;
                        }
                        var pagination = this.LocationService.pagination();
                        var sortString = "";
                        _.each(this.$scope.sortColumns, function (col, index) {
                            if (col.sort) {
                                if (!col.order) {
                                    col.order = "asc";
                                }
                                sortString += col.id + ":" + col.order;
                                if (index < (_this.$scope.sortColumns.length - 1)) {
                                    sortString += ",";
                                }
                            }
                        });
                        this.paging.sort = sortString;
                        pagination[this.$scope.page] = this.paging;
                        this.LocationService.setPaging(pagination);
                    };
                    return TableSortController;
                })();
                var GDCTableController = (function () {
                    /* @ngInject */
                    function GDCTableController($scope, LocalStorageService) {
                        var _this = this;
                        this.$scope = $scope;
                        this.LocalStorageService = LocalStorageService;
                        this.sortingHeadings = [];
                        this.tableRendered = false;
                        this.sortingHeadings = _.filter($scope.config.headings, function (heading) {
                            return heading && heading.sortable;
                        });
                        $scope.$watch("data", function () {
                            _this.setDisplayedData();
                        }, true);
                        $scope.$on("tableicious-loaded", function () {
                            _this.tableRendered = true;
                        });
                        this.setDisplayedData();
                        $scope.saved = this.LocalStorageService.getItem('gdc-archive-' + $scope.config.title + '-col', []);
                    }
                    GDCTableController.prototype.setDisplayedData = function (newPaging) {
                        if (newPaging === void 0) { newPaging = this.$scope.paging; }
                        if (this.$scope.clientSide) {
                            this.$scope.paging.from = newPaging.from;
                            this.$scope.paging.size = newPaging.size;
                            this.$scope.paging.pages = Math.ceil(this.$scope.data.length / this.$scope.paging.size);
                            this.$scope.paging.total = this.$scope.data.length;
                            while (this.$scope.paging.from > this.$scope.paging.total) {
                                this.$scope.paging.page--;
                                this.$scope.paging.from -= this.$scope.paging.size;
                            }
                            // Safe fallback
                            if (this.$scope.paging.page < 0 || this.$scope.paging.from < 1) {
                                this.$scope.paging.page = 1;
                                this.$scope.paging.from = 1;
                            }
                            this.displayedData = _.assign([], this.$scope.data).splice(this.$scope.paging.from - 1, this.$scope.paging.size);
                        }
                        else {
                            this.displayedData = this.$scope.data;
                        }
                        if (this.$scope.paging)
                            this.$scope.paging.count = this.displayedData && this.displayedData.length;
                    };
                    return GDCTableController;
                })();
                var ExportTableController = (function () {
                    /* @ngInject */
                    function ExportTableController($scope, LocationService, config, $uibModal, $q, Restangular, $window, UserService, $timeout) {
                        this.$scope = $scope;
                        this.LocationService = LocationService;
                        this.config = config;
                        this.$uibModal = $uibModal;
                        this.$q = $q;
                        this.Restangular = Restangular;
                        this.$window = $window;
                        this.UserService = UserService;
                        this.$timeout = $timeout;
                        $scope.downloadInProgress = false;
                    }
                    ExportTableController.prototype.exportTable = function (fileType, download) {
                        var _this = this;
                        var projectsKeys = {
                            "files": "cases.project.project_id",
                            "cases": "project.project_id",
                            "projects": "project_id"
                        };
                        var filters = this.LocationService.filters();
                        var fieldsAndExpand = _.reduce(this.$scope.headings, function (result, field) {
                            if (!_.get(field, 'hidden', false)) {
                                if (_.get(field, 'children')) {
                                    result.expand.push(field.id);
                                }
                                else {
                                    result.fields.push(field.id);
                                }
                            }
                            return result;
                        }, { 'fields': [], 'expand': [] });
                        var url = this.LocationService.getHref();
                        var abort = this.$q.defer();
                        var modalInstance;
                        if (projectsKeys[this.$scope.endpoint]) {
                            filters = this.UserService.addMyProjectsFilter(filters, projectsKeys[this.$scope.endpoint]);
                        }
                        var params = {
                            filters: filters,
                            fields: fieldsAndExpand.fields.concat(this.$scope.fields || []).join(),
                            expand: fieldsAndExpand.expand.concat(this.$scope.expand || []).join(),
                            attachment: true,
                            format: fileType,
                            flatten: true,
                            pretty: true,
                            size: this.$scope.size
                        };
                        const inProgress = function (state) { return (function () {
                            _this.$scope.downloadInProgress = state;
                        }).bind(_this); };
                        const checkProgress = download(params, '' + this.config.api + '/' + this.$scope.endpoint, function (e) { return e.parent(); });
                        checkProgress(inProgress(true), inProgress(false));
                    };
                    return ExportTableController;
                })();
                var ExportTableModalController = (function () {
                    /* @ngInject */
                    function ExportTableModalController($uibModalInstance) {
                        this.$uibModalInstance = $uibModalInstance;
                    }
                    ExportTableModalController.prototype.cancel = function () {
                        this.$uibModalInstance.close({
                            cancel: true
                        });
                    };
                    return ExportTableModalController;
                })();
                angular.module("tables.controllers", [
                    "location.services",
                    "user.services",
                    "ngApp.core"
                ]).controller("TableSortController", TableSortController).controller("GDCTableController", GDCTableController).controller("ExportTableModalController", ExportTableModalController).controller("ExportTableController", ExportTableController);
            })(controllers = tables.controllers || (tables.controllers = {}));
        })(tables = components.tables || (components.tables = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));
