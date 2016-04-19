var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var ui;
        (function (ui) {
            var scrollFix;
            (function (scrollFix) {
                /* @ngInject */
                function ScrollFix($window) {
                    return {
                        require: "^?scrollfixTarget",
                        link: function ($scope, elm, attrs, scrollfixTarget) {
                            var top = elm[0].offsetTop, $target = scrollfixTarget && scrollfixTarget.$element || angular.element($window), entityBody = angular.element(document.querySelector(".entity-body"));
                            if (!attrs.scrollFix) {
                                attrs.scrollFix = top;
                            }
                            else if (typeof (attrs.scrollFix) === "string") {
                                // charAt is generally faster than indexOf: http://jsperf.com/indexof-vs-charat
                                if (attrs.scrollFix.charAt(0) === "-") {
                                    attrs.scrollFix = top - parseFloat(attrs.scrollFix.substr(1));
                                }
                                else if (attrs.scrollFix.charAt(0) === "+") {
                                    attrs.scrollFix = top + parseFloat(attrs.scrollFix.substr(1));
                                }
                            }
                            function onScroll() {
                                // if pageYOffset is defined use it, otherwise use other crap for IE
                                var offset;
                                if (angular.isDefined($window.pageYOffset)) {
                                    offset = $window.pageYOffset;
                                }
                                else {
                                    var iebody = (document.compatMode && document.compatMode !== "BackCompat") ? document.documentElement : document.body;
                                    offset = iebody.scrollTop;
                                }
                                if (!elm.hasClass("ui-scroll-fix") && offset > attrs.scrollFix) {
                                    elm.addClass("ui-scroll-fix");
                                    entityBody.addClass("scroll-fix-margin");
                                }
                                else if (elm.hasClass("ui-scroll-fix") && offset < attrs.scrollFix) {
                                    elm.removeClass("ui-scroll-fix");
                                    entityBody.removeClass("scroll-fix-margin");
                                }
                            }
                            $target.on("scroll", onScroll);
                            // Unbind scroll event handler when directive is removed
                            $scope.$on("$destroy", function () {
                                $target.off("scroll", onScroll);
                            });
                        }
                    };
                }
                /* @ngInject */
                function ScrollFixTarget($window) {
                    return {
                        controller: ["$element", function ($element) {
                            this.$element = $element;
                        }]
                    };
                }
                angular.module("ui.scroll.scrollFix", []).directive("scrollFix", ScrollFix).directive("scrollFixTarget", ScrollFixTarget);
            })(scrollFix = ui.scrollFix || (ui.scrollFix = {}));
        })(ui = components.ui || (components.ui = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));
