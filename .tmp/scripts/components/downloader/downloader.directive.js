var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var downloader;
        (function (downloader) {
            var directive;
            (function (directive) {
                /* @ngInject */
                function Downloader($window, $timeout, $cookies, $uibModal, notify, $rootScope, $log) {
                    const _$ = $window.jQuery;
                    const iFrameIdPrefix = '__downloader_iframe__';
                    const formIdPrefix = '__downloader_form__';
                    const getIframeResponse = function (iFrame) { return JSON.parse(iFrame.contents().find('body pre').text()); };
                    const showErrorModal = function (error) {
                        const hasWarning = _.has(error, 'warning');
                        $uibModal.open({
                            templateUrl: 'core/templates/' + (hasWarning ? 'generic-warning' : 'internal-server-error') + '.html',
                            controller: 'WarningController',
                            controllerAs: 'wc',
                            backdrop: 'static',
                            keyboard: false,
                            backdropClass: 'warning-backdrop',
                            animation: false,
                            size: 'lg',
                            resolve: {
                                warning: function () { return hasWarning ? error.warning : null; }
                            }
                        });
                    };
                    notify.config({ duration: 20000 });
                    const progressChecker = function (iFrame, cookieKey, downloadToken, inProgress, done) {
                        inProgress();
                        const waitTime = 1000; // 1 second
                        const timeoutInterval = 6;
                        var attempts = 0;
                        var timeoutPromise = null;
                        const cookieStillThere = function () { return downloadToken === $cookies.get(cookieKey); };
                        const handleError = function () {
                            const error = _.flow(_.attempt, function (e) { return _.isError(e) ? { message: 'GDC download service is currently experiencing issues.' } : e; })(_.partial(getIframeResponse, iFrame));
                            $log.error('Download failed: ', error);
                            return error;
                        };
                        const notifyScope = $rootScope.$new();
                        const finished = function () {
                            timeoutPromise = null;
                            iFrame.remove();
                            notify.closeAll();
                            notifyScope.$destroy();
                            done();
                        };
                        notifyScope.cancelDownload = function () {
                            if (timeoutPromise) {
                                $timeout.cancel(timeoutPromise);
                            }
                            finished();
                        };
                        const checker = function () {
                            if (iFrame[0].__frame__loaded) {
                                // The downloadToken cookie is removed before the server sends the response
                                if (cookieStillThere()) {
                                    const error = handleError();
                                    $cookies.remove(cookieKey);
                                    finished();
                                    showErrorModal(error);
                                }
                                else {
                                    // A download should be now initiated.
                                    finished();
                                }
                            }
                            else if (cookieStillThere()) {
                                if (++attempts % timeoutInterval === 0) {
                                    $log.warn('Download checker timed out.');
                                    notify.closeAll();
                                    notify({
                                        message: null,
                                        messageTemplate: '<span>Hang in, download generation in progress...</span><br /><br /> \
                <a data-ng-click="cancelDownload()"><i class="fa fa-times-circle-o"></i> Cancel Download</a>',
                                        container: '#notification',
                                        classes: 'alert-warning',
                                        scope: notifyScope
                                    });
                                }
                                timeoutPromise = $timeout(checker, waitTime);
                            }
                            else {
                                // In case the download is initiated without triggering the iFrame to reload
                                finished();
                            }
                        };
                        timeoutPromise = $timeout(checker, waitTime);
                    };
                    const cookielessChecker = function (iFrame, inProgress, // not used but obligated to the interface
                        done) {
                        const waitTime = 5000; // 5 seconds
                        const finished = function () {
                            iFrame.remove();
                            done();
                        };
                        var attempts = 30;
                        const checker = function () {
                            // Here we simply try to read the error message if the iFrame DOM is reloaded; for a successful download,
                            // the error message is not in the DOM therefore #getIframeResponse will return a JS error.
                            const error = _.attempt(_.partial(getIframeResponse, iFrame));
                            if (_.isError(error)) {
                                // Keep waiting until we exhaust `attempts` then we do the cleanup.
                                if (--attempts < 0) {
                                    finished();
                                }
                                else {
                                    $timeout(checker, waitTime);
                                }
                            }
                            else {
                                finished();
                                showErrorModal(error);
                            }
                        };
                        $timeout(checker, waitTime);
                    };
                    const hashString = function (s) { return s.split('').reduce(function (acc, c) { return ((acc << 5) - acc) + c.charCodeAt(0); }, 0); };
                    const toHtml = function (key, value) { return '<input type="hidden" name="' + key + '" value="' + (_.isPlainObject(value) ? JSON.stringify(value).replace(/"/g, '&quot;') : value) + '" />'; };
                    // TODO: this should probably be factored out.
                    const arrayToStringFields = ['expand', 'fields', 'facets'];
                    const arrayToStringOnFields = function (key, value, fields) { return _.includes(fields, key) ? [].concat(value).join() : value; };
                    return {
                        restrict: 'A',
                        link: function (scope, element) {
                            scope.download = function (params, apiEndpoint, target, method) {
                                if (target === void 0) { target = function () { return element; }; }
                                if (method === void 0) { method = 'GET'; }
                                const downloadToken = _.uniqueId('' + (+new Date()) + '-');
                                const iFrameId = iFrameIdPrefix + downloadToken;
                                const formId = formIdPrefix + downloadToken;
                                // a cookie value that the server will remove as a download-ready indicator
                                const cookieKey = navigator.cookieEnabled ? Math.abs(hashString(JSON.stringify(params) + downloadToken)).toString(16) : null;
                                if (cookieKey) {
                                    $cookies.put(cookieKey, downloadToken);
                                    _.assign(params, { downloadCookieKey: cookieKey });
                                }
                                const fields = _.reduce(params, function (result, value, key) {
                                    const paramValue = arrayToStringOnFields(key, value, arrayToStringFields);
                                    return result + [].concat(paramValue).reduce(function (acc, v) { return acc + toHtml(key, v); }, '');
                                }, '');
                                const formHtml = '<form method="' + method.toUpperCase() + '" id="' + formId + '" action="' + apiEndpoint + '" style="display: none">' + fields + '</form>';
                                _$('<iframe id="' + iFrameId + '" style="display: none" src="about:blank" onload="this.__frame__loaded = true;"></iframe>').appendTo('body');
                                const iFrame = _$('#' + iFrameId);
                                iFrame[0].__frame__loaded = false;
                                iFrame.ready(function () {
                                    const iFrameBody = iFrame.contents().find('body');
                                    iFrameBody.append(formHtml);
                                    const form = iFrameBody.find('#' + formId);
                                    form.submit();
                                });
                                return cookieKey ? _.partial(progressChecker, iFrame, cookieKey, downloadToken) : _.partial(cookielessChecker, iFrame);
                            };
                        }
                    };
                }
                angular.module('downloader.directive', ["cgNotify"]).directive('downloader', Downloader);
            })(directive = downloader.directive || (downloader.directive = {}));
        })(downloader = components.downloader || (components.downloader = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));
