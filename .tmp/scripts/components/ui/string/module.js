var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var ui;
        (function (ui) {
            var string;
            (function (string) {
                angular.module("ui.string", [
                    "string.filters"
                ]);
            })(string = ui.string || (ui.string = {}));
        })(ui = components.ui || (components.ui = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));
