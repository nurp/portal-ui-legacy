var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var tables;
        (function (tables) {
            var pagination;
            (function (_pagination) {
                var controllers;
                (function (controllers) {
                    var PagingController = (function () {
                        /* @ngInject */
                        function PagingController($scope, LocationService) {
                            this.$scope = $scope;
                            this.LocationService = LocationService;
                        }
                        PagingController.prototype.setCount = function (event, size) {
                            this.$scope.paging.size = size;
                            this.refresh();
                        };
                        PagingController.prototype.refresh = function () {
                            var pagination = this.LocationService.pagination(), current = this.$scope.paging;
                            current.size = isNaN(current.size) || current.size <= 10 ? 10 : current.size;
                            current.from = (current.size * (current.page - 1)) + 1;
                            var obj = {
                                from: current.from,
                                size: current.size,
                                sort: current.sort
                            };
                            pagination[this.$scope.page] = obj;
                            if (!this.$scope.update) {
                                return this.LocationService.setPaging(pagination);
                            }
                        };
                        return PagingController;
                    })();
                    angular.module("pagination.controllers", ["location.services"]).controller("PagingController", PagingController);
                })(controllers = _pagination.controllers || (_pagination.controllers = {}));
            })(pagination = tables.pagination || (tables.pagination = {}));
        })(tables = components.tables || (components.tables = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));
