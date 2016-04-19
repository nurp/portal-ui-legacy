var ngApp;
(function (ngApp) {
    var cart;
    (function (cart) {
        "use strict";
        function cartConfig($stateProvider) {
            $stateProvider.state("cart", {
                url: "/cart",
                controller: "CartController as cc",
                templateUrl: "cart/templates/cart.html",
                resolve: {
                    files: function (CartService) {
                        return CartService.getFiles();
                    }
                }
            });
        }
        angular.module("ngApp.cart", [
            "cart.controller",
            "cart.services",
            "cart.directives",
            "ngApp.files",
            "ui.router.state",
            "ui.bootstrap"
        ]).config(cartConfig);
    })(cart = ngApp.cart || (ngApp.cart = {}));
})(ngApp || (ngApp = {}));
