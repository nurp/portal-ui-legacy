var ngApp;
(function (ngApp) {
    var annotations;
    (function (annotations) {
        var services;
        (function (services) {
            var AnnotationsService = (function () {
                /* @ngInject */
                function AnnotationsService(Restangular, LocationService, CoreService, $rootScope, $q, UserService) {
                    this.LocationService = LocationService;
                    this.CoreService = CoreService;
                    this.$rootScope = $rootScope;
                    this.$q = $q;
                    this.UserService = UserService;
                    this.ds = Restangular.all("annotations");
                }
                AnnotationsService.prototype.getAnnotation = function (id, params) {
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
                AnnotationsService.prototype.getAnnotations = function (params) {
                    var _this = this;
                    if (params === void 0) { params = {}; }
                    if (params.hasOwnProperty("fields")) {
                        params["fields"] = params["fields"].join();
                    }
                    if (params.hasOwnProperty("facets")) {
                        params["facets"] = params["facets"].join();
                    }
                    if (params.hasOwnProperty("expand")) {
                        params["expand"] = params["expand"].join();
                    }
                    var paging = angular.fromJson(this.LocationService.pagination()["annotations"]);
                    // Testing is expecting these values in URL, so this is needed.
                    paging = paging || {
                        size: 20,
                        from: 1
                    };
                    var defaults = {
                        size: paging.size,
                        from: paging.from,
                        sort: paging.sort || 'entity_type:asc',
                        filters: this.LocationService.filters()
                    };
                    defaults.filters = this.UserService.addMyProjectsFilter(defaults.filters, "annotations.project.project_id");
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
                return AnnotationsService;
            })();
            angular.module("annotations.services", [
                "restangular",
                "components.location",
                "user.services",
                "core.services"
            ]).service("AnnotationsService", AnnotationsService);
        })(services = annotations.services || (annotations.services = {}));
    })(annotations = ngApp.annotations || (ngApp.annotations = {}));
})(ngApp || (ngApp = {}));
