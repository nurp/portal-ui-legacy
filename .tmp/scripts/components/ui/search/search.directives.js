var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var ui;
        (function (ui) {
            var search;
            (function (search) {
                var directives;
                (function (directives) {
                    /* @ngInject */
                    function SearchBar() {
                        return {
                            restrict: "E",
                            scope: true,
                            templateUrl: "components/ui/search/templates/search-bar.html",
                            controller: "SearchBarController as sb"
                        };
                    }
                    angular.module("ui.search.directives", ["ui.search.controllers"]).directive("searchBar", SearchBar);
                })(directives = search.directives || (search.directives = {}));
            })(search = ui.search || (ui.search = {}));
        })(ui = components.ui || (components.ui = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));
