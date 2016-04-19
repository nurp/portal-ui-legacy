var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var location;
        (function (location) {
            var services;
            (function (services) {
                var LocationService = (function () {
                    /* @ngInject */
                    function LocationService($location, $window) {
                        this.$location = $location;
                        this.$window = $window;
                    }
                    LocationService.prototype.path = function () {
                        return this.$location.path();
                    };
                    LocationService.prototype.search = function () {
                        return this.$location.search();
                    };
                    LocationService.prototype.setSearch = function (search) {
                        var propsWithValues = _.pick(search, function (v) {
                            return !_.isEmpty(v) && v !== "{}";
                        });
                        return this.$location.search(propsWithValues);
                    };
                    LocationService.prototype.clear = function () {
                        return this.$location.search({});
                    };
                    LocationService.prototype.filters = function () {
                        // TODO error handling
                        var f = this.search().filters;
                        return f ? angular.fromJson(f) : {};
                    };
                    LocationService.prototype.setFilters = function (filters) {
                        var search = this.search();
                        if (filters) {
                            search.filters = angular.toJson(filters);
                        }
                        else {
                            delete search.filters;
                        }
                        //move the user back to pg1
                        var paging = this.pagination();
                        if (paging) {
                            _.each(paging, function (page) {
                                page.from = 0;
                            });
                            search['pagination'] = angular.toJson(paging);
                        }
                        return this.setSearch(search);
                    };
                    LocationService.prototype.query = function () {
                        // TODO error handling
                        var q = this.search().query;
                        return q ? q : "";
                    };
                    LocationService.prototype.setQuery = function (query) {
                        var search = this.search();
                        if (query) {
                            search.query = query;
                        }
                        else {
                            delete search.query;
                        }
                        return this.setSearch(search);
                    };
                    LocationService.prototype.pagination = function () {
                        var f = _.get(this.search(), "pagination", "{}");
                        return angular.fromJson(f);
                    };
                    LocationService.prototype.setPaging = function (pagination) {
                        var search = this.search();
                        if (pagination) {
                            search.pagination = angular.toJson(pagination);
                        }
                        else if (_.isEmpty(search.pagination)) {
                            delete search.pagination;
                        }
                        return this.setSearch(search);
                    };
                    LocationService.prototype.setHref = function (href) {
                        this.$window.location.href = href;
                    };
                    LocationService.prototype.getHref = function () {
                        return this.$window.location.href;
                    };
                    LocationService.prototype.filter2query = function (f) {
                        var q = _.map(f.content, function (ftr) {
                            var c = ftr.content;
                            var o = ftr.op;
                            var v = ftr.op === "in" ? angular.toJson(c.value) : c.value;
                            return [c.field, o, v].join(" ");
                        });
                        return q.join(" and ");
                    };
                    return LocationService;
                })();
                angular.module("location.services", []).service("LocationService", LocationService);
            })(services = location.services || (location.services = {}));
        })(location = components.location || (components.location = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));
