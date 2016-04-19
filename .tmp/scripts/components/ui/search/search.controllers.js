var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var ui;
        (function (ui) {
            var search;
            (function (search) {
                var controllers;
                (function (controllers) {
                    var SearchBarController = (function () {
                        /* @ngInject */
                        function SearchBarController($scope, LocationService, $state) {
                            var _this = this;
                            this.$scope = $scope;
                            this.LocationService = LocationService;
                            this.$state = $state;
                            this.gql = null;
                            this.query = "";
                            this.Error = null;
                            $scope.$watch("query", function () {
                                if (!_this.query) {
                                    _this.LocationService.setQuery();
                                }
                            });
                            this.setQuery();
                        }
                        SearchBarController.prototype.sendQuery = function () {
                            this.LocationService.setSearch({
                                query: this.query,
                                filters: angular.toJson({ "op": "and", "content": [this.gql.filters] })
                            });
                        };
                        SearchBarController.prototype.setQuery = function () {
                            var currentQuery = this.LocationService.query();
                            if (typeof currentQuery === "string") {
                                this.query = currentQuery;
                            }
                        };
                        SearchBarController.prototype.resetQuery = function () {
                            this.LocationService.clear();
                            this.query = "";
                            this.gql = null;
                            this.Error = null;
                        };
                        return SearchBarController;
                    })();
                    angular.module("ui.search.controllers", []).controller("SearchBarController", SearchBarController);
                })(controllers = search.controllers || (search.controllers = {}));
            })(search = ui.search || (ui.search = {}));
        })(ui = components.ui || (components.ui = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));
