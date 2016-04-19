var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var facets;
        (function (facets) {
            var directives;
            (function (directives) {
                /* @ngInject */
                function Terms(ProjectsService) {
                    return {
                        restrict: "E",
                        scope: {
                            facet: "=",
                            collapsed: "@",
                            expanded: "@",
                            displayCount: "@",
                            title: "@",
                            name: "@",
                            removeFunction: "&",
                            removable: "@"
                        },
                        replace: true,
                        templateUrl: "components/facets/templates/facet.html",
                        controller: "termsCtrl as tc",
                        link: function ($scope, elem, attr, ctrl) {
                            $scope.ProjectsService = ProjectsService;
                            $scope.add = function (facet, term, event) {
                                if (event.which === 13) {
                                    elem.closest(".list-group").focus();
                                    ctrl.add(facet, term);
                                }
                            };
                            $scope.remove = function (facet, term, event) {
                                if (event.which === 13) {
                                    elem.closest(".list-group").focus();
                                    ctrl.remove(facet, term);
                                }
                            };
                        }
                    };
                }
                /* @ngInject */
                function FacetsFreeText() {
                    return {
                        restrict: "EA",
                        scope: {
                            title: "@",
                            placeholder: "@",
                            field: "@",
                            entity: "@",
                            template: "@",
                            autocomplete: "@"
                        },
                        replace: true,
                        templateUrl: "components/facets/templates/facets-free-text.html",
                        controller: "freeTextCtrl as ftc"
                    };
                }
                /* @ngInject */
                function FacetsPrefix() {
                    return {
                        restrict: "EA",
                        scope: {
                            title: "@",
                            placeholder: "@",
                            field: "@",
                            entity: "@",
                            template: "@",
                            autocomplete: "@"
                        },
                        replace: true,
                        templateUrl: "components/facets/templates/facets-prefix.html",
                        controller: "freeTextCtrl as ftc"
                    };
                }
                /* @ngInject */
                function DateFacet() {
                    return {
                        restrict: "EA",
                        scope: {
                            title: "@",
                            name: "@",
                            collapsed: '@',
                            removable: '@',
                            removeFunction: '&'
                        },
                        replace: true,
                        templateUrl: "components/facets/templates/facets-date.html",
                        controller: "dateFacetCtrl as dfc"
                    };
                }
                /* @ngInject */
                function RangeFacet() {
                    return {
                        restrict: "E",
                        scope: {
                            collapsed: '@',
                            facet: "=",
                            title: "@",
                            field: "@",
                            unitsMap: "=",
                            hasGraph: "@",
                            removable: "@",
                            removeFunction: "&",
                        },
                        replace: true,
                        templateUrl: "components/facets/templates/range-facet.html",
                        controller: "rangeFacetCtrl as rfc"
                    };
                }
                /* @ngInject */
                function AddCustomFacetsPanel($uibModal, $uibModalStack) {
                    return {
                        restrict: "E",
                        scope: {
                            docType: "@",
                            aggregations: "="
                        },
                        templateUrl: "components/facets/templates/add-custom-facets-panel.html",
                        controller: "addCustomFacetsPanelController as acfc"
                    };
                }
                /* @ngInject */
                function CurrentFilters() {
                    return {
                        restrict: "E",
                        controller: "currentFiltersCtrl as cfc",
                        templateUrl: "components/facets/templates/current.html"
                    };
                }
                /* @ngInject */
                function FacetsSection(FacetService, FacetsConfigService) {
                    return {
                        restrict: "E",
                        templateUrl: "components/facets/templates/facets-section.html",
                        scope: {
                            doctype: "@",
                            aggregations: "="
                        },
                        link: function ($scope) {
                            $scope.$watch(function () {
                                return FacetsConfigService.fieldsMap[$scope.doctype];
                            }, function (config) {
                                $scope.facetsConfig = config;
                            });
                            $scope.facetsConfig = FacetsConfigService.fieldsMap[$scope.doctype];
                            $scope.removeFacet = function (name) {
                                FacetsConfigService.removeField($scope.doctype, name);
                                FacetService.removeTerm($scope.doctype + "." + name);
                            };
                        }
                    };
                }
                angular.module("facets.directives", ["facets.controllers", "facets.services"]).directive("terms", Terms).directive("currentFilters", CurrentFilters).directive("rangeFacet", RangeFacet).directive("dateFacet", DateFacet).directive("addCustomFacetsPanel", AddCustomFacetsPanel).directive("facetsSection", FacetsSection).directive("facetsFreeText", FacetsFreeText).directive("facetsPrefix", FacetsPrefix);
            })(directives = facets.directives || (facets.directives = {}));
        })(facets = components.facets || (components.facets = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));
