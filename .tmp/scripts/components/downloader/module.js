var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var downloader;
        (function (downloader) {
            angular.module("components.downloader", [
                "downloader.directive"
            ]);
        })(downloader = components.downloader || (components.downloader = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));
