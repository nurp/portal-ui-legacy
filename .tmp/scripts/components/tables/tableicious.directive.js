var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var tables;
        (function (tables) {
            var directives;
            (function (directives) {
                var tableicious;
                (function (tableicious) {
                    /* @ngInject */
                    function Tableicious($filter, LocationService, UserService, $window) {
                        return {
                            restrict: "E",
                            scope: {
                                rowId: "@",
                                data: "=",
                                paging: "=",
                                headings: "=",
                                title: "@",
                                saved: "="
                            },
                            replace: true,
                            templateUrl: "components/tables/templates/tableicious.html",
                            link: function ($scope) {
                                $scope.$filter = $filter;
                                $scope.UserService = UserService;
                                $scope.LocationService = LocationService;
                                $scope.getCell = function (h, d) {
                                    return h.td(d, $scope);
                                };
                                $scope.getToolTipText = function (h, d) {
                                    return h.toolTipText ? h.toolTipText(d, $scope) : '';
                                };
                                function hasChildren(h) {
                                    return h.children && h.children.length > 0;
                                }
                                function refresh(hs) {
                                    $scope.enabledHeadings = _.reject(hs, function (h) {
                                        return h.hidden; // || (h.inactive && h.inactive($scope))
                                    });
                                    $scope.subHeaders = _.flatten(_.pluck(_.filter($scope.enabledHeadings, function (h) {
                                        return hasChildren(h);
                                    }), 'children'));
                                    $scope.dataCols = _.flatten(_.map($scope.enabledHeadings, function (h) {
                                        return hasChildren(h) ? h.children : h;
                                    }));
                                }
                                $scope.$watch('headings', function (n, o) {
                                    if (_.isEqual(n, o))
                                        return;
                                    refresh(n);
                                }, true);
                                $scope.headings = $scope.saved.length ? _.map($scope.saved, function (s) { return _.merge(_.find($scope.headings, { id: s.id }), s); }) : $scope.headings;
                                refresh($scope.headings);
                            }
                        };
                    }
                    /* @ngInject */
                    function Cell($compile) {
                        return {
                            restrict: "A",
                            scope: {
                                cell: "=",
                                row: "=",
                                data: "=",
                                paging: "="
                            },
                            link: function ($scope, element) {
                                element.html($scope.cell).show();
                                $compile(element.contents())($scope);
                            }
                        };
                    }
                    angular.module("tableicious.directive", []).directive("tableicious", Tableicious).directive("cell", Cell);
                })(tableicious = directives.tableicious || (directives.tableicious = {}));
            })(directives = tables.directives || (tables.directives = {}));
        })(tables = components.tables || (components.tables = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));
