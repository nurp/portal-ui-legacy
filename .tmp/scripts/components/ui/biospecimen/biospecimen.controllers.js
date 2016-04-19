var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var ui;
        (function (ui) {
            var biospecimen;
            (function (biospecimen) {
                var controllers;
                (function (controllers) {
                    var BiospecimenController = (function () {
                        /* @ngInject */
                        function BiospecimenController(LocationService, config, $scope) {
                            this.LocationService = LocationService;
                            this.config = config;
                            $scope.participant.samples.expanded = true;
                            this.activeBioSpecimenDoc = $scope.participant.samples[0];
                            this.activeBioSpecimenDocType = "sample";
                            this.bioSpecimenFile = _.find($scope.participant.files, function (file) {
                                return file.data_subtype.toLowerCase() === "biospecimen data";
                            });
                        }
                        BiospecimenController.prototype.displayBioSpecimenDocument = function (event, doc, type) {
                            if (event.which === 1 || event.which === 13) {
                                this.activeBioSpecimenDocType = type;
                                this.activeBioSpecimenDoc = doc;
                            }
                        };
                        BiospecimenController.prototype.displayBioSpecimenDocumentRow = function (key, value) {
                            if (key.toLowerCase() === "expanded") {
                                return false;
                            }
                            if (key.toLowerCase() === "submitter_id") {
                                return false;
                            }
                            if (key === this.activeBioSpecimenDocType + "_id") {
                                return false;
                            }
                            return true;
                        };
                        BiospecimenController.prototype.displayBioSpecimenDocumentRowValue = function (key, value) {
                            if (_.isArray(value)) {
                                return value.length;
                            }
                            if (_.isObject(value)) {
                                return value.name;
                            }
                            if (!value && (!isNaN(value) && value !== 0)) {
                                return "--";
                            }
                            return value;
                        };
                        return BiospecimenController;
                    })();
                    angular.module("biospecimen.controllers", []).controller("BiospecimenController", BiospecimenController);
                })(controllers = biospecimen.controllers || (biospecimen.controllers = {}));
            })(biospecimen = ui.biospecimen || (ui.biospecimen = {}));
        })(ui = components.ui || (components.ui = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));
