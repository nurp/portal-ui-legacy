var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var xmlviewer;
        (function (xmlviewer) {
            function XMLViewer($window) {
                return {
                    restrict: "EA",
                    scope: {
                        xml: "="
                    },
                    link: function ($scope) {
                        $window.LoadXMLString("xmlViewer", $scope.xml);
                    }
                };
            }
            angular.module("components.xmlviewer", []).directive("xmlViewer", XMLViewer);
        })(xmlviewer = components.xmlviewer || (components.xmlviewer = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));
