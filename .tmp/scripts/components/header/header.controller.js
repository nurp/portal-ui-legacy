var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var header;
        (function (header) {
            var controllers;
            (function (controllers) {
                var HeaderController = (function () {
                    /* @ngInject */
                    function HeaderController(gettextCatalog, CartService, $state, UserService, $uibModal, $window) {
                        this.gettextCatalog = gettextCatalog;
                        this.CartService = CartService;
                        this.$state = $state;
                        this.UserService = UserService;
                        this.$uibModal = $uibModal;
                        this.$window = $window;
                        this.isCollapsed = true;
                        this.currentLang = "en";
                        this.addedLanguages = false;
                        this.languages = {
                            "en": "English",
                            "fr": "French",
                            "es": "Spanish"
                        };
                        this.addedLanguages = !!_.keys(gettextCatalog.strings).length;
                    }
                    HeaderController.prototype.getToken = function () {
                        this.UserService.getToken();
                    };
                    HeaderController.prototype.collapse = function (event) {
                        if (event.which === 1 || event.which === 13) {
                            this.isCollapsed = true;
                        }
                    };
                    HeaderController.prototype.toggleCollapsed = function () {
                        this.isCollapsed = !this.isCollapsed;
                    };
                    HeaderController.prototype.setLanguage = function () {
                        this.gettextCatalog.setCurrentLanguage(this.currentLang);
                    };
                    HeaderController.prototype.getNumCartItems = function () {
                        return this.CartService.getFiles().length;
                    };
                    HeaderController.prototype.shouldShowOption = function (option) {
                        var showOption = true, currentState = _.get(this.$state, 'current.name', '').toLowerCase();
                        switch (option.toLowerCase()) {
                            case 'quick-search':
                                if (currentState === 'home') {
                                    showOption = false;
                                }
                                break;
                            default:
                                break;
                        }
                        return showOption;
                    };
                    return HeaderController;
                })();
                angular.module("header.controller", ["cart.services", "user.services"]).controller("HeaderController", HeaderController);
            })(controllers = header.controllers || (header.controllers = {}));
        })(header = components.header || (components.header = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));
