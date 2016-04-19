var ngApp;
(function (ngApp) {
    var files;
    (function (files) {
        "use strict";
        /* @ngInject */
        function filesConfig($stateProvider) {
            $stateProvider.state("file", {
                url: "/files/:fileId",
                controller: "FileController as fc",
                templateUrl: "files/templates/file.html",
                resolve: {
                    file: function ($stateParams, FilesService) {
                        return FilesService.getFile($stateParams["fileId"], {
                            fields: [
                                "state",
                                "md5sum",
                                "access",
                                "data_format",
                                "data_category",
                                "data_type",
                                "data_format",
                                "file_name",
                                "file_size",
                                "file_id",
                                "platform",
                                "experimental_strategy",
                                "center.short_name",
                                "created_datetime",
                                "uploaded_datetime",
                                "cases.case_id",
                                "cases.project.project_id",
                                "annotations.annotation_id",
                                "annotations.entity_id",
                                "tags",
                                "submitter_id"
                            ],
                            expand: [
                                "archive",
                                "related_files",
                                "metadata_files",
                                "associated_entities"
                            ]
                        });
                    }
                }
            });
        }
        angular.module("ngApp.files", [
            "files.controller",
            "files.directives",
            "ui.router.state"
        ]).config(filesConfig);
    })(files = ngApp.files || (ngApp.files = {}));
})(ngApp || (ngApp = {}));
