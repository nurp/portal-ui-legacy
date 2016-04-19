var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var tables;
        (function (tables) {
            var pagination;
            (function (pagination) {
                var directives;
                (function (directives) {
                    /* @ngInject */
                    function PaginationControls() {
                        return {
                            restrict: "E",
                            scope: {
                                page: "@",
                                paging: "=",
                                update: "="
                            },
                            templateUrl: "components/tables/templates/pagination.html",
                            controller: "PagingController as pc"
                        };
                    }
                    /* @ngInject */
                    function PaginationHeading() {
                        return {
                            restrict: "E",
                            scope: {
                                page: "@",
                                paging: "=",
                                update: "=",
                                title: "@"
                            },
                            templateUrl: "components/tables/templates/pagination-heading.html",
                            controller: "PagingController as pc"
                        };
                    }
                    angular.module("pagination.directives", ["pagination.controllers"]).directive("paginationControls", PaginationControls).directive("paginationHeading", PaginationHeading);
                })(directives = pagination.directives || (pagination.directives = {}));
            })(pagination = tables.pagination || (tables.pagination = {}));
        })(tables = components.tables || (components.tables = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));
