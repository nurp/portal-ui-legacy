var ngApp;
(function (ngApp) {
    var annotations;
    (function (annotations) {
        var controllers;
        (function (controllers) {
            var AnnotationsController = (function () {
                /* @ngInject */
                function AnnotationsController($scope, AnnotationsService, CoreService, AnnotationsTableModel) {
                    var _this = this;
                    this.$scope = $scope;
                    this.AnnotationsService = AnnotationsService;
                    this.CoreService = CoreService;
                    this.AnnotationsTableModel = AnnotationsTableModel;
                    CoreService.setPageTitle("Annotations");
                    $scope.$on("$locationChangeSuccess", function (event, next) {
                        if (next.indexOf("annotations") !== -1) {
                            _this.refresh();
                        }
                    });
                    $scope.$on("gdc-user-reset", function () {
                        _this.refresh();
                    });
                    $scope.tableConfig = AnnotationsTableModel;
                    this.refresh();
                }
                AnnotationsController.prototype.refresh = function () {
                    var _this = this;
                    this.AnnotationsService.getAnnotations({
                        fields: this.AnnotationsTableModel.fields,
                        expand: this.AnnotationsTableModel.expand,
                        facets: [
                            "annotation_id",
                            "classification",
                            "category",
                            "created_datetime",
                            "creator",
                            "status",
                            "entity_type",
                            "classification",
                            "project.primary_site",
                            "project.program.name",
                            "project.project_id"
                        ]
                    }).then(function (data) {
                        if (!data.hits.length) {
                            _this.CoreService.setSearchModelState(true);
                        }
                        _this.annotations = data;
                    });
                };
                return AnnotationsController;
            })();
            var AnnotationController = (function () {
                /* @ngInject */
                function AnnotationController(annotation, CoreService) {
                    this.annotation = annotation;
                    this.CoreService = CoreService;
                    CoreService.setPageTitle("Annotation", annotation.annotation_id);
                }
                return AnnotationController;
            })();
            angular.module("annotations.controller", [
                "annotations.services",
                "core.services",
                "annotations.table.model"
            ]).controller("AnnotationsController", AnnotationsController).controller("AnnotationController", AnnotationController);
        })(controllers = annotations.controllers || (annotations.controllers = {}));
    })(annotations = ngApp.annotations || (ngApp.annotations = {}));
})(ngApp || (ngApp = {}));
