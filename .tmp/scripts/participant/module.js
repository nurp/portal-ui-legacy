var ngApp;
(function (ngApp) {
    var participants;
    (function (participants) {
        "use strict";
        /* @ngInject */
        function participantsConfig($stateProvider) {
            $stateProvider.state("case", {
                url: "/cases/:caseId",
                controller: "ParticipantController as pc",
                templateUrl: "participant/templates/participant.html",
                resolve: {
                    participant: function ($stateParams, ParticipantsService) {
                        return ParticipantsService.getParticipant($stateParams["caseId"], {
                            fields: [
                                "case_id",
                                "submitter_id",
                                "annotations.annotation_id"
                            ],
                            expand: [
                                "clinical",
                                "files",
                                "project",
                                "project.program",
                                "summary",
                                "summary.experimental_strategies",
                                "summary.data_types",
                                "samples",
                                "samples.portions",
                                "samples.portions.analytes",
                                "samples.portions.analytes.aliquots",
                                "samples.portions.analytes.aliquots.annotations",
                                "samples.portions.analytes.annotations",
                                "samples.portions.submitter_id",
                                "samples.portions.slides",
                                "samples.portions.annotations",
                                "samples.portions.center",
                            ]
                        });
                    }
                }
            });
        }
        angular.module("ngApp.participants", [
            "participants.controller",
            "ui.router.state"
        ]).config(participantsConfig);
    })(participants = ngApp.participants || (ngApp.participants = {}));
})(ngApp || (ngApp = {}));
