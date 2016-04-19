var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var quickSearch;
        (function (quickSearch) {
            var services;
            (function (services) {
                var QuickSearchService = (function () {
                    /* @ngInject */
                    function QuickSearchService($state, $uibModalStack) {
                        this.$state = $state;
                        this.$uibModalStack = $uibModalStack;
                    }
                    QuickSearchService.prototype.goTo = function (entity, id) {
                        if (this.$state.params[entity + "Id"] === id) {
                            this.$uibModalStack.dismissAll();
                            return;
                        }
                        var options = {};
                        options[entity + "Id"] = id;
                        this.$state.go(entity, options, { inherit: false });
                    };
                    return QuickSearchService;
                })();
                angular.module("quickSearch.services", [
                    "ui.bootstrap.modal"
                ]).service("QuickSearchService", QuickSearchService);
            })(services = quickSearch.services || (quickSearch.services = {}));
        })(quickSearch = components.quickSearch || (components.quickSearch = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));
