var ngApp;
(function (ngApp) {
    var files;
    (function (files) {
        var controllers;
        (function (controllers) {
            var FileController = (function () {
                /* @ngInject */
                function FileController(file, $scope, CoreService, CartService, FilesService) {
                    var _this = this;
                    this.file = file;
                    this.$scope = $scope;
                    this.CoreService = CoreService;
                    this.CartService = CartService;
                    this.FilesService = FilesService;
                    this.archiveCount = 0;
                    this.annotationIds = [];
                    CoreService.setPageTitle("File", file.file_name);
                    if (this.file.archive) {
                        this.FilesService.getFiles({
                            fields: [
                                "archive.archive_id"
                            ],
                            filters: { "op": "=", "content": { "field": "files.archive.archive_id", "value": [file.archive.archive_id] } }
                        }).then(function (data) { return _this.archiveCount = data.pagination.total; });
                    }
                    else {
                        this.archiveCount = 0;
                    }
                    _.every(file.associated_entities, function (entity) {
                        entity.annotations = _.filter(file.annotations, function (annotation) {
                            return annotation.entity_id === entity.entity_id;
                        });
                        if (entity.annotations) {
                            entity.annotations = _.pluck(entity.annotations, "annotation_id");
                        }
                    });
                    //insert cases into related_files for checking isUserProject when downloading
                    _.forEach(file.related_files, function (related_file) {
                        related_file['cases'] = file.cases;
                    });
                }
                FileController.prototype.isInCart = function () {
                    return this.CartService.isInCart(this.file.file_id);
                };
                FileController.prototype.handleCartButton = function () {
                    if (this.CartService.isInCart(this.file.file_id)) {
                        this.CartService.remove([this.file.file_id]);
                    }
                    else {
                        this.CartService.addFiles([this.file], true);
                    }
                };
                FileController.prototype.canBAMSlice = function () {
                    return (this.file.data_type || '').toLowerCase() === 'aligned reads' && (this.file.data_format || '').toLowerCase() === 'bam';
                };
                return FileController;
            })();
            var BAMSlicingController = (function () {
                /* @ngInject */
                function BAMSlicingController($uibModalInstance, $scope, FilesService, file, GqlService, completeCallback) {
                    this.$uibModalInstance = $uibModalInstance;
                    this.$scope = $scope;
                    this.FilesService = FilesService;
                    this.file = file;
                    this.GqlService = GqlService;
                    this.completeCallback = completeCallback;
                    this.exampleShowing = false;
                    this.$scope.bedModel = "";
                }
                BAMSlicingController.prototype.submit = function () {
                    this.FilesService.sliceBAM(this.file.file_id, this.$scope.bedModel, this.completeCallback);
                    this.$uibModalInstance.dismiss('slicing');
                };
                BAMSlicingController.prototype.allowTab = function ($event) {
                    if (event.keyCode === 9) {
                        event.preventDefault();
                        // current caret pos
                        var start = $event.target.selectionStart;
                        var end = $event.target.selectionEnd;
                        var oldValue = this.$scope.bedModel;
                        this.$scope.bedModel = oldValue.substring(0, start) + '\t' + oldValue.substring(end);
                        // put caret in correct place
                        this.GqlService.setPos($event.target, start + 1);
                    }
                };
                BAMSlicingController.prototype.toggleExample = function () {
                    this.exampleShowing = !this.exampleShowing;
                };
                BAMSlicingController.prototype.closeModal = function () {
                    this.$uibModalInstance.dismiss('cancelled');
                };
                return BAMSlicingController;
            })();
            var BAMFailedModalController = (function () {
                /* @ngInject */
                function BAMFailedModalController($uibModalInstance, errorStatus, errorMsg, errorBlob) {
                    this.$uibModalInstance = $uibModalInstance;
                    this.errorStatus = errorStatus;
                    this.errorMsg = errorMsg;
                    this.errorBlob = errorBlob;
                    this.msg = "Invalid BED Format. Please refer to the examples described in the BAM Slicing pop-up.";
                }
                return BAMFailedModalController;
            })();
            angular.module("files.controller", [
                "files.services"
            ]).controller("BAMSlicingController", BAMSlicingController).controller("BAMFailedModalController", BAMFailedModalController).controller("FileController", FileController);
        })(controllers = files.controllers || (files.controllers = {}));
    })(files = ngApp.files || (ngApp.files = {}));
})(ngApp || (ngApp = {}));
