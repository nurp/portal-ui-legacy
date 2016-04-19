var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var ui;
        (function (ui) {
            var countCard;
            (function (countCard) {
                var directives;
                (function (directives) {
                    /* @ngInject */
                    function CountCard($filter) {
                        return {
                            restrict: "E",
                            replace: true,
                            templateUrl: "components/ui/countCard/templates/card.html",
                            scope: {
                                title: "@",
                                icon: "@",
                                data: "=",
                                sref: "@"
                            }
                        };
                    }
                    angular.module("count-card.directives", []).directive("countCard", CountCard);
                })(directives = countCard.directives || (countCard.directives = {}));
            })(countCard = ui.countCard || (ui.countCard = {}));
        })(ui = components.ui || (components.ui = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));
