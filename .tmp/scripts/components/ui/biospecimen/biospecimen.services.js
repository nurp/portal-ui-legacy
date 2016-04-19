var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var ui;
        (function (ui) {
            var biospecimen;
            (function (biospecimen) {
                var services;
                (function (services) {
                    var BiospecimenService = (function () {
                        function BiospecimenService() {
                            this.hierarchy = [
                                [{ s: "sample", p: "samples" }],
                                [{ s: "portion", p: "portions" }],
                                [{ s: "slide", p: "slides" }, { s: "analyte", p: "analytes" }],
                                [{ s: "aliquot", p: "aliquots" }]
                            ];
                        }
                        BiospecimenService.prototype.expandAll = function (event, participant, expand) {
                            var self = this;
                            participant.biospecimenTreeExpanded = expand;
                            if (event.which === 1 || event.which === 13) {
                                (function expandAll(entity, depth) {
                                    if (depth === self.hierarchy.length)
                                        return;
                                    self.hierarchy[depth].forEach(function (type) {
                                        (entity[type.p] || []).expanded = entity.expanded = expand;
                                        (entity[type.p] || []).forEach(function (entity) { return expandAll(entity, depth + 1); });
                                    });
                                })(participant, 0);
                            }
                            return participant;
                        };
                        BiospecimenService.prototype.allExpanded = function (participant) {
                            var self = this;
                            return (function allExpanded(entity, depth) {
                                if (depth === self.hierarchy.length)
                                    return true;
                                return self.hierarchy[depth].every(function (type) {
                                    if (entity[type.p]) {
                                        return (entity[type.p] || []).expanded && entity.expanded && (entity[type.p] || []).every(function (entity) { return allExpanded(entity, depth + 1); });
                                    }
                                    else
                                        return entity.expanded;
                                });
                            })(participant, 0);
                        };
                        BiospecimenService.prototype.search = function (searchTerm, participant) {
                            var self = this;
                            var found = [];
                            var loweredSearchTerm = searchTerm.toLowerCase();
                            function search(entity, type, parents, depth) {
                                if (depth === self.hierarchy.length + 1)
                                    return;
                                if ((entity.submitter_id || '').toLowerCase().indexOf(loweredSearchTerm) > -1) {
                                    parents.forEach(function (p) { return p.expanded = true; });
                                    entity.expanded = true;
                                    found.push({ entity: entity, type: type });
                                }
                                (self.hierarchy[depth] || []).forEach(function (type) {
                                    (entity[type.p] || []).forEach(function (child) {
                                        search(child, type.s, [entity[type.p], entity].concat(parents), depth + 1);
                                    });
                                });
                            }
                            (participant.samples || []).forEach(function (sample) { return search(sample, 'sample', [participant.samples], 1); });
                            return found;
                        };
                        return BiospecimenService;
                    })();
                    angular.module("biospecimen.services", []).service("BiospecimenService", BiospecimenService);
                })(services = biospecimen.services || (biospecimen.services = {}));
            })(biospecimen = ui.biospecimen || (ui.biospecimen = {}));
        })(ui = components.ui || (components.ui = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));
