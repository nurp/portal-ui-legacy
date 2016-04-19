var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var summaryCard;
        (function (summaryCard) {
            angular.module("components.summaryCard", [
                "summaryCard.controller",
                "summaryCard.directives"
            ]);
        })(summaryCard = components.summaryCard || (components.summaryCard = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));
