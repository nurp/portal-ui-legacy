var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var ui;
        (function (ui) {
            var control;
            (function (control) {
                var directives;
                (function (directives) {
                    function SplitControl() {
                        return {
                            restrict: "EA",
                            scope: true,
                            replace: true,
                            transclude: true,
                            templateUrl: "components/ui/controls/templates/split-control-button.html",
                            controller: function () {
                                // Included for extensibility
                            },
                            link: function ($scope, $element, $attrs) {
                                const scope = $scope;
                                function _initListeners() {
                                    var _timeOutHandle = null;
                                    $element.focus(function () {
                                        scope.$evalAsync(function () {
                                            scope.uiControl.isOpen = true;
                                            $element.find('#' + $scope.uiControl.id).focus();
                                        });
                                        if (_timeOutHandle) {
                                            clearTimeout(_timeOutHandle);
                                            _timeOutHandle = null;
                                        }
                                    });
                                    /*$element.blur(() => {
                                        _timeOutHandle = setTimeout(() => {
                          
                                          scope.$evalAsync(() => {
                                            scope.uiControl.isOpen = false;
                                          });
                          
                                        }, 500)
                                      });*/
                                    // if (typeof scope[$attrs.isLoadingIndicatorFlag] === 'undefined') {
                                    //   $scope[$attrs.isLoadingIndicatorFlag] = false;
                                    // }
                                    scope.$watch(function () {
                                        return scope[$attrs.isLoadingIndicatorFlag];
                                    }, function (isLoading) {
                                        scope.uiControl.isLoading = isLoading;
                                    });
                                }
                                function _init() {
                                    scope.uiControl = {
                                        id: 'split-control-' + (new Date().getTime()),
                                        isOpen: false,
                                        isLoading: false,
                                        controlLabelText: $attrs.controlLabelText || 'Action Label',
                                        srLabel: $attrs.srLabel || 'Split Control',
                                        shouldSplitControl: $attrs.noSplit === 'true' ? false : true,
                                        iconClasses: $attrs.iconClasses || false
                                    };
                                    _initListeners();
                                }
                                _init();
                            }
                        };
                    }
                    function SplitControlOption() {
                        return {
                            restrict: "AE",
                            replace: true,
                            scope: true,
                            transclude: true,
                            require: "^splitControl",
                            templateUrl: "components/ui/controls/templates/split-control-option.html",
                            link: function () {
                            }
                        };
                    }
                    angular.module("ui.control.directives", []).directive("splitControl", SplitControl).directive("splitControlOption", SplitControlOption);
                })(directives = control.directives || (control.directives = {}));
            })(control = ui.control || (ui.control = {}));
        })(ui = components.ui || (components.ui = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));
