var ngApp;
(function (ngApp) {
    var core;
    (function (core) {
        var filters;
        (function (filters) {
            var MakeFilter = (function () {
                function MakeFilter() {
                    return function (fields, noEscape) {
                        var contentArray = _.map(fields, function (item) {
                            var value;
                            if (_.isArray(item.value)) {
                                value = item.value;
                            }
                            else if (item.value) {
                                value = item.value.split(",");
                            }
                            return {
                                "op": "in",
                                "content": {
                                    "field": item.field,
                                    "value": value
                                }
                            };
                        });
                        if (contentArray.length === 0) {
                            return angular.toJson({});
                        }
                        var ret = angular.toJson({
                            "op": "and",
                            "content": contentArray
                        });
                        if (noEscape) {
                            return ret;
                        }
                        // Still unsure why this causes problems with ui-sref if the stringified
                        // JSON doesn't have quotes and other things escaped, but switching to
                        // this works in all known cases
                        return angular.toJson(ret);
                    };
                }
                return MakeFilter;
            })();
            var MakeDownloadLink = (function () {
                function MakeDownloadLink($rootScope) {
                    return function (ids, annotations, relatedFiles) {
                        if (annotations === void 0) { annotations = true; }
                        if (relatedFiles === void 0) { relatedFiles = true; }
                        var baseUrl = $rootScope.config.api;
                        ids = _.compact(ids);
                        var url = baseUrl + "/data/" + ids.join(",");
                        var flags = [];
                        if (annotations) {
                            flags.push("annotations=1");
                        }
                        if (relatedFiles) {
                            flags.push("related_files=1");
                        }
                        if (flags.length) {
                            url += "?";
                        }
                        return url + flags.join("&");
                    };
                }
                return MakeDownloadLink;
            })();
            var MakeManifestLink = (function () {
                function MakeManifestLink($rootScope) {
                    return function (ids, baseUrl) {
                        if (baseUrl === void 0) { baseUrl = $rootScope.config.api; }
                        return baseUrl + "/manifest/" + ids.join(",");
                    };
                }
                return MakeManifestLink;
            })();
            angular.module("core.filters", []).filter("makeManifestLink", MakeManifestLink).filter("makeFilter", MakeFilter).filter("makeDownloadLink", MakeDownloadLink).filter("unsafe", function ($sce, $compile) {
                return $sce.trustAsHtml;
            });
        })(filters = core.filters || (core.filters = {}));
    })(core = ngApp.core || (ngApp.core = {}));
})(ngApp || (ngApp = {}));
