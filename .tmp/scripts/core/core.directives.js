var ngApp;
(function (ngApp) {
    var core;
    (function (core) {
        var directives;
        (function (directives) {
            /* @ngInject */
            function loginButton(config, UserService) {
                return {
                    restrict: 'A',
                    scope: {
                        redirect: "@"
                    },
                    controller: function ($scope, $element, $window) {
                        $element.on('click', function () {
                            var redirect = config.auth;
                            var authQuery = "";
                            if ($scope.redirect) {
                                redirect += "/" + $scope.redirect;
                            }
                            if ($window.location.port) {
                                authQuery = "?next=" + ":" + $window.location.port + $window.location.pathname;
                            }
                            else {
                                authQuery = "?next=" + $window.location.pathname;
                            }
                            var win = open(redirect + authQuery, 'Auth', 'width=800, height=600');
                            var interval = setInterval(function () {
                                try {
                                    if (win.document && win.document.URL.indexOf($window.location.pathname) > -1) {
                                        var nextUrl = win.document.URL;
                                        win.close();
                                        setTimeout(function () {
                                            clearInterval(interval);
                                            UserService.login();
                                        }, 1000);
                                    }
                                    else if (!win.document) {
                                        clearInterval(interval);
                                    }
                                }
                                catch (err) {
                                    console.log(err);
                                }
                            }, 500);
                        });
                    }
                };
            }
            function logoutButton(config) {
                return {
                    restrict: 'A',
                    scope: {
                        redirect: "@"
                    },
                    controller: function ($scope, $element, $window) {
                        $element.on('click', function () {
                            var redirect = config.auth;
                            var authQuery = "";
                            if ($scope.redirect) {
                                redirect += "/" + $scope.redirect;
                            }
                            if ($window.location.port) {
                                authQuery = "?next=" + ":" + $window.location.port + $window.location.pathname;
                            }
                            else {
                                authQuery = "?next=" + $window.location.pathname;
                            }
                            var win = open(redirect + authQuery, 'Auth', 'width=800, height=600');
                            var interval = setInterval(function () {
                                var nextUrl = win.document.URL;
                                win.close();
                                setTimeout(function () {
                                    $window.location.href = nextUrl;
                                    clearInterval(interval);
                                }, 1000);
                            }, 500);
                        });
                    }
                };
            }
            angular.module("core.directives", ["ngCookies", "user.services"]).directive('loginButton', loginButton).directive('logoutButton', logoutButton);
        })(directives = core.directives || (core.directives = {}));
    })(core = ngApp.core || (ngApp.core = {}));
})(ngApp || (ngApp = {}));
