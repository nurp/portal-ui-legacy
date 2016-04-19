var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var quickSearch;
        (function (quickSearch) {
            var directives;
            (function (directives) {
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
                /* @ngInject */
                function QuickSearch($uibModal, $window, $uibModalStack) {
                    return {
                        restrict: "A",
                        controller: function ($scope) {
                            var modalInstance;
                            $scope.$on("$stateChangeStart", function () {
                                if (modalInstance) {
                                    modalInstance.close();
                                }
                            });
                            this.openModal = function () {
                                // Modal stack is a helper service. Used to figure out if one is currently
                                // open already.
                                if ($uibModalStack.getTop()) {
                                    return;
                                }
                                modalInstance = $uibModal.open({
                                    templateUrl: "components/quick-search/templates/quick-search-modal.html",
                                    backdrop: true,
                                    keyboard: true,
                                    animation: false,
                                    size: "lg"
                                });
                            };
                        },
                        link: function ($scope, $element, attrs, ctrl) {
                            $element.on("click", function () {
                                ctrl.openModal();
                            });
                            angular.element($window.document).on("keypress", function (e) {
                                var validSpaceKeys = [
                                    0,
                                    96
                                ];
                                if (e.ctrlKey && validSpaceKeys.indexOf(e.which) !== -1) {
                                    e.preventDefault();
                                    ctrl.openModal();
                                }
                            });
                        }
                    };
                }
                /* @ngInject */
                function QuickSearchDropdown() {
                    return {
                        restrict: "E",
                        templateUrl: "components/quick-search/templates/quick-search-dropdown.html",
                        scope: true
                    };
                }
                function QuickSearchInputBaseLogicFn($scope, element, QuickSearchService, FacetService, $uibModalStack) {
                    $scope.results = [];
                    function setBioSpecimen(result) {
                        if (result._type !== "case") {
                            return;
                        }
                        function findMatch(obj) {
                            for (var key in obj) {
                                if (obj.hasOwnProperty(key)) {
                                    if (_.isString(obj[key])) {
                                        if (obj[key].toLowerCase().indexOf($scope.searchQuery.toLowerCase()) === 0) {
                                            result.bioSpecimen = obj;
                                            return;
                                        }
                                    }
                                    else if (_.isArray(obj[key])) {
                                        _.forEach(obj[key], function (item) {
                                            findMatch(item);
                                        });
                                    }
                                }
                            }
                        }
                        _.forEach(result.samples, function (sample) {
                            if (!result.bioSpecimen) {
                                findMatch(sample);
                            }
                        });
                    }
                    $scope.keyboardListener = function (e) {
                        function selectItem(dir) {
                            var newIndex;
                            _.forEach($scope.results.hits, function (elem, index) {
                                if (_.isEqual(elem, $scope.selectedItem)) {
                                    if (dir === "down" && index + 1 < $scope.results.hits.length) {
                                        newIndex = index + 1;
                                    }
                                    else if (dir === "up" && index - 1 >= 0) {
                                        newIndex = index - 1;
                                    }
                                    else {
                                        newIndex = index;
                                    }
                                }
                            });
                            $scope.selectedItem.selected = false;
                            $scope.results.hits[newIndex].selected = true;
                            $scope.selectedItem = $scope.results.hits[newIndex];
                        }
                        var key = e.which || e.keyCode;
                        switch (key) {
                            case 13 /* Enter */:
                                e.preventDefault();
                                if (!$scope.selectedItem) {
                                    return;
                                }
                                QuickSearchService.goTo($scope.selectedItem._type, $scope.selectedItem._id);
                                break;
                            case 38 /* Up */:
                                e.preventDefault();
                                selectItem("up");
                                break;
                            case 40 /* Down */:
                                e.preventDefault();
                                selectItem("down");
                                break;
                            case 27 /* Esc */:
                                if ($uibModalStack) {
                                    $uibModalStack.dismissAll();
                                }
                                $scope.results = [];
                                $scope.searchQuery = '';
                                break;
                            case 9 /* Tab */:
                                e.preventDefault();
                                break;
                        }
                    };
                    $scope.itemHover = function (item) {
                        $scope.selectedItem.selected = false;
                        item.selected = true;
                        $scope.selectedItem = item;
                    };
                    $scope.goTo = function (entity, id) {
                        QuickSearchService.goTo(entity, id);
                    };
                    $scope.search = function () {
                        $scope.searchQuery = $scope.searchQuery.trim();
                        if (!$scope.searchQuery || $scope.searchQuery.length < 2) {
                            $scope.results = [];
                            $scope.selectedItem = null;
                            $scope.displayItem = null;
                            return;
                        }
                        var params = {
                            query: $scope.searchQuery,
                            fields: [
                                "project_id",
                                "name",
                                "disease_type",
                                "primary_site",
                                "project.project_id",
                                "project.name",
                                "project.disease_type",
                                "project.primary_site",
                                "aliquot_ids",
                                "submitter_aliquot_ids",
                                "analyte_ids",
                                "submitter_analyte_ids",
                                "case_id",
                                "submitter_id",
                                "portion_ids",
                                "submitter_portion_ids",
                                "sample_ids",
                                "submitter_sample_ids",
                                "file_id",
                                "file_name",
                                "file_size",
                                "data_type",
                                "clinical.gender",
                                "samples.sample_id",
                                "samples.submitter_id",
                                "samples.sample_type",
                                "samples.portions.portion_id",
                                "samples.portions.submitter_id",
                                "samples.portions.analytes.analyte_id",
                                "samples.portions.analytes.submitter_id",
                                "samples.portions.analytes.analyte_type",
                                "samples.portions.analytes.aliquots.aliquot_id",
                                "samples.portions.analytes.aliquots.submitter_id"
                            ]
                        };
                        $scope.activeQuery = true;
                        FacetService.searchAll(params).then(function (res) {
                            $scope.activeQuery = false;
                            var data = res.data;
                            data.hits = _.map(data.hits, function (hit) {
                                setBioSpecimen(hit);
                                return hit;
                            });
                            $scope.results = _.assign({}, data);
                            if (!$scope.results.hits.length) {
                                $scope.selectedItem = null;
                                return;
                            }
                            $scope.results.hits[0].selected = true;
                            $scope.selectedItem = $scope.results.hits[0];
                        });
                    };
                }
                /* @ngInject */
                function QuickSearchInput(QuickSearchService, FacetService, $compile, $uibModalStack) {
                    return {
                        restrict: "E",
                        replace: true,
                        templateUrl: "components/quick-search/templates/quick-search-input.html",
                        link: function ($scope, element) {
                            QuickSearchInputBaseLogicFn.call(this, $scope, element, QuickSearchService, FacetService, $uibModalStack);
                            element.after($compile("<quick-search-dropdown></quick-search-dropdown>")($scope));
                        }
                    };
                }
                function QuickSearchInputHome(QuickSearchService, FacetService) {
                    return {
                        restrict: "EA",
                        replace: true,
                        templateUrl: "components/quick-search/templates/quick-search-input-home.html",
                        link: function ($scope, element) {
                            QuickSearchInputBaseLogicFn.call(this, $scope, element, QuickSearchService, FacetService, null);
                        }
                    };
                }
                var Highlight = (function () {
                    function Highlight($rootScope) {
                        return function (value, query) {
                            if (query === void 0) { query = ""; }
                            if (!value) {
                                return "";
                            }
                            var regex = new RegExp("[" + query.replace(/\-/g, "\\-") + "]{" + query.length + "}", "i");
                            if (!_.isArray(value)) {
                                value = [value];
                            }
                            var html = "";
                            // Only ever show the top matched term in the arrays returned.
                            var term = _.filter(value, function (item) {
                                var matchedText = item.match(regex);
                                if (matchedText) {
                                    matchedText = matchedText[0];
                                    return matchedText.toLowerCase() === query.toLowerCase();
                                }
                                return false;
                            }).sort(function (a, b) {
                                return a.match(regex).length - b.match(regex).length;
                            })[0];
                            if (term) {
                                var matchedText = term.match(regex);
                                matchedText = matchedText[0];
                                var boldedQuery = "<span class='bolded'>" + matchedText + "</span>";
                                html = term.replace(regex, boldedQuery);
                            }
                            else {
                                html = value;
                            }
                            return html;
                        };
                    }
                    return Highlight;
                })();
                angular.module("quickSearch.directives", [
                    "ui.bootstrap.modal",
                    "facets.services",
                    "quickSearch.services"
                ]).filter("highlight", Highlight).directive("quickSearchDropdown", QuickSearchDropdown).directive("quickSearchInput", QuickSearchInput).directive("quickSearchInputHome", QuickSearchInputHome).directive("quickSearch", QuickSearch);
            })(directives = quickSearch.directives || (quickSearch.directives = {}));
        })(quickSearch = components.quickSearch || (components.quickSearch = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));
