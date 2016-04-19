var ngApp;
(function (ngApp) {
    var participants;
    (function (participants) {
        var controllers;
        (function (controllers) {
            var ParticipantController = (function () {
                /* @ngInject */
                function ParticipantController(participant, CoreService, LocationService, $filter, ExperimentalStrategyNames, DataCategoryNames, config) {
                    this.participant = participant;
                    this.CoreService = CoreService;
                    this.LocationService = LocationService;
                    this.$filter = $filter;
                    this.ExperimentalStrategyNames = ExperimentalStrategyNames;
                    this.DataCategoryNames = DataCategoryNames;
                    this.config = config;
                    CoreService.setPageTitle("Case", participant.case_id);
                    this.annotationIds = _.map(this.participant.annotations, function (annotation) {
                        return annotation.annotation_id;
                    });
                    this.clinicalFile = _.find(this.participant.files, function (file) {
                        return (file.data_type || '').toLowerCase() === "clinical data";
                    });
                    this.experimentalStrategies = _.reduce(ExperimentalStrategyNames.slice(), function (result, name) {
                        var strat = _.find(participant.summary.experimental_strategies, function (item) {
                            return item.experimental_strategy.toLowerCase() === name.toLowerCase();
                        });
                        if (strat) {
                            result.push(strat);
                        }
                        return result;
                    }, []);
                    this.dataCategories = _.reduce(DataCategoryNames.slice(), function (result, name) {
                        var type = _.find(participant.summary.data_categories, function (item) {
                            return item.data_category.toLowerCase() === name.toLowerCase();
                        });
                        if (type) {
                            result.push(type);
                        }
                        else {
                            result.push({
                                data_category: name,
                                file_count: 0
                            });
                        }
                        return result;
                    }, []);
                    this.expStratConfig = {
                        sortKey: "file_count",
                        displayKey: "experimental_strategy",
                        defaultText: "experimental strategy",
                        pluralDefaultText: "experimental strategies",
                        hideFileSize: true,
                        noResultsText: "No files with Experimental Strategies",
                        state: {
                            name: "search.files"
                        },
                        filters: {
                            "default": {
                                params: {
                                    filters: function (value) {
                                        return $filter("makeFilter")([
                                            {
                                                field: "cases.case_id",
                                                value: [
                                                    participant.case_id
                                                ]
                                            },
                                            {
                                                field: "files.experimental_strategy",
                                                value: [
                                                    value
                                                ]
                                            }
                                        ], true);
                                    }
                                }
                            }
                        }
                    };
                    this.dataCategoriesConfig = {
                        sortKey: "file_count",
                        displayKey: "data_category",
                        defaultText: "data category",
                        hideFileSize: true,
                        pluralDefaultText: "data categories",
                        state: {
                            name: "search.files"
                        },
                        filters: {
                            "default": {
                                params: {
                                    filters: function (value) {
                                        return $filter("makeFilter")([
                                            {
                                                field: "cases.case_id",
                                                value: [
                                                    participant.case_id
                                                ]
                                            },
                                            {
                                                field: "files.data_category",
                                                value: [
                                                    value
                                                ]
                                            }
                                        ], true);
                                    }
                                }
                            }
                        }
                    };
                }
                return ParticipantController;
            })();
            angular.module("participants.controller", [
                "participants.services",
                "core.services"
            ]).controller("ParticipantController", ParticipantController);
        })(controllers = participants.controllers || (participants.controllers = {}));
    })(participants = ngApp.participants || (ngApp.participants = {}));
})(ngApp || (ngApp = {}));
