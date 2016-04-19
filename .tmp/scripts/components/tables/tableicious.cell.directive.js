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
                    function tableiciousCell($log) {
                        return {
                            restrict: "AE",
                            controller: function ($scope, $element, $compile, $filter, TableService, UserService) {
                                function doCompile() {
                                    if ($scope.heading.compile) {
                                        $element.empty();
                                        $scope.row = $scope.$parent.datum;
                                        var htm;
                                        try {
                                            htm = $scope.heading.compile($scope);
                                        }
                                        catch (e) {
                                            htm = '<span>?</span>';
                                            $log.error(e);
                                        }
                                        var compiled = $compile(htm)($scope);
                                        $element.append(compiled);
                                    }
                                    $scope.UserService = UserService;
                                }
                                _.defer(function () {
                                    doCompile();
                                    $scope.$watch(function (scope) {
                                        return scope.$parent.datum;
                                    }, function () {
                                        doCompile();
                                    }, true);
                                });
                            }
                        };
                    }
                    angular.module("tableicious.directive.cell", []).directive("tableiciousCell", tableiciousCell);
                })(tableicious = directives.tableicious || (directives.tableicious = {}));
            })(directives = tables.directives || (tables.directives = {}));
        })(tables = components.tables || (components.tables = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));
