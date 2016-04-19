var ngApp;
(function (ngApp) {
    var files;
    (function (_files) {
        var directives;
        (function (directives) {
            function DownloadButton($log, UserService, $uibModal, config) {
                return {
                    restrict: "E",
                    replace: true,
                    scope: {
                        files: "=",
                        copy: "@",
                        dlcopy: "@",
                        classes: "@",
                        icon: "@"
                    },
                    template: "<a ng-class=\"[classes || 'btn btn-primary']\" data-downloader>" + "<i class=\"fa {{icon || 'fa-download'}}\" ng-class=\"{'fa-spinner': active, 'fa-pulse': active}\"></i>" + "<span ng-if=\"copy\"><span ng-if=\"!active\">&nbsp;{{copy}}</span><span ng-if=\"active\">&nbsp;{{dlcopy}}</span></span></a>",
                    link: function ($scope, $element, $attrs) {
                        $scope.active = false;
                        const inProgress = function () {
                            $scope.active = true;
                            $attrs.$set('disabled', 'disabled');
                        };
                        const done = function () {
                            $scope.active = false;
                            $element.removeAttr('disabled');
                        };
                        const url = config.api + '/data?annotations=true&related_files=true';
                        const clickHandler = function () {
                            const files = [].concat($scope.files);
                            if (UserService.userCanDownloadFiles(files)) {
                                const params = { ids: files.map(function (f) { return f.file_id; }) };
                                const checkProgress = $scope.download(params, url, function () { return $element; }, 'POST');
                                checkProgress(inProgress, done);
                            }
                            else {
                                $log.log('Files not authorized.');
                                const template = UserService.currentUser ? 'core/templates/request-access-to-download-single.html' : 'core/templates/login-to-download-single.html';
                                $uibModal.open({
                                    templateUrl: template,
                                    controller: 'LoginToDownloadController',
                                    controllerAs: 'wc',
                                    backdrop: true,
                                    keyboard: true,
                                    animation: false,
                                    size: 'lg'
                                });
                            }
                        };
                        $element.on('click', clickHandler);
                    }
                };
            }
            function BAMSlicingButton($log, FilesService, UserService, $uibModal) {
                return {
                    restrict: "E",
                    replace: true,
                    scope: {
                        files: "=",
                        copy: "@",
                        dlcopy: "@",
                        classes: "@",
                        icon: "@"
                    },
                    template: "<a ng-class=\"[classes || 'btn btn-primary']\">" + "<i class=\"fa {{icon || 'fa-download'}}\" ng-class=\"{'fa-spinner': active, 'fa-pulse': active}\"></i>" + "<span ng-if=\"copy\"><span ng-if=\"!active\">&nbsp;{{copy}}</span><span ng-if=\"active\">&nbsp;{{dlcopy}}</span></span></a>",
                    link: function ($scope, $element, $attrs) {
                        var files = $scope.files;
                        $scope.active = false;
                        $element.on("click", function (a) {
                            if (!_.isArray(files)) {
                                files = [files];
                            }
                            if (UserService.userCanDownloadFiles(files)) {
                                $scope.active = true;
                                $attrs.$set("disabled", "disabled");
                                var turnSpinnerOff = function () {
                                    $scope.active = false;
                                    $element.removeAttr("disabled");
                                };
                                var bamModal = $uibModal.open({
                                    templateUrl: "files/templates/bam-slicing.html",
                                    controller: "BAMSlicingController",
                                    controllerAs: "bamc",
                                    backdrop: true,
                                    keyboard: true,
                                    animation: false,
                                    size: "lg",
                                    resolve: {
                                        file: function () {
                                            return _.first(files);
                                        },
                                        completeCallback: function () {
                                            return turnSpinnerOff;
                                        }
                                    }
                                });
                                bamModal.result.then(turnSpinnerOff, function (reason) {
                                    if (reason !== 'slicing') {
                                        turnSpinnerOff();
                                    }
                                });
                            }
                            else {
                                var template = UserService.currentUser ? "core/templates/request-access-to-download-single.html" : "core/templates/login-to-download-single.html";
                                $log.log("File not authorized.");
                                $uibModal.open({
                                    templateUrl: template,
                                    controller: "LoginToDownloadController",
                                    controllerAs: "wc",
                                    backdrop: true,
                                    keyboard: true,
                                    animation: false,
                                    size: "lg"
                                });
                            }
                        });
                    }
                };
            }
            angular.module("files.directives", ["restangular", "components.location", "user.services", "core.services", "ui.bootstrap", "files.controller"]).directive("downloadButton", DownloadButton).directive("bamSlicingButton", BAMSlicingButton);
        })(directives = _files.directives || (_files.directives = {}));
    })(files = ngApp.files || (ngApp.files = {}));
})(ngApp || (ngApp = {}));
