var ngApp;
(function (ngApp) {
    var core;
    (function (core) {
        var controllers;
        (function (controllers) {
            var CoreController = (function () {
                /* @ngInject */
                function CoreController($scope, $rootScope, CartService, notify, $location, $cookies, $uibModal) {
                    var _this = this;
                    this.$scope = $scope;
                    this.$rootScope = $rootScope;
                    this.CartService = CartService;
                    this.notify = notify;
                    this.$cookies = $cookies;
                    this.$uibModal = $uibModal;
                    this.showWarning = false;
                    // display login failed warning
                    if (_.get($location.search(), 'error') === 'You are not authorized to gdc services') {
                        var loginWarningModal = this.$uibModal.open({
                            templateUrl: "core/templates/login-failed-warning.html",
                            controller: "WarningController",
                            controllerAs: "wc",
                            backdrop: "static",
                            keyboard: false,
                            backdropClass: "warning-backdrop",
                            animation: false,
                            size: "lg"
                        });
                    }
                    if (!$cookies.get("browser-checked")) {
                        if (bowser.msie && bowser.version <= 9) {
                            var bowserWarningModal = this.$uibModal.open({
                                templateUrl: "core/templates/browser-check-warning.html",
                                controller: "WarningController",
                                controllerAs: "wc",
                                backdrop: "static",
                                keyboard: false,
                                backdropClass: "warning-backdrop",
                                animation: false,
                                size: "lg"
                            });
                            bowserWarningModal.result.then(function () {
                                _this.$cookies.put("browser-checked", "true");
                            });
                        }
                        else {
                            this.$cookies.put("browser-checked", "true");
                        }
                    }
                    if (!$cookies.get("NCI-Warning")) {
                        var modalInstance = this.$uibModal.open({
                            templateUrl: "core/templates/warning.html",
                            controller: "WarningController",
                            controllerAs: "wc",
                            backdrop: "static",
                            keyboard: false,
                            backdropClass: "warning-backdrop",
                            animation: false,
                            size: "lg"
                        });
                        modalInstance.result.then(function () {
                            _this.$cookies.put("NCI-Warning", "true");
                        });
                    }
                    $scope.$on("undo", function (event, action) {
                        if (action === "added") {
                            CartService.undoAdded();
                        }
                        else if (action === "removed") {
                            CartService.undoRemoved();
                        }
                        _this.notify.closeAll();
                    });
                    this.$rootScope.undoClicked = function (action) {
                        _this.$rootScope.$broadcast("undo", action);
                    };
                    this.$rootScope.cancelRequest = function () {
                        _this.$rootScope.$broadcast("gdc-cancel-request");
                    };
                    this.$rootScope.handleApplicationClick = function () {
                        $scope.$broadcast('application:click');
                    };
                    this.$rootScope.closeWarning = function () {
                        _this.$rootScope.showWarning = false;
                        _this.$cookies.put("NCI-Warning", "true");
                    };
                }
                return CoreController;
            })();
            var WarningController = (function () {
                /* @ngInject */
                function WarningController($uibModalInstance, warning) {
                    this.$uibModalInstance = $uibModalInstance;
                    this.warning = warning;
                }
                WarningController.prototype.acceptWarning = function () {
                    this.$uibModalInstance.close();
                };
                return WarningController;
            })();
            angular.module("core.controller", ["ngCookies", "user.services"]).controller("WarningController", WarningController).controller("CoreController", CoreController);
        })(controllers = core.controllers || (core.controllers = {}));
    })(core = ngApp.core || (ngApp.core = {}));
})(ngApp || (ngApp = {}));
