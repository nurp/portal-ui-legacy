var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var githut;
        (function (githut) {
            /* @ngInject */
            function GitHut() {
                return {
                    restrict: "AE",
                    scope: {
                        config: "=",
                        data: "="
                    },
                    replace: true,
                    templateUrl: "components/githut/templates/graph.html",
                    controller: "GitHutController as ghc"
                };
            }
            angular.module("components.githut", ["githut.controllers"]).directive("gitHut", GitHut);
        })(githut = components.githut || (components.githut = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));
