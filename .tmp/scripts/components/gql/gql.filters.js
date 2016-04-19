var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var gql;
        (function (gql) {
            var filters;
            (function (filters) {
                var GqlHighlight = (function () {
                    function GqlHighlight() {
                        return function (value, query) {
                            return value.replace(query, '<strong>' + query + '</strong>');
                        };
                    }
                    return GqlHighlight;
                })();
                angular.module("gql.filters", []).filter("gqlHighlight", GqlHighlight);
            })(filters = gql.filters || (gql.filters = {}));
        })(gql = components.gql || (components.gql = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));
