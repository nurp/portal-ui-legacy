var ngApp;
(function (ngApp) {
    var notFound;
    (function (notFound) {
        var controllers;
        (function (controllers) {
            var NotFoundController = (function () {
                /* @ngInject */
                function NotFoundController(CoreService) {
                    this.CoreService = CoreService;
                    CoreService.setPageTitle("404 - Not Found");
                }
                return NotFoundController;
            })();
            angular.module("notFound.controller", [
                "core.services"
            ]).controller("NotFoundController", NotFoundController);
        })(controllers = notFound.controllers || (notFound.controllers = {}));
    })(notFound = ngApp.notFound || (ngApp.notFound = {}));
})(ngApp || (ngApp = {}));
