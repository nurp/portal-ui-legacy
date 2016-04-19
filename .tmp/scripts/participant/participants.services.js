var ngApp;
(function (ngApp) {
    var participants;
    (function (participants) {
        var services;
        (function (services) {
            var ParticipantsService = (function () {
                /* @ngInject */
                function ParticipantsService(Restangular, LocationService, UserService, CoreService, $rootScope, $q) {
                    this.LocationService = LocationService;
                    this.UserService = UserService;
                    this.CoreService = CoreService;
                    this.$rootScope = $rootScope;
                    this.$q = $q;
                    this.ds = Restangular.all("cases");
                }
                ParticipantsService.prototype.getParticipant = function (id, params) {
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
                ParticipantsService.prototype.getParticipants = function (params, method) {
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
                    var paging = angular.fromJson(this.LocationService.pagination()["cases"]);
                    // Testing is expecting these values in URL, so this is needed.
                    paging = paging || {
                        size: 20,
                        from: 1
                    };
                    var defaults = {
                        size: paging.size,
                        from: paging.from,
                        sort: paging.sort || 'case_id:asc',
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
                return ParticipantsService;
            })();
            angular.module("participants.services", ["restangular", "components.location", "user.services", "core.services"]).service("ParticipantsService", ParticipantsService);
        })(services = participants.services || (participants.services = {}));
    })(participants = ngApp.participants || (ngApp.participants = {}));
})(ngApp || (ngApp = {}));
