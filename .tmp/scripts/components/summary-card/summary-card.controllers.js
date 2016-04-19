var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var summaryCard;
        (function (summaryCard) {
            var controllers;
            (function (controllers) {
                var SummaryCardController = (function () {
                    /* @ngInject */
                    function SummaryCardController($scope, LocationService, $state) {
                        this.$scope = $scope;
                        this.LocationService = LocationService;
                        this.$state = $state;
                    }
                    SummaryCardController.prototype.addFilters = function (item, state) {
                        var params;
                        var config = this.$scope.config;
                        if (!config.filters || (!config.filters[item[config.displayKey]] && !config.filters["default"])) {
                            return;
                        }
                        if (config.filters[item[config.displayKey]]) {
                            var filters = config.filters[item[config.displayKey]];
                            params = filters.params;
                        }
                        else {
                            params = {
                                filters: config.filters["default"].params.filters(item[config.displayKey])
                            };
                        }
                        if (config.state) {
                            this.$state.go(state || config.state.name, {
                                filters: params.filters
                            }, { inherit: false });
                            return;
                        }
                        var filters = this.LocationService.filters();
                        if (!filters.content) {
                            filters.content = [];
                            filters.op = "and";
                        }
                        var newFilters = angular.fromJson(params.filters);
                        _.forEach(newFilters.content, function (filter) {
                            var oldFilter = _.find(filters.content, function (oFilter) {
                                return oFilter.content.field === filter.content.field;
                            });
                            if (oldFilter) {
                                // Playing with the idea that if attempting to add the exact same
                                // value then we should remove it as a "reverse"
                                if (!_.isEqual(oldFilter.content.value, filter.content.value)) {
                                    oldFilter.content.value.concat(filter.content.value);
                                }
                                else {
                                    filters.content.splice(filters.content.indexOf(filter), 1);
                                }
                            }
                            else {
                                filters.content.push(filter);
                            }
                        });
                        this.LocationService.setFilters(filters);
                    };
                    SummaryCardController.prototype.clearFilters = function () {
                        var _this = this;
                        var filters = this.LocationService.filters();
                        filters.content = _.reject(filters.content, function (filter) {
                            return filter.content.field === _this.$scope.config.filterKey;
                        });
                        if (filters.content.length) {
                            this.LocationService.setFilters(filters);
                            return;
                        }
                        this.LocationService.clear();
                    };
                    return SummaryCardController;
                })();
                angular.module("summaryCard.controller", [
                    "location.services"
                ]).controller("SummaryCardController", SummaryCardController);
            })(controllers = summaryCard.controllers || (summaryCard.controllers = {}));
        })(summaryCard = components.summaryCard || (components.summaryCard = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));
