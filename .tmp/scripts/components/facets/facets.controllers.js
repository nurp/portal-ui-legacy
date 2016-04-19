var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var facets;
        (function (facets) {
            var controllers;
            (function (controllers) {
                var KeyCode;
                (function (KeyCode) {
                    KeyCode[KeyCode["Space"] = 32] = "Space";
                    KeyCode[KeyCode["Enter"] = 13] = "Enter";
                    KeyCode[KeyCode["Esc"] = 27] = "Esc";
                    KeyCode[KeyCode["Left"] = 37] = "Left";
                    KeyCode[KeyCode["Right"] = 39] = "Right";
                    KeyCode[KeyCode["Up"] = 38] = "Up";
                    KeyCode[KeyCode["Down"] = 40] = "Down";
                    KeyCode[KeyCode["Tab"] = 9] = "Tab";
                })(KeyCode || (KeyCode = {}));
                var Cycle;
                (function (Cycle) {
                    Cycle[Cycle["Up"] = -1] = "Up";
                    Cycle[Cycle["Down"] = 1] = "Down";
                })(Cycle || (Cycle = {}));
                var Toggleable = (function () {
                    function Toggleable(collapsed) {
                        this.collapsed = collapsed;
                    }
                    Toggleable.prototype.toggle = function (event, property) {
                        if (event.which === 1 || event.which === 13) {
                            this[property] = !this[property];
                        }
                        if (property === "collapsed") {
                            angular.element(event.target).attr("aria-collapsed", this.collapsed.toString());
                        }
                    };
                    return Toggleable;
                })();
                var TermsController = (function () {
                    /* @ngInject */
                    function TermsController($scope, FacetService, UserService) {
                        var _this = this;
                        this.$scope = $scope;
                        this.FacetService = FacetService;
                        this.UserService = UserService;
                        this.title = "";
                        this.name = "";
                        this.displayCount = 5;
                        this.originalDisplayCount = 5;
                        this.collapsed = false;
                        this.expanded = false;
                        this.actives = [];
                        this.inactives = [];
                        this.error = undefined;
                        this.collapsed = $scope.collapsed === 'true' ? true : false;
                        this.expanded = !!$scope.expanded;
                        this.displayCount = this.originalDisplayCount = $scope.displayCount || 5;
                        this.title = $scope.title;
                        // TODO api should re-format the facets
                        this.name = $scope.name;
                        if ($scope.facet) {
                            if ($scope.facet.buckets) {
                                this.refresh($scope.facet.buckets);
                            }
                            else {
                                this.error = $scope.facet;
                            }
                        }
                        $scope.$watch("facet", function (n, o) {
                            if (n === o) {
                                return;
                            }
                            if (n.buckets) {
                                _this.refresh(n.buckets);
                            }
                            else {
                                _this.error = n;
                            }
                        });
                    }
                    TermsController.prototype.add = function (facet, term) {
                        this.FacetService.addTerm(facet, term);
                    };
                    TermsController.prototype.remove = function (facet, term) {
                        this.FacetService.removeTerm(facet, term);
                    };
                    TermsController.prototype.refresh = function (terms) {
                        var projectCodeKeys = [
                            "project_id",
                            "cases.project.project_id",
                            "annotations.project.project_id",
                            "project.project_id"
                        ];
                        if (projectCodeKeys.indexOf(this.name) !== -1) {
                            terms = this.UserService.setUserProjectsTerms(terms);
                        }
                        this.terms = terms;
                        this.actives = this.FacetService.getActives(this.name, terms);
                        this.inactives = _.difference(terms, this.actives);
                    };
                    TermsController.prototype.toggle = function (event, property) {
                        if (event.which === 1 || event.which === 13) {
                            this[property] = !this[property];
                        }
                        if (property === "collapsed") {
                            angular.element(event.target).attr("aria-collapsed", this.collapsed.toString());
                        }
                        if (property === "expanded") {
                            this.displayCount = this.expanded ? this.inactives.length : this.originalDisplayCount;
                        }
                    };
                    return TermsController;
                })();
                var CurrentFiltersController = (function () {
                    /* @ngInject */
                    function CurrentFiltersController($scope, LocationService, FacetService, UserService) {
                        var _this = this;
                        this.LocationService = LocationService;
                        this.FacetService = FacetService;
                        this.UserService = UserService;
                        this.currentFilters = [];
                        this.build();
                        $scope.$on("$locationChangeSuccess", function () { return _this.build(); });
                    }
                    CurrentFiltersController.prototype.removeTerm = function (facet, term, event, op) {
                        if (event.which === 1 || event.which === 13) {
                            this.FacetService.removeTerm(facet, term, op);
                        }
                    };
                    CurrentFiltersController.prototype.isInMyProjects = function (filter) {
                        var validCodes = [
                            "project_id",
                            "cases.project.project_id"
                        ];
                        return validCodes.indexOf(filter.content.field) !== -1 && this.UserService.currentUser && this.UserService.currentUser.isFiltered;
                    };
                    CurrentFiltersController.prototype.resetQuery = function () {
                        this.LocationService.clear();
                    };
                    CurrentFiltersController.prototype.expandTerms = function (event, filter) {
                        if (event.which === 1 || event.which === 13) {
                            filter.expanded = !filter.expanded;
                        }
                    };
                    CurrentFiltersController.prototype.build = function () {
                        this.currentFilters = _.sortBy(this.LocationService.filters().content, function (item) {
                            return item.content.field;
                        });
                    };
                    return CurrentFiltersController;
                })();
                var FreeTextController = (function (_super) {
                    __extends(FreeTextController, _super);
                    /* @ngInject */
                    function FreeTextController($scope, LocationService, FacetService) {
                        var _this = this;
                        this.$scope = $scope;
                        this.LocationService = LocationService;
                        this.FacetService = FacetService;
                        this.searchTerm = "";
                        this.actives = [];
                        this.autocomplete = true;
                        this.lastInput = "";
                        this.autocomplete = $scope.autocomplete !== 'false';
                        this.refresh();
                        $scope.$watch("searchTerm", function (n, o) {
                            if (n === o) {
                                return;
                            }
                            _this.refresh();
                        });
                        $scope.$on("$locationChangeSuccess", function () { return _this.refresh(); });
                    }
                    FreeTextController.prototype.saveInput = function () {
                        this.lastInput = this.searchTerm;
                    };
                    FreeTextController.prototype.termSelected = function (addTerm) {
                        if (addTerm === void 0) { addTerm = true; }
                        if (!addTerm) {
                            this.searchTerm = this.lastInput;
                            return;
                        }
                        var parts = this.$scope.field.split(".");
                        var field = parts.length > 1 ? parts[parts.length - 1] : parts[0];
                        if (this.actives.indexOf(this.searchTerm[field]) === -1) {
                            var term = this.searchTerm;
                            term = term[field];
                            if (!term) {
                                this.searchTerm = this.lastInput;
                                return;
                            }
                            this.FacetService.addTerm(this.$scope.field, term);
                            this.actives.push(this.searchTerm);
                            this.searchTerm = "";
                        }
                        else {
                            this.searchTerm = "";
                        }
                    };
                    FreeTextController.prototype.setTerm = function () {
                        if (this.searchTerm === "") {
                            return;
                        }
                        this.FacetService.addTerm(this.$scope.field, this.searchTerm);
                        this.actives.push(this.searchTerm);
                        this.searchTerm = "";
                    };
                    FreeTextController.prototype.autoComplete = function (query) {
                        return this.FacetService.autoComplete(this.$scope.entity, query, this.$scope.field);
                    };
                    FreeTextController.prototype.prefixValue = function (query) {
                        term = query.replace(/\*/g, '') + '*';
                        var model = { term: term };
                        model[this.$scope.field.split('.').pop()] = term;
                        return [model];
                    };
                    FreeTextController.prototype.remove = function (term) {
                        this.FacetService.removeTerm(this.$scope.field, term);
                        this.refresh();
                    };
                    FreeTextController.prototype.refresh = function () {
                        this.actives = this.FacetService.getActiveIDs(this.$scope.field);
                    };
                    return FreeTextController;
                })(Toggleable);
                var RangeFacetController = (function (_super) {
                    __extends(RangeFacetController, _super);
                    /* @ngInject */
                    function RangeFacetController($scope, LocationService, FacetService) {
                        var _this = this;
                        this.$scope = $scope;
                        this.LocationService = LocationService;
                        this.FacetService = FacetService;
                        this.error = undefined;
                        this.lowerBound = null;
                        this.upperBound = null;
                        $scope.data = [];
                        $scope.dataUnitConverted = [];
                        $scope.lowerBoundOriginalDays = null;
                        $scope.upperBoundOriginalDays = null;
                        if (!$scope.unitsMap) {
                            $scope.unitsMap = [
                                {
                                    "label": "none",
                                    "conversionDivisor": 1,
                                }
                            ];
                        }
                        $scope.selectedUnit = $scope.unitsMap[0];
                        this.refresh();
                        $scope.$on("$locationChangeSuccess", function () { return _this.refresh(); });
                        $scope.$watch("facet", function (n, o) {
                            if ((n === o && ($scope.min !== undefined || $scope.max !== undefined)) || n === undefined) {
                                return;
                            }
                            if (n.buckets) {
                                $scope.data = _.reject(n.buckets, function (bucket) {
                                    return bucket.key === "_missing";
                                });
                                $scope.dataUnitConverted = _this.unitConversion($scope.data);
                                _this.getMaxMin($scope.dataUnitConverted);
                            }
                            else {
                                _this.error = n;
                            }
                        });
                        var _this = this;
                        $scope.unitClicked = function (selectedUnitMap) {
                            $scope.selectedUnit = selectedUnitMap;
                            _this.$scope.dataUnitConverted = _this.unitConversion($scope.data);
                            _this.getMaxMin($scope.dataUnitConverted);
                            _this.lowerBound = _this.$scope.lowerBoundOriginalDays ? Math.floor(_this.$scope.lowerBoundOriginalDays / _this.$scope.selectedUnit.conversionDivisor) : null;
                            _this.upperBound = _this.$scope.upperBoundOriginalDays ? Math.ceil(_this.$scope.upperBoundOriginalDays / _this.$scope.selectedUnit.conversionDivisor) : null;
                        };
                    }
                    RangeFacetController.prototype.unitConversion = function (data) {
                        var _this = this;
                        if (this.$scope.unitsMap) {
                            return _.reduce(data, function (result, datum) {
                                var newKey = Math.floor(datum.key / _this.$scope.selectedUnit.conversionDivisor);
                                var summed = _.find(result, _.matchesProperty('key', newKey));
                                if (summed) {
                                    summed.doc_count = summed.doc_count + datum.doc_count;
                                }
                                else {
                                    result.push({
                                        "key": newKey,
                                        "doc_count": datum.doc_count
                                    });
                                }
                                return result;
                            }, []);
                        }
                        else {
                            return data;
                        }
                    };
                    RangeFacetController.prototype.getMaxMin = function (data) {
                        this.$scope.min = _.min(data, function (bucket) {
                            return bucket.key === '_missing' ? Number.POSITIVE_INFINITY : parseInt(bucket.key, 10);
                        }).key;
                        if (this.$scope.min === '_missing') {
                            this.$scope.min = null;
                        }
                        this.$scope.max = _.max(data, function (bucket) {
                            return bucket.key === '_missing' ? Number.NEGATIVE_INFINITY : parseInt(bucket.key, 10);
                        }).key;
                        if (this.$scope.max === '_missing') {
                            this.$scope.max = null;
                        }
                    };
                    RangeFacetController.prototype.refresh = function () {
                        this.activesWithOperator = this.FacetService.getActivesWithOperator(this.$scope.field);
                        if (_.has(this.activesWithOperator, '>=')) {
                            this.lowerBound = Math.floor(this.activesWithOperator['>='] / this.$scope.selectedUnit.conversionDivisor);
                        }
                        else {
                            this.lowerBound = null;
                        }
                        if (_.has(this.activesWithOperator, '<=')) {
                            this.upperBound = Math.ceil(this.activesWithOperator['<='] / this.$scope.selectedUnit.conversionDivisor);
                        }
                        else {
                            this.upperBound = null;
                        }
                    };
                    RangeFacetController.prototype.inputChanged = function () {
                        var numRegex = /^\d+$/;
                        if (this.lowerBound) {
                            if (!numRegex.test(this.lowerBound)) {
                                this.lowerBound = 0;
                            }
                        }
                        if (this.upperBound) {
                            if (!numRegex.test(this.upperBound)) {
                                this.upperBound = 0;
                            }
                        }
                        this.$scope.lowerBoundOriginalDays = this.lowerBound * this.$scope.selectedUnit.conversionDivisor;
                        this.$scope.upperBoundOriginalDays = this.upperBound * this.$scope.selectedUnit.conversionDivisor;
                    };
                    RangeFacetController.prototype.setBounds = function () {
                        if (this.lowerBound) {
                            if (_.has(this.activesWithOperator, '>=')) {
                                this.FacetService.removeTerm(this.$scope.field, null, ">=");
                            }
                            this.FacetService.addTerm(this.$scope.field, this.lowerBound * this.$scope.selectedUnit.conversionDivisor, ">=");
                        }
                        else {
                            this.FacetService.removeTerm(this.$scope.field, null, ">=");
                        }
                        if (this.upperBound) {
                            if (_.has(this.activesWithOperator, '<=')) {
                                this.FacetService.removeTerm(this.$scope.field, null, "<=");
                            }
                            this.FacetService.addTerm(this.$scope.field, this.upperBound * this.$scope.selectedUnit.conversionDivisor, "<=");
                        }
                        else {
                            this.FacetService.removeTerm(this.$scope.field, null, "<=");
                        }
                    };
                    return RangeFacetController;
                })(Toggleable);
                var DateFacetController = (function (_super) {
                    __extends(DateFacetController, _super);
                    /* @ngInject */
                    function DateFacetController($scope, $window, FacetService, uibDateParser) {
                        var _this = this;
                        this.$scope = $scope;
                        this.$window = $window;
                        this.FacetService = FacetService;
                        this.uibDateParser = uibDateParser;
                        this.active = false;
                        this.name = "";
                        this.$scope.date = new Date();
                        this.refresh();
                        $scope.$on("$locationChangeSuccess", function () { return _this.refresh(); });
                        this.$scope.opened = false;
                        this.$scope.dateOptions = {
                            showWeeks: false,
                            startingDay: 1
                        };
                        this.name = $scope.name;
                    }
                    DateFacetController.prototype.refresh = function () {
                        var actives = this.FacetService.getActivesWithValue(this.$scope.name);
                        if (_.size(actives) > 0) {
                            this.$scope.date = this.$window.moment(actives[this.$scope.name]).toDate();
                        }
                    };
                    DateFacetController.prototype.open = function ($event) {
                        $event.preventDefault();
                        $event.stopPropagation();
                        this.$scope.opened = true;
                    };
                    DateFacetController.prototype.search = function () {
                        var actives = this.FacetService.getActivesWithValue(this.$scope.name);
                        if (_.size(actives) > 0) {
                            this.FacetService.removeTerm(this.name, undefined, '>=');
                        }
                        this.FacetService.addTerm(this.name, this.$window.moment(this.$scope.date).format(), '>=');
                    };
                    return DateFacetController;
                })(Toggleable);
                var CustomFacetsModalController = (function () {
                    /* @ngInject */
                    function CustomFacetsModalController(facetFields, $scope, $uibModalInstance, $window, Restangular, FilesService, ParticipantsService, $filter, facetsConfig, LocationService, FacetsConfigService, aggregations, docType) {
                        this.facetFields = facetFields;
                        this.$scope = $scope;
                        this.$uibModalInstance = $uibModalInstance;
                        this.$window = $window;
                        this.Restangular = Restangular;
                        this.FilesService = FilesService;
                        this.ParticipantsService = ParticipantsService;
                        this.$filter = $filter;
                        this.facetsConfig = facetsConfig;
                        this.LocationService = LocationService;
                        this.FacetsConfigService = FacetsConfigService;
                        this.aggregations = aggregations;
                        this.docType = docType;
                        this.selectedIndex = 0;
                        var _this = this;
                        $scope.keyboardListener = function (e) {
                            var key = e.which || e.keyCode;
                            switch (key) {
                                case 13 /* Enter */:
                                    e.preventDefault();
                                    _this.addFacet();
                                    break;
                                case 38 /* Up */:
                                    e.preventDefault();
                                    _this.setSelectedIndex(-1 /* Up */);
                                    break;
                                case 40 /* Down */:
                                    e.preventDefault();
                                    _this.setSelectedIndex(1 /* Down */);
                                    break;
                                case 27 /* Esc */:
                                    _this.$uibModalStack.dismissAll();
                                    break;
                                case 9 /* Tab */:
                                    e.preventDefault();
                                    break;
                            }
                        };
                        $scope.itemHover = function (index) {
                            _this.selectedIndex = index;
                        };
                    }
                    CustomFacetsModalController.prototype.closeModal = function () {
                        this.$uibModalInstance.dismiss('cancel');
                    };
                    CustomFacetsModalController.prototype.addFacet = function () {
                        var _this = this;
                        var selectedField = this.$scope.filteredFields[this.selectedIndex];
                        var fileOptions = {
                            fields: [],
                            expand: [],
                            facets: [selectedField['field']],
                            filters: this.LocationService.filters()
                        };
                        if (selectedField['doc_type'] === "files") {
                            this.FilesService.getFiles(fileOptions).then(function (data) {
                                _.assign(_this.aggregations, data.aggregations);
                            }, function (response) {
                                _this.aggregations[selectedField['field']] = 'error';
                                return _this.aggregations;
                            });
                        }
                        else if (selectedField['doc_type'] === "cases") {
                            this.ParticipantsService.getParticipants(fileOptions).then(function (data) {
                                _.assign(_this.aggregations, data.aggregations);
                            }, function (response) {
                                _this.aggregations[selectedField['field']] = 'error';
                                return _this.aggregations;
                            });
                        }
                        this.FacetsConfigService.addField(selectedField['doc_type'], selectedField['field'], selectedField['type']);
                        this.$uibModalInstance.dismiss('added facet');
                    };
                    CustomFacetsModalController.prototype.setSelectedIndex = function (direction) {
                        if (direction == -1 /* Up */) {
                            if (this.selectedIndex === 0) {
                                this.selectedIndex = (this.$scope.filteredFields.length - 1);
                                document.getElementById('add-facets-modal').scrollTop = document.getElementById(this.$filter('dotReplace')(this.$scope.filteredFields[this.selectedIndex].field, '-')).offsetTop;
                            }
                            else {
                                this.selectedIndex--;
                                this.scrollToSelected(-1 /* Up */);
                            }
                        }
                        if (direction == 1 /* Down */) {
                            if (this.selectedIndex === (this.$scope.filteredFields.length - 1)) {
                                this.selectedIndex = 0;
                                document.getElementById('add-facets-modal').scrollTop = 0;
                            }
                            else {
                                this.selectedIndex++;
                                this.scrollToSelected(1 /* Down */);
                            }
                        }
                    };
                    CustomFacetsModalController.prototype.scrollToSelected = function (direction) {
                        var _this = this;
                        var modalElement = document.getElementById('add-facets-modal');
                        var selectedElement = document.getElementById(this.$filter('dotReplace')(this.$scope.filteredFields[this.selectedIndex].field, '-'));
                        var offsets = _.sortBy(this.$scope.filteredFields.map(function (f) { return document.getElementById(_this.$filter('dotReplace')(f.field, '-')).offsetTop; }));
                        //don't want to jump selectedElement to the top when scrolling up and down
                        //so set scrollTop to the element that's nearest to the top instead
                        var currentTopPos = modalElement.scrollTop;
                        var minDiff = Number.MAX_VALUE;
                        var nearestIndex = offsets.reduce(function (acc, offset, i) {
                            var currentDiff = Math.abs(currentTopPos - offset);
                            if (currentDiff < minDiff) {
                                minDiff = currentDiff;
                                return i;
                            }
                            return acc;
                        }, -1);
                        if (direction === -1 /* Up */) {
                            if (selectedElement.offsetTop < modalElement.scrollTop) {
                                modalElement.scrollTop = offsets[nearestIndex - 1];
                            }
                        }
                        else if (direction === 1 /* Down */) {
                            if (selectedElement.offsetTop + 4 > modalElement.scrollTop + modalElement.clientHeight) {
                                modalElement.scrollTop = offsets[nearestIndex + 1];
                            }
                        }
                    };
                    CustomFacetsModalController.prototype.inputChanged = function () {
                        if (this.$scope.filteredFields.length < this.selectedIndex) {
                            this.selectedIndex = 0;
                        }
                    };
                    return CustomFacetsModalController;
                })();
                var AddCustomFacetsPanelController = (function () {
                    /* @ngInject */
                    function AddCustomFacetsPanelController($scope, $uibModalStack, $uibModal, FacetsConfigService, LocationService) {
                        var _this = this;
                        this.$scope = $scope;
                        this.$uibModalStack = $uibModalStack;
                        this.$uibModal = $uibModal;
                        this.FacetsConfigService = FacetsConfigService;
                        this.LocationService = LocationService;
                        $scope.$on("$stateChangeStart", function () {
                            if (_this.modalInstance) {
                                _this.modalInstance.close();
                            }
                        });
                    }
                    AddCustomFacetsPanelController.prototype.openModal = function () {
                        var _this = this;
                        // Modal stack is a helper service. Used to figure out if one is currently
                        // open already.
                        if (this.$uibModalStack.getTop()) {
                            return;
                        }
                        this.modalInstance = this.$uibModal.open({
                            templateUrl: "components/facets/templates/add-facets-modal.html",
                            backdrop: true,
                            controller: "customFacetsModalController as cufc",
                            keyboard: true,
                            animation: false,
                            size: "lg",
                            resolve: {
                                /** @ngInject */
                                facetFields: function (CustomFacetsService) {
                                    return CustomFacetsService.getFacetFields(_this.$scope.docType);
                                },
                                facetsConfig: function () { return _this.$scope.facetsConfig; },
                                aggregations: function () { return _this.$scope.aggregations; },
                                docType: function () { return _this.$scope.docType; }
                            }
                        });
                    };
                    AddCustomFacetsPanelController.prototype.reset = function () {
                        this.LocationService.clear();
                        this.$scope.facetsConfig = _.clone(this.defaultConfig, true);
                        this.FacetService.addTerm(this.name, this.$window.moment(this.$scope.date), '>=');
                    };
                    return AddCustomFacetsPanelController;
                })();
                angular.module("facets.controllers", ["facets.services", "user.services", "files.services"]).controller("currentFiltersCtrl", CurrentFiltersController).controller("freeTextCtrl", FreeTextController).controller("rangeFacetCtrl", RangeFacetController).controller("dateFacetCtrl", DateFacetController).controller("customFacetsModalController", CustomFacetsModalController).controller("addCustomFacetsPanelController", AddCustomFacetsPanelController).controller("termsCtrl", TermsController);
            })(controllers = facets.controllers || (facets.controllers = {}));
        })(facets = components.facets || (components.facets = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));
