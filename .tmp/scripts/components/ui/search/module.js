var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var ui;
        (function (ui) {
            var search;
            (function (search) {
                angular.module("ui.search", [
                    "ui.search.directives",
                    "ui.search.controllers",
                    "components.gql"
                ]);
            })(search = ui.search || (ui.search = {}));
        })(ui = components.ui || (components.ui = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));
