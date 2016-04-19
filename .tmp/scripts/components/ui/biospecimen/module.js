var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var ui;
        (function (ui) {
            var biospecimen;
            (function (biospecimen) {
                angular.module("ui.biospecimen", [
                    "biospecimen.directives",
                    "biospecimen.controllers",
                    "biospecimen.services"
                ]);
            })(biospecimen = ui.biospecimen || (ui.biospecimen = {}));
        })(ui = components.ui || (components.ui = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));
