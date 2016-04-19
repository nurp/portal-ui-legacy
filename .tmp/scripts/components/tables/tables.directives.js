var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var tables;
        (function (tables) {
            var directives;
            (function (directives) {
                /* @ngInject */
                function ArrangeColumns($window, UserService) {
                    return {
                        restrict: "EA",
                        scope: {
                            title: "@",
                            headings: "=",
                            saved: "="
                        },
                        replace: true,
                        templateUrl: "components/tables/templates/arrange-columns.html",
                        link: function ($scope) {
                            $scope.UserService = UserService;
                            function saveSettings() {
                                var save = _.map($scope.headings, function (h) { return _.pick(h, 'id', 'hidden', 'sort', 'order'); });
                                $window.localStorage.setItem('gdc-archive-' + $scope.title + '-col', angular.toJson(save));
                            }
                            var defaults = _.cloneDeep($scope.headings);
                            $scope.headings = $scope.saved.length ? _.map($scope.saved, function (s) { return _.merge(_.find($scope.headings, { id: s.id }), s); }) : $scope.headings;
                            $scope.restoreDefaults = function () {
                                $scope.headings = _.cloneDeep(defaults);
                            };
                            $scope.toggleVisibility = function (item) {
                                item.hidden = !item.hidden;
                                saveSettings();
                            };
                            $scope.sortOptions = {
                                orderChanged: saveSettings
                            };
                        }
                    };
                }
                function ExportTable() {
                    return {
                        restrict: "EA",
                        scope: {
                            text: "@",
                            size: "@",
                            headings: "=",
                            endpoint: "@",
                            expand: "="
                        },
                        replace: true,
                        templateUrl: "components/tables/templates/export-table.html",
                        controller: "ExportTableController as etc"
                    };
                }
                function ReportsExportTable() {
                    return {
                        restrict: "EA",
                        scope: {
                            text: "@",
                            size: "@",
                            headings: "=",
                            endpoint: "@",
                            expand: "="
                        },
                        replace: true,
                        templateUrl: "components/tables/templates/reports-export-table.html",
                        controller: "ExportTableController as etc"
                    };
                }
                function SortTable() {
                    return {
                        restrict: "EA",
                        scope: {
                            paging: "=",
                            page: "@",
                            config: '=',
                            update: "=",
                            data: "=",
                            saved: "="
                        },
                        replace: true,
                        templateUrl: "components/tables/templates/sort-table.html",
                        controller: "TableSortController as tsc"
                    };
                }
                function GDCTable() {
                    return {
                        restrict: "E",
                        scope: {
                            heading: "@",
                            data: "=",
                            config: "=",
                            paging: "=",
                            page: "@",
                            sortColumns: "=",
                            id: "@",
                            endpoint: "@",
                            clientSide: "="
                        },
                        replace: true,
                        templateUrl: "components/tables/templates/gdc-table.html",
                        controller: "GDCTableController as gtc"
                    };
                }
                angular.module("tables.directives", ["tables.controllers"]).directive("exportTable", ExportTable).directive("reportsExportTable", ReportsExportTable).directive("sortTable", SortTable).directive("gdcTable", GDCTable).directive("arrangeColumns", ArrangeColumns);
            })(directives = tables.directives || (tables.directives = {}));
        })(tables = components.tables || (components.tables = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));
