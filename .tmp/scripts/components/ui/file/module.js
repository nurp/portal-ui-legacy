var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var ui;
        (function (ui) {
            var file;
            (function (file) {
                angular.module("ui.file", [
                    "file.filters"
                ]);
            })(file = ui.file || (ui.file = {}));
        })(ui = components.ui || (components.ui = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));
