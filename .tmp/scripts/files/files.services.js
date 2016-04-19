var ngApp;
(function (ngApp) {
    var files;
    (function (files) {
        var services;
        (function (services) {
            var FilesService = (function () {
                /* @ngInject */
                function FilesService(Restangular, LocationService, UserService, CoreService, $uibModal, $rootScope, $q, $filter, $window, RestFullResponse) {
                    this.Restangular = Restangular;
                    this.LocationService = LocationService;
                    this.UserService = UserService;
                    this.CoreService = CoreService;
                    this.$uibModal = $uibModal;
                    this.$rootScope = $rootScope;
                    this.$q = $q;
                    this.$filter = $filter;
                    this.$window = $window;
                    this.RestFullResponse = RestFullResponse;
                    this.ds = Restangular.all("files");
                }
                FilesService.prototype.getFile = function (id, params) {
                    if (params === void 0) { params = {}; }
                    if (params.hasOwnProperty("fields")) {
                        params["fields"] = params["fields"].join();
                    }
                    if (params.hasOwnProperty("expand")) {
                        params["expand"] = params["expand"].join();
                    }
                    return this.ds.get(id, params).then(function (response) {
                        return response["data"];
                    });
                };
                FilesService.prototype.downloadManifest = function (_ids, callback) {
                    this.download("/manifest", _ids, function (status) {
                        if (callback)
                            callback(status);
                    });
                };
                FilesService.prototype.downloadFiles = function (_ids, callback) {
                    this.download("/data", _ids, function (status) {
                        if (callback)
                            callback(status);
                    });
                };
                FilesService.prototype.download = function (endpoint, ids, callback) {
                    var _this = this;
                    var abort = this.$q.defer();
                    var params = { "ids": ids };
                    this.RestFullResponse.all(endpoint + "?annotations=true&related_files=true").withHttpConfig({
                        timeout: abort.promise,
                        responseType: "blob",
                        withCredentials: true
                    }).post(params, undefined, { 'Content-Type': 'application/json' }).then(function (response) {
                        var filename = response.headers['content-disposition'].match(/filename=(.*)/i)[1];
                        _this.$window.saveAs(response.data, filename);
                        if (callback)
                            callback(true);
                    }, function (response) {
                        //Download Failed
                        _this.$uibModal.open({
                            templateUrl: 'core/templates/download-failed.html',
                            controller: "LoginToDownloadController",
                            controllerAs: "wc",
                            backdrop: true,
                            keyboard: true,
                            animation: false,
                            size: "lg"
                        });
                        if (callback)
                            callback(false);
                    });
                };
                FilesService.prototype.processBED = function (bedTSV) {
                    if (bedTSV) {
                        var lines = bedTSV.split("\n");
                        return { "regions": _.map(lines, function (line) {
                            var region = line.split("\t");
                            var regionString = region[0];
                            if (region.length > 1) {
                                regionString += ":" + region[1];
                                if (region.length > 2) {
                                    regionString += "-" + region[2];
                                }
                            }
                            return regionString;
                        }) };
                    }
                    return {};
                };
                FilesService.prototype.sliceBAM = function (fileID, bedTSV, callback) {
                    var _this = this;
                    var abort = this.$q.defer();
                    var params = this.processBED(bedTSV);
                    this.RestFullResponse.all("/v0/slicing/view/" + fileID).withHttpConfig({
                        timeout: abort.promise,
                        responseType: "blob",
                        withCredentials: true,
                    }).post(params, undefined, { 'Content-Type': 'application/json' }).then(function (response) {
                        _this.$window.saveAs(response, fileID + '-sliced.bam');
                        if (callback)
                            callback(true);
                    }, function (response) {
                        //Slicing Failed
                        _this.$uibModal.open({
                            templateUrl: 'files/templates/bam-slicing-failed.html',
                            controller: "BAMFailedModalController",
                            controllerAs: "bamfc",
                            backdrop: true,
                            keyboard: true,
                            animation: false,
                            size: "lg",
                            resolve: {
                                errorStatus: function () {
                                    return response.status;
                                },
                                errorMsg: function () {
                                    return response.statusText;
                                },
                                errorBlob: function () {
                                    return response.data;
                                }
                            }
                        });
                        if (callback)
                            callback(false);
                    });
                };
                FilesService.prototype.getFiles = function (params, method) {
                    var _this = this;
                    if (params === void 0) { params = {}; }
                    if (method === void 0) { method = 'GET'; }
                    if (params.hasOwnProperty("fields")) {
                        params["fields"] = params["fields"].join();
                    }
                    if (params.hasOwnProperty("expand")) {
                        params["expand"] = params["expand"].join();
                    }
                    if (params.hasOwnProperty("facets")) {
                        params["facets"] = params["facets"].join();
                    }
                    var paging = angular.fromJson(this.LocationService.pagination()["files"]);
                    // Testing is expecting these values in URL, so this is needed.
                    paging = paging || {
                        size: 20,
                        from: 1
                    };
                    var defaults = {
                        size: paging.size,
                        from: paging.from,
                        sort: paging.sort || "file_name:asc",
                        filters: this.LocationService.filters()
                    };
                    if (!params.hasOwnProperty("raw")) {
                        defaults.filters = this.UserService.addMyProjectsFilter(defaults.filters, "cases.project.project_id");
                    }
                    this.CoreService.setSearchModelState(false);
                    var abort = this.$q.defer();
                    if (method === 'POST') {
                        var prom = this.ds.withHttpConfig({
                            timeout: abort.promise
                        }).post(angular.extend(defaults, params), undefined, { 'Content-Type': 'application/json' }).then(function (response) {
                            _this.CoreService.setSearchModelState(true);
                            return response["data"];
                        });
                    }
                    else {
                        var prom = this.ds.withHttpConfig({
                            timeout: abort.promise
                        }).get("", angular.extend(defaults, params)).then(function (response) {
                            _this.CoreService.setSearchModelState(true);
                            return response["data"];
                        });
                    }
                    var eventCancel = this.$rootScope.$on("gdc-cancel-request", function () {
                        abort.resolve();
                        eventCancel();
                        _this.CoreService.setSearchModelState(true);
                    });
                    return prom;
                };
                return FilesService;
            })();
            angular.module("files.services", ["restangular", "components.location", "user.services", "core.services"]).service("FilesService", FilesService);
        })(services = files.services || (files.services = {}));
    })(files = ngApp.files || (ngApp.files = {}));
})(ngApp || (ngApp = {}));
