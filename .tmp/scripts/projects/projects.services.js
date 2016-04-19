var ngApp;
(function (ngApp) {
    var projects;
    (function (projects) {
        var services;
        (function (services) {
            var ProjectsService = (function () {
                /* @ngInject */
                function ProjectsService(Restangular, LocationService, UserService, CoreService, $rootScope, $q) {
                    this.LocationService = LocationService;
                    this.UserService = UserService;
                    this.CoreService = CoreService;
                    this.$rootScope = $rootScope;
                    this.$q = $q;
                    this.ds = Restangular.all("projects");
                }
                ProjectsService.prototype.getProject = function (id, params) {
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
                ProjectsService.prototype.getTableHeading = function () {
                    return "Case count per data type";
                };
                ProjectsService.prototype.getProjects = function (params) {
                    var _this = this;
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
                    var paging = angular.fromJson(this.LocationService.pagination()["projects"]);
                    // Testing is expecting these values in URL, so this is needed.
                    paging = paging || {
                        size: 20,
                        from: 1
                    };
                    var defaults = {
                        size: paging.size || 20,
                        from: paging.from || 1,
                        sort: paging.sort || "summary.case_count:desc",
                        filters: this.LocationService.filters()
                    };
                    defaults.filters = this.UserService.addMyProjectsFilter(defaults.filters, "project_id");
                    this.CoreService.setSearchModelState(false);
                    var abort = this.$q.defer();
                    var prom = this.ds.withHttpConfig({
                        timeout: abort.promise
                    }).get("", angular.extend(defaults, params)).then(function (response) {
                        _this.CoreService.setSearchModelState(true);
                        return response["data"];
                    });
                    var eventCancel = this.$rootScope.$on("gdc-cancel-request", function () {
                        abort.resolve();
                        eventCancel();
                        _this.CoreService.setSearchModelState(true);
                    });
                    return prom;
                };
                return ProjectsService;
            })();
            var State = (function () {
                function State() {
                    this.tabs = {
                        summary: {
                            active: false
                        },
                        table: {
                            active: false
                        },
                        graph: {
                            active: false
                        }
                    };
                }
                State.prototype.setActive = function (section, tab) {
                    if (section && tab) {
                        _.each(this[section], function (section) {
                            section.active = false;
                        });
                        this[section][tab].active = true;
                    }
                };
                return State;
            })();
            angular.module("projects.services", [
                "restangular",
                "components.location",
                "user.services"
            ]).service("ProjectsState", State).service("ProjectsService", ProjectsService);
        })(services = projects.services || (projects.services = {}));
    })(projects = ngApp.projects || (ngApp.projects = {}));
})(ngApp || (ngApp = {}));
