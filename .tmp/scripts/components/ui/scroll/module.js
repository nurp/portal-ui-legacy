var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var ui;
        (function (ui) {
            var scroll;
            (function (scroll) {
                angular.module("ui.scroll", [
                    "ui.scroll.scrollSpy",
                    "ui.scroll.scrollTo",
                    "ui.scroll.scrollFix"
                ]);
            })(scroll = ui.scroll || (ui.scroll = {}));
        })(ui = components.ui || (components.ui = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));
