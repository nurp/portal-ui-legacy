var ngApp;
(function (ngApp) {
    var cases;
    (function (cases) {
        var directives;
        (function (directives) {
            const ExportCasesButton = function (config) { return ({
                restrict: 'E',
                replace: true,
                scope: {
                    filterKeyValues: '=',
                    fields: '=',
                    expands: '=',
                    size: '=',
                    filename: '=',
                    fileType: '@',
                    textNormal: '@',
                    textInProgress: '@',
                    styleClass: '@',
                    icon: '@',
                    ngDisabled: '=',
                },
                template: '<a ng-class="[styleClass || \'btn btn-primary\']" data-downloader> \
              <i class="fa {{icon || \'fa-download\'}}" ng-class="{\'fa-spinner\': active, \'fa-pulse\': active}" /> \
              <span ng-if="textNormal"><span ng-if="! active">&nbsp;{{ ::textNormal }}</span> \
              <span ng-if="active">&nbsp;{{ ::textInProgress }}</span></span></a>',
                link: function ($scope, $element, $attrs) {
                    const scope = $scope;
                    const inProgress = function () {
                        scope.active = true;
                        $attrs.$set('disabled', 'disabled');
                    };
                    const done = function () {
                        scope.active = false;
                        $element.removeAttr('disabled');
                    };
                    const url = config.api + '/cases';
                    const filters = {
                        op: 'and',
                        content: _.values(_.mapValues(scope.filterKeyValues, function (value, key) { return ({
                            op: 'in',
                            content: {
                                field: key,
                                value: [].concat(value)
                            }
                        }); }))
                    };
                    const params = _.merge({
                        attachment: true,
                        filters: filters,
                        fields: ['case_id'].concat(scope.fields || []).join(),
                        expand: [].concat(scope.expands || []).join(),
                        format: scope.fileType || 'JSON',
                        pretty: true,
                        size: scope.size || 10000
                    }, scope.filename ? { filename: scope.filename } : {});
                    if (!scope.ngDisabled) {
                        $element.on('click', function () {
                            const checkProgress = scope.download(params, url, function () { return $element; }, 'POST');
                            checkProgress(inProgress, done);
                        });
                    }
                    scope.active = false;
                }
            }); };
            angular.module('cases.directives', []).directive('exportCasesButton', ExportCasesButton);
        })(directives = cases.directives || (cases.directives = {}));
    })(cases = ngApp.cases || (ngApp.cases = {}));
})(ngApp || (ngApp = {}));
