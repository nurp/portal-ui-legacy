var ngApp;
(function (ngApp) {
    var home;
    (function (home) {
        var services;
        (function (services) {
            var HomeService = (function () {
                /* @ngInject */
                function HomeService(Restangular, ReportsService, LocationService, $rootScope, $q) {
                    this.ReportsService = ReportsService;
                    this.LocationService = LocationService;
                    this.$rootScope = $rootScope;
                    this.$q = $q;
                    this.projectsDataSource = Restangular.all("projects");
                    this.participantsDataSource = Restangular.all("cases");
                    this.filesDataStore = Restangular.all("files");
                }
                HomeService.prototype.prepParams = function (params) {
                    if (params === void 0) { params = {}; }
                    var p = _.cloneDeep(params);
                    if (_.has(p, "fields")) {
                        p["fields"] = p["fields"].join();
                    }
                    if (_.has(p, "expand")) {
                        p["expand"] = p["expand"].join();
                    }
                    if (_.has(params, "facets")) {
                        p["facets"] = p["facets"].join();
                    }
                    return p;
                };
                HomeService.prototype.getProjects = function (params) {
                    if (params === void 0) { params = {}; }
                    var params = this.prepParams(params);
                    // Testing is expecting these values in URL, so this is needed.
                    var paging = params.paging || {
                        size: 20,
                        from: 1
                    };
                    var defaults = {
                        size: params.size || paging.size,
                        from: params.from || paging.from,
                        sort: paging.sort || "summary.case_count:desc",
                        filters: params.filters || this.LocationService.filters()
                    };
                    var abort = this.$q.defer();
                    var prom = this.projectsDataSource.withHttpConfig({
                        timeout: abort.promise
                    }).get("", angular.extend(defaults, params)).then(function (response) {
                        return response["data"];
                    });
                    var eventCancel = this.$rootScope.$on("gdc-cancel-request", function () {
                        abort.resolve();
                        eventCancel();
                    });
                    return prom;
                };
                HomeService.prototype.getParticipants = function (params) {
                    if (params === void 0) { params = {}; }
                    var params = this.prepParams(params);
                    // Testing is expecting these values in URL, so this is needed.
                    var paging = params.paging || {
                        size: 20,
                        from: 1
                    };
                    var defaults = {
                        size: paging.size,
                        from: paging.from,
                        sort: paging.sort || 'case_id:asc',
                        filters: params.filters || this.LocationService.filters()
                    };
                    var abort = this.$q.defer();
                    var prom = this.participantsDataSource.withHttpConfig({
                        timeout: abort.promise
                    }).get("", angular.extend(defaults, params)).then(function (response) {
                        return response["data"];
                    });
                    var eventCancel = this.$rootScope.$on("gdc-cancel-request", function () {
                        abort.resolve();
                        eventCancel();
                    });
                    return prom;
                };
                HomeService.prototype.getFiles = function (params) {
                    if (params === void 0) { params = {}; }
                    var params = this.prepParams(params);
                    // Testing is expecting these values in URL, so this is needed.
                    var paging = params.paging || {
                        size: 20,
                        from: 1
                    };
                    var defaults = {
                        size: paging.size,
                        from: paging.from,
                        sort: paging.sort || "file_name:asc",
                        filters: params.filters || this.LocationService.filters()
                    };
                    var abort = this.$q.defer();
                    var prom = this.filesDataStore.withHttpConfig({
                        timeout: abort.promise
                    }).get("", angular.extend(defaults, params)).then(function (response) {
                        return response["data"];
                    });
                    var eventCancel = this.$rootScope.$on("gdc-cancel-request", function () {
                        abort.resolve();
                        eventCancel();
                    });
                    return prom;
                };
                HomeService.prototype.getReports = function (params) {
                    if (params === void 0) { params = {}; }
                    var defaultOptions = {
                        expand: [
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
                        ]
                    }, options = {};
                    _.assign(options, defaultOptions, params);
                    return this.ReportsService.getReports(options);
                };
                return HomeService;
            })();
            angular.module("home.services", ["reports.services"]).service("HomeService", HomeService);
        })(services = home.services || (home.services = {}));
    })(home = ngApp.home || (ngApp.home = {}));
})(ngApp || (ngApp = {}));
