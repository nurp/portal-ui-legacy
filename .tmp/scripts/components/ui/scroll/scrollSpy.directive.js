var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var ui;
        (function (ui) {
            var scrollSpy;
            (function (scrollSpy) {
                /* @ngInject */
                function ScrollSpy($window) {
                    return {
                        restrict: "A",
                        controller: function ($scope) {
                            $scope.spies = [];
                            this.addSpy = function (spyObj) {
                                return $scope.spies.push(spyObj);
                            };
                        },
                        link: function ($scope, elem) {
                            var w;
                            w = $window.jQuery($window);
                            function scrl() {
                                var highlightSpy, pos, spy, _i, _len, _ref;
                                highlightSpy = null;
                                _ref = $scope.spies;
                                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                                    spy = _ref[_i];
                                    spy.out();
                                    pos = pos = elem.find("#" + spy.id).offset().top + 100;
                                    if (((pos - $window.scrollY) <= 65) || (pos > $window.scrollY && pos < ($window.innerHeight + $window.scrollY))) {
                                        spy.pos = pos;
                                        if (!highlightSpy) {
                                            highlightSpy = spy;
                                        }
                                        if (highlightSpy.pos < spy.pos) {
                                            highlightSpy = spy;
                                        }
                                    }
                                    else if (!$window.scrollY) {
                                        highlightSpy = null;
                                    }
                                }
                                return highlightSpy ? highlightSpy["in"]() : $scope.spies[0]["in"]();
                            }
                            w.on("scroll", scrl);
                            $scope.$on("$destroy", function () {
                                w.off("scroll", scrl);
                            });
                        }
                    };
                }
                /* @ngInject */
                function Spy() {
                    return {
                        restrict: "A",
                        require: "^scrollSpy",
                        link: function ($scope, elem, attrs, affix) {
                            return affix.addSpy({
                                id: attrs.spy,
                                "in": function () {
                                    return elem.addClass("current");
                                },
                                out: function () {
                                    return elem.removeClass("current");
                                }
                            });
                        }
                    };
                }
                angular.module("ui.scroll.scrollSpy", []).directive("scrollSpy", ScrollSpy).directive("spy", Spy);
            })(scrollSpy = ui.scrollSpy || (ui.scrollSpy = {}));
        })(ui = components.ui || (components.ui = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));
