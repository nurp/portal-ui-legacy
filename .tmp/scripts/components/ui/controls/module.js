var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var ui;
        (function (ui) {
            var control;
            (function (control) {
                angular.module("ui.control", [
                    "ui.control.directives"
                ]);
            })(control = ui.control || (ui.control = {}));
        })(ui = components.ui || (components.ui = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));
