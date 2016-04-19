var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var ui;
        (function (ui) {
            var countCard;
            (function (countCard) {
                angular.module("ui.count-card", [
                    "count-card.directives"
                ]);
            })(countCard = ui.countCard || (ui.countCard = {}));
        })(ui = components.ui || (components.ui = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));
