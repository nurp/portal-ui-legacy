var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var ui;
        (function (ui) {
            var biospecimen;
            (function (biospecimen) {
                var directives;
                (function (directives) {
                    /* @ngInject */
                    function Biospecimen(BiospecimenService) {
                        return {
                            restrict: "E",
                            replace: true,
                            scope: {
                                participant: "=",
                                expanded: "="
                            },
                            templateUrl: "components/ui/biospecimen/templates/biospecimen.html",
                            controller: "BiospecimenController as bc",
                            link: function ($scope, elem, attr, ctrl) {
                                $scope.searchTerm = "";
                                $scope.expandTree = function (event, doc) {
                                    if (event.which === 1 || event.which === 13) {
                                        doc.expanded = !doc.expanded;
                                        event.target.focus();
                                    }
                                };
                                $scope.expandAll = function (event, participant, expand) {
                                    BiospecimenService.expandAll(event, participant, expand);
                                };
                                $scope.search = function (searchTerm, participant) {
                                    $scope.found = BiospecimenService.search(searchTerm, participant);
                                    if ($scope.found.length) {
                                        ctrl.displayBioSpecimenDocument({ which: 1 }, $scope.found[0].entity, $scope.found[0].type);
                                        participant.biospecimenTreeExpanded = BiospecimenService.allExpanded(participant);
                                    }
                                };
                                $scope.foundBySearch = function (submitter_id) {
                                    if (submitter_id === '')
                                        return false;
                                    return ($scope.found || []).some(function (x) { return x.entity.submitter_id === submitter_id; });
                                };
                            }
                        };
                    }
                    angular.module("biospecimen.directives", ["biospecimen.controllers", "biospecimen.services"]).directive("biospecimen", Biospecimen);
                })(directives = biospecimen.directives || (biospecimen.directives = {}));
            })(biospecimen = ui.biospecimen || (ui.biospecimen = {}));
        })(ui = components.ui || (components.ui = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));
