var ngApp;
(function (ngApp) {
    var projects;
    (function (projects) {
        var models;
        (function (models) {
            function filterFactory(url) {
                return function (value, filters, $filter) {
                    var filterString = _.isObject(filters) ? $filter("makeFilter")(filters, true) : null;
                    var href = url + (filterString ? "?filters=" + filterString : "");
                    var val = $filter("number")(value);
                    return value ? "<a href='" + href + "'>" + val + '</a>' : '0';
                };
            }
            var withFilterF = filterFactory("search/f"), withFilter = filterFactory("search/c");
            function getdataCategory(dataCategories, dataCategory) {
                var data = _.find(dataCategories, { data_category: dataCategory });
                return data ? data.case_count : 0;
            }
            function dataCategoryWithFilters(dataCategory, row, $filter) {
                var fs = [{ field: 'cases.project.project_id', value: row.project_id }, { field: 'files.data_category', value: dataCategory }];
                return withFilter(getdataCategory(row.summary.data_categories, dataCategory), fs, $filter);
            }
            function dataCategoryTotalWithFilters(dataCategory, data, $filter, LocationService) {
                var fs = _.map(LocationService.filters().content, function (x) { return ({
                    field: x.content.field.indexOf("summary") === 0 ? "files." + x.content.field.split(".")[2] : "cases.project." + x.content.field,
                    value: x.content.value
                }); });
                fs.push({ field: 'files.data_category', value: [dataCategory] });
                return withFilter(_.sum(_.map(data, function (row) { return getdataCategory(row.summary.data_categories, dataCategory); })), fs, $filter);
            }
            function withCurrentFilters(value, $filter, LocationService) {
                var fs = _.map(LocationService.filters().content, function (x) { return ({
                    field: x.content.field.indexOf("summary") === 0 ? "files." + x.content.field.split(".")[2] : "cases.project." + x.content.field,
                    value: x.content.value
                }); });
                return withFilter(value, fs, $filter);
            }
            function hasFilters(LocationService) {
                var filters = _.get(LocationService.filters(), 'content', null), hasFiltersFlag = false;
                if (!filters) {
                    return hasFiltersFlag;
                }
                for (var i = 0; i < filters.length; i++) {
                    var field = _.get(filters[i], 'content.field', false);
                    if (!field) {
                        continue;
                    }
                    hasFiltersFlag = true;
                    break;
                }
                return hasFiltersFlag;
            }
            function withProjectFilters(data, $filter, LocationService, withFilterFn) {
                var projectIDs = [], totalCount = 0, wFilterFn = withFilterFn || withFilter, fs = [];
                _.map(data, function (d) {
                    if (!_.has(d, 'project_id')) {
                        return;
                    }
                    projectIDs.push(d.project_id);
                    var countKey = 'summary.case_count';
                    if (withFilterFn !== withFilter) {
                        countKey = 'summary.file_count';
                    }
                    totalCount += _.get(d, countKey, 0);
                });
                if (hasFilters(LocationService) && projectIDs.length) {
                    fs.push({ field: 'cases.project.project_id', value: projectIDs });
                }
                return wFilterFn(totalCount, fs, $filter);
            }
            var projectTableModel = {
                title: 'Projects',
                rowId: 'project_id',
                headings: [
                    {
                        name: "ID",
                        id: "project_id",
                        td: function (row) { return '<a href="projects/' + row.project_id + '" data-uib-tooltip="' + row.name + '" data-tooltip-append-to-body="true" data-tooltip-placement="right">' + row.project_id + '</a>'; },
                        sortable: true,
                        hidden: false,
                        draggable: true,
                        total: function (data) { return '<strong>Total</strong>'; },
                        colSpan: 4
                    },
                    {
                        name: "Disease Type",
                        id: "disease_type",
                        tdClassName: 'truncated-cell',
                        td: function (row) { return row.disease_type; },
                        sortable: true,
                        hidden: false,
                        draggable: true
                    },
                    {
                        name: "Primary Site",
                        id: "primary_site",
                        tdClassName: 'truncated-cell',
                        td: function (row) { return row.primary_site; },
                        sortable: true,
                        hidden: false,
                        canReorder: true,
                        enabled: true
                    },
                    {
                        name: "Program",
                        id: "program.name",
                        td: function (row) { return row.program && row.program.name; },
                        sortable: true,
                        hidden: false
                    },
                    {
                        name: "Cases",
                        id: "summary.case_count",
                        td: function (row, $scope) {
                            var fs = [{ field: 'cases.project.project_id', value: row.project_id }];
                            return withFilter(row.summary.case_count, fs, $scope.$filter);
                        },
                        sortable: true,
                        hidden: false,
                        thClassName: 'text-right',
                        tdClassName: 'text-right',
                        total: function (data, $scope) { return withProjectFilters(data, $scope.$filter, $scope.LocationService, withFilter); }
                    },
                    {
                        name: "Available Cases per Data Category",
                        id: "summary.data_categories",
                        thClassName: 'text-center',
                        hidden: false,
                        children: [
                            {
                                name: 'Seq',
                                th: '<abbr data-uib-tooltip="Sequencing Data">Seq</abbr>',
                                id: 'Seq',
                                td: function (row, $scope) { return dataCategoryWithFilters("Sequencing Data", row, $scope.$filter); },
                                thClassName: 'text-right',
                                tdClassName: 'text-right',
                                total: function (data, $scope) { return dataCategoryTotalWithFilters("Sequencing Data", data, $scope.$filter, $scope.LocationService); }
                            },
                            {
                                name: 'Exp',
                                th: '<abbr data-uib-tooltip="Transcriptome Profiling">Exp</abbr>',
                                id: 'Exp',
                                td: function (row, $scope) { return dataCategoryWithFilters("Transcriptome Profiling", row, $scope.$filter); },
                                thClassName: 'text-right',
                                tdClassName: 'text-right',
                                total: function (data, $scope) { return dataCategoryTotalWithFilters("Transcriptome Profiling", data, $scope.$filter, $scope.LocationService); }
                            },
                            {
                                name: 'SNV',
                                th: '<abbr data-uib-tooltip="Simple Nucleotide Variation">SNV</abbr>',
                                id: 'SNV',
                                td: function (row, $scope) { return dataCategoryWithFilters("Simple Nucleotide Variation", row, $scope.$filter); },
                                thClassName: 'text-right',
                                tdClassName: 'text-right',
                                total: function (data, $scope) { return dataCategoryTotalWithFilters("Simple Nucleotide Variation", data, $scope.$filter, $scope.LocationService); }
                            },
                            {
                                name: 'CNV',
                                th: '<abbr data-uib-tooltip="Copy Number Variation">CNV</abbr>',
                                id: 'CNV',
                                td: function (row, $scope) { return dataCategoryWithFilters("Copy Number Variation", row, $scope.$filter); },
                                thClassName: 'text-right',
                                tdClassName: 'text-right',
                                total: function (data, $scope) { return dataCategoryTotalWithFilters("Copy Number Variation", data, $scope.$filter, $scope.LocationService); }
                            },
                            {
                                name: 'SV',
                                th: '<abbr data-uib-tooltip="Structural Rearrangement">SV</abbr>',
                                id: 'SV',
                                td: function (row, $scope) { return dataCategoryWithFilters("Structural Rearrangement", row, $scope.$filter); },
                                thClassName: 'text-right',
                                tdClassName: 'text-right',
                                total: function (data, $scope) { return dataCategoryTotalWithFilters("Structural Rearrangement", data, $scope.$filter, $scope.LocationService); }
                            },
                            {
                                name: 'Meth',
                                th: '<abbr data-uib-tooltip="DNA Methylation">Meth</abbr>',
                                id: 'Meth',
                                td: function (row, $scope) { return dataCategoryWithFilters("DNA Methylation", row, $scope.$filter); },
                                thClassName: 'text-right',
                                tdClassName: 'text-right',
                                total: function (data, $scope) { return dataCategoryTotalWithFilters("DNA Methylation", data, $scope.$filter, $scope.LocationService); }
                            },
                            {
                                name: 'Clinical',
                                id: 'clinical',
                                td: function (row, $scope) { return dataCategoryWithFilters("Clinical", row, $scope.$filter); },
                                thClassName: 'text-right',
                                tdClassName: 'text-right',
                                total: function (data, $scope) { return dataCategoryTotalWithFilters('Clinical', data, $scope.$filter, $scope.LocationService); }
                            },
                            {
                                name: 'Biospecimen',
                                id: 'biospecimen',
                                td: function (row, $scope) { return dataCategoryWithFilters("Biospecimen", row, $scope.$filter); },
                                thClassName: 'text-right',
                                tdClassName: 'text-right',
                                total: function (data, $scope) { return dataCategoryTotalWithFilters('Biospecimen', data, $scope.$filter, $scope.LocationService); }
                            }
                        ]
                    },
                    {
                        name: "Files",
                        id: "summary.file_count",
                        td: function (row, $scope) {
                            var fs = [{ field: 'cases.project.project_id', value: row.project_id }];
                            return withFilterF(row.summary.file_count, fs, $scope.$filter);
                        },
                        sortable: true,
                        thClassName: 'text-right',
                        tdClassName: 'text-right',
                        total: function (data, $scope) { return withProjectFilters(data, $scope.$filter, $scope.LocationService, withFilterF); }
                    },
                    {
                        name: "File Size",
                        id: "file_size",
                        td: function (row, $scope) { return row.summary && $scope.$filter("size")(row.summary.file_size); },
                        sortable: true,
                        thClassName: 'text-right',
                        tdClassName: 'text-right',
                        total: function (data, $scope) { return $scope.$filter("size")(_.sum(_.pluck(data, "summary.file_size"))); }
                    }
                ],
                fields: [
                    "disease_type",
                    "state",
                    "primary_site",
                    "project_id",
                    "name",
                    "program.name"
                ],
                expand: [
                    "summary",
                    "summary.data_categories",
                    "summary.experimental_strategies",
                ]
            };
            angular.module("projects.table.model", []).value("ProjectTableModel", projectTableModel);
        })(models = projects.models || (projects.models = {}));
    })(projects = ngApp.projects || (ngApp.projects = {}));
})(ngApp || (ngApp = {}));
