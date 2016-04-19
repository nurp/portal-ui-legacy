var ngApp;
(function (ngApp) {
    var cart;
    (function (cart) {
        var controllers;
        (function (controllers) {
            var CartController = (function () {
                /* @ngInject */
                function CartController($scope, $state, $filter, files, CoreService, CartService, UserService, CartTableModel, Restangular, SearchService, FilesService, ParticipantsService, CartState) {
                    var _this = this;
                    this.$scope = $scope;
                    this.$state = $state;
                    this.$filter = $filter;
                    this.files = files;
                    this.CoreService = CoreService;
                    this.CartService = CartService;
                    this.UserService = UserService;
                    this.CartTableModel = CartTableModel;
                    this.Restangular = Restangular;
                    this.SearchService = SearchService;
                    this.FilesService = FilesService;
                    this.ParticipantsService = ParticipantsService;
                    this.CartState = CartState;
                    this.helpHidden = false;
                    var data = $state.current.data || {};
                    this.CartState.setActive("tabs", data.tab);
                    this.lastModified = this.CartService.lastModified;
                    this.cartTableConfig = CartTableModel;
                    this.refresh();
                    $scope.$on("$locationChangeSuccess", function (event, next) {
                        if (next.indexOf("cart") !== -1) {
                            _this.refresh();
                        }
                    });
                    $scope.$on("cart-update", function (event) {
                        _this.refresh();
                    });
                    this.projectCountChartConfig = {
                        textValue: "file_size.value",
                        textFilter: "size",
                        label: "file",
                        sortKey: "doc_count",
                        displayKey: "key",
                        sortData: true,
                        defaultText: "project",
                        pluralDefaultText: "projects",
                    };
                    this.fileCountChartConfig = {
                        textValue: "file_size.value",
                        textFilter: "size",
                        label: "file",
                        sortKey: "doc_count",
                        displayKey: "key",
                        sortData: true,
                        defaultText: "authorization level",
                        pluralDefaultText: "authorization levels"
                    };
                    this.clinicalDataExportFilters = this.biospecimenDataExportFilters = {
                        'files.file_id': this.CartService.getFileIds()
                    };
                    this.clinicalDataExportExpands = ['demographic', 'diagnoses', 'family_histories', 'exposures'];
                    this.clinicalDataExportFileName = 'clinical.cart';
                    this.biospecimenDataExportExpands = ['samples', 'samples.portions', 'samples.portions.analytes', 'samples.portions.analytes.aliquots', 'samples.portions.analytes.aliquots.annotations', 'samples.portions.analytes.annotations', 'samples.portions.submitter_id', 'samples.portions.slides', 'samples.portions.annotations', 'samples.portions.center'];
                    this.biospecimenDataExportFileName = 'biospecimen.cart';
                }
                CartController.prototype.getSummary = function () {
                    var _this = this;
                    var filters = {
                        op: "and",
                        content: [
                            {
                                op: "in",
                                content: {
                                    field: "files.file_id",
                                    value: this.CartService.getFileIds()
                                }
                            }
                        ]
                    };
                    this.SearchService.getSummary(filters, true).then(function (data) {
                        _this.summary = data;
                    });
                    var UserService = this.UserService;
                    var authCountAndFileSizes = _.reduce(this.CartService.getFiles(), function (result, file) {
                        var canDownloadKey = UserService.userCanDownloadFile(file) ? 'authorized' : 'unauthorized';
                        result[canDownloadKey].count += 1;
                        result[canDownloadKey].file_size += file.file_size;
                        return result;
                    }, { 'authorized': { 'count': 0, 'file_size': 0 }, 'unauthorized': { 'count': 0, 'file_size': 0 } });
                    this.fileCountChartData = _.filter([
                        {
                            key: 'authorized',
                            doc_count: authCountAndFileSizes.authorized.count || 0,
                            file_size: { value: authCountAndFileSizes.authorized.file_size }
                        },
                        {
                            key: 'unauthorized',
                            doc_count: authCountAndFileSizes.unauthorized.count || 0,
                            file_size: { value: authCountAndFileSizes.unauthorized.file_size }
                        }
                    ], function (i) { return i.doc_count; });
                };
                CartController.prototype.refresh = function () {
                    var _this = this;
                    const fileIds = this.CartService.getFileIds();
                    this.CoreService.setPageTitle("Cart", "(" + fileIds.length + ")");
                    // in the event that our cart is empty
                    if (fileIds.length < 1) {
                        this.files = {};
                        return;
                    }
                    var filters = { 'content': [{ 'content': { 'field': 'files.file_id', 'value': fileIds }, 'op': 'in' }], 'op': 'and' };
                    var fileOptions = {
                        filters: filters,
                        fields: ['access', 'file_name', 'file_id', 'data_type', 'data_format', 'file_size', 'annotations.annotation_id'],
                        expand: ['cases', 'cases.project'],
                        facets: ['cases.case_id'],
                    };
                    this.FilesService.getFiles(fileOptions, 'POST').then(function (data) {
                        _this.files = _this.files || {};
                        if (!_.isEqual(_this.files.hits, data.hits)) {
                            _this.files = data;
                            _this.getSummary();
                        }
                    });
                    this.ParticipantsService.getParticipants({ filters: filters, size: 0 }, 'POST').then(function (data) {
                        _this.participantCount = data.pagination.total;
                    });
                };
                CartController.prototype.getTotalSize = function () {
                    return _.reduce(this.files, function (sum, hit) {
                        return sum + hit.file_size;
                    }, 0);
                };
                CartController.prototype.getFileIds = function () {
                    return _.pluck(this.files, "file_id");
                };
                CartController.prototype.getRelatedFileIds = function () {
                    return _.reduce(this.files, function (ids, file) {
                        return ids.concat(file.related_ids);
                    }, []);
                };
                CartController.prototype.removeAll = function () {
                    // edge case where there is only 1 file in the cart,
                    // need to pass the file to CartService.remove because CartService
                    // does not store file names and the file name is displayed in
                    // remove notification
                    if (this.files.pagination.count === 1) {
                        this.CartService.remove(this.files.hits);
                    }
                    else {
                        this.CartService.removeAll();
                    }
                    this.lastModified = this.CartService.lastModified;
                    this.files = {};
                };
                CartController.prototype.getManifest = function (selectedOnly) {
                    if (selectedOnly === void 0) { selectedOnly = false; }
                    this.FilesService.downloadManifest(_.pluck(this.CartService.getFiles(), "file_id"), function (complete) {
                        if (complete) {
                            return true;
                        }
                    });
                };
                return CartController;
            })();
            var LoginToDownloadController = (function () {
                /* @ngInject */
                function LoginToDownloadController($uibModalInstance) {
                    this.$uibModalInstance = $uibModalInstance;
                }
                LoginToDownloadController.prototype.cancel = function () {
                    this.$uibModalInstance.close(false);
                };
                LoginToDownloadController.prototype.goAuth = function () {
                    this.$uibModalInstance.close(true);
                };
                return LoginToDownloadController;
            })();
            var AddToCartSingleCtrl = (function () {
                /* @ngInject */
                function AddToCartSingleCtrl(CartService) {
                    this.CartService = CartService;
                }
                AddToCartSingleCtrl.prototype.addToCart = function () {
                    if (this.CartService.getCartVacancySize() < 1) {
                        this.CartService.sizeWarning();
                    }
                    else
                        this.CartService.addFiles([this.file], true);
                };
                AddToCartSingleCtrl.prototype.removeFromCart = function () {
                    this.CartService.remove([this.file]);
                };
                return AddToCartSingleCtrl;
            })();
            var AddToCartAllCtrl = (function () {
                /* @ngInject */
                function AddToCartAllCtrl(CartService, 
                    //private QueryCartService: IQueryCartService,
                    UserService, LocationService, FilesService, UserService, $timeout, notify) {
                    this.CartService = CartService;
                    this.UserService = UserService;
                    this.LocationService = LocationService;
                    this.FilesService = FilesService;
                    this.UserService = UserService;
                    this.$timeout = $timeout;
                    this.notify = notify;
                    this.CartService = CartService;
                }
                AddToCartAllCtrl.prototype.removeAll = function () {
                    var _this = this;
                    // Query ES using the current filter and the file uuids in the Cart
                    // If an id is in the result, then it is both in the Cart and in the current Search query
                    var filters = this.filter || this.LocationService.filters();
                    var size = this.CartService.getFiles().length;
                    if (!filters.content) {
                        filters.op = "and";
                        filters.content = [];
                    }
                    filters.content.push({
                        content: {
                            field: "files.file_id",
                            value: _.pluck(this.CartService.getFiles(), "file_id")
                        },
                        op: "in"
                    });
                    this.FilesService.getFiles({
                        fields: [
                            "file_id",
                            "file_name"
                        ],
                        filters: filters,
                        size: size,
                        from: 0
                    }, 'POST').then(function (data) {
                        _this.CartService.remove(data.hits);
                    });
                };
                AddToCartAllCtrl.prototype.addAll = function () {
                    var _this = this;
                    var filters = (this.filter ? JSON.parse(this.filter) : undefined) || this.LocationService.filters();
                    filters = this.UserService.addMyProjectsFilter(filters, "cases.project.project_id");
                    if (this.size >= this.CartService.getCartVacancySize()) {
                        this.CartService.sizeWarning();
                        return;
                    }
                    var addingMsgPromise = this.$timeout(function () {
                        _this.notify({
                            message: "",
                            messageTemplate: "<span data-translate>Adding <strong>" + _this.size + "</strong> files to cart</span>",
                            container: "#notification",
                            classes: "alert-info"
                        });
                    }, 1000);
                    this.FilesService.getFiles({
                        fields: ["access", "file_id", "file_size", "cases.project.project_id",],
                        filters: filters,
                        sort: "",
                        size: this.size,
                        from: 0
                    }).then(function (data) {
                        _this.CartService.addFiles(data.hits, false);
                        _this.$timeout.cancel(addingMsgPromise);
                    });
                };
                return AddToCartAllCtrl;
            })();
            angular.module("cart.controller", [
                "cart.services",
                "core.services",
                "user.services",
                "cart.table.model",
                "search.services"
            ]).controller("LoginToDownloadController", LoginToDownloadController).controller("AddToCartAllCtrl", AddToCartAllCtrl).controller("AddToCartSingleCtrl", AddToCartSingleCtrl).controller("CartController", CartController);
        })(controllers = cart.controllers || (cart.controllers = {}));
    })(cart = ngApp.cart || (ngApp.cart = {}));
})(ngApp || (ngApp = {}));
