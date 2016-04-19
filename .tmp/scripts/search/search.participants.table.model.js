var ngApp;
(function (ngApp) {
    var search;
    (function (search) {
        var models;
        (function (models) {
            function withAnnotationFilter(value, filters, $filter) {
                var filterString = $filter("makeFilter")(filters, true);
                var href = 'annotations?filters=' + filterString;
                var val = '{{' + value + '|number:0}}';
                return "<a href='" + href + "'>" + val + '</a>';
            }
            function withFilter(value, filters, $filter) {
                var filterString = $filter("makeFilter")(filters, true);
                var href = 'search/f?filters=' + filterString;
                var val = '{{' + value + '|number:0}}';
                return value ? "<a href='" + href + "'>" + val + '</a>' : '0';
            }
            function getDataType(dataTypes, dataType) {
                var data = _.find(dataTypes, { data_type: dataType });
                return data ? data.file_count : 0;
            }
            function dataTypeWithFilters(dataType, row, $filter) {
                var fs = [
                    { field: 'cases.case_id', value: row.case_id },
                    { field: 'files.data_type', value: dataType }
                ];
                return withFilter(getDataType(row.summary ? row.summary.data_types : [], dataType), fs, $filter);
            }
            function youngestDiagnosis(p, c) {
                return c.age_at_diagnosis < p.age_at_diagnosis ? c : p;
            }
            var searchParticipantsModel = {
                title: 'Cases',
                rowId: 'case_id',
                headings: [{
                    name: "Cart",
                    id: "add_to_cart_filtered",
                    td: function (row) { return '<add-to-cart-filtered row="row"></add-to-cart-filtered>'; },
                    tdClassName: 'text-center'
                }, {
                    name: "My Projects",
                    id: "my_projects",
                    td: function (row, $scope) {
                        var fakeFile = { cases: [{ project: row.project }] };
                        var isUserProject = $scope.UserService.isUserProject(fakeFile);
                        var icon = isUserProject ? 'check' : 'remove';
                        return '<i class="fa fa-' + icon + '"></i>';
                    },
                    inactive: function ($scope) { return !$scope.UserService.currentUser || $scope.UserService.currentUser.isFiltered; },
                    hidden: false,
                    tdClassName: "text-center"
                }, {
                    name: "Case UUID",
                    id: "case_id",
                    td: function (row) { return '<a href="cases/' + row.case_id + '">' + row.case_id + '</a>'; },
                    tdClassName: 'truncated-cell'
                }, {
                    name: "Project",
                    id: "project.project_id",
                    td: function (row) { return '<a href="projects/' + row.project.project_id + '" data-uib-tooltip="' + row.project.name + '" data-tooltip-popup-delay=1000' + '" data-tooltip-append-to-body="true">' + row.project.project_id + '</a>'; },
                    sortable: true,
                }, {
                    name: "Primary Site",
                    id: "project.primary_site",
                    td: function (row) { return row.project && row.project.primary_site; },
                    sortable: true
                }, {
                    name: "Gender",
                    id: "demographic.gender",
                    td: function (row, $scope) { return row.demographic && $scope.$filter("humanify")(row.demographic.gender) || '--'; },
                    sortable: true
                }, {
                    name: "Files",
                    id: "files",
                    td: function (row, $scope) {
                        var fs = [{ field: 'cases.case_id', value: row.case_id }];
                        var sum = _.sum(_.pluck(row.summary ? row.summary.data_types : [], 'file_count'));
                        return withFilter(sum, fs, $scope.$filter);
                    },
                    thClassName: 'text-right',
                    tdClassName: 'text-right'
                }, {
                    name: "Available Files per Data Type",
                    id: "summary.data_types",
                    thClassName: 'text-center',
                    children: [
                        {
                            name: 'Clinical',
                            id: 'clinical',
                            td: function (row, $scope) { return dataTypeWithFilters("Clinical", row, $scope.$filter); },
                            thClassName: 'text-right',
                            tdClassName: 'text-right'
                        },
                        {
                            name: 'Array',
                            th: '<abbr data-uib-tooltip="Raw microarray data">Array</abbr>',
                            id: 'Array',
                            td: function (row, $scope) { return dataTypeWithFilters("Raw microarray data", row, $scope.$filter); },
                            thClassName: 'text-right',
                            tdClassName: 'text-right'
                        },
                        {
                            name: 'Seq',
                            th: '<abbr data-uib-tooltip="Raw sequencing data">Seq</abbr>',
                            id: 'Seq',
                            td: function (row, $scope) { return dataTypeWithFilters("Raw sequencing data", row, $scope.$filter); },
                            thClassName: 'text-right',
                            tdClassName: 'text-right'
                        },
                        {
                            name: "SNV",
                            th: '<abbr data-uib-tooltip="Simple nucleotide variation">SNV</abbr>',
                            id: "SNV",
                            td: function (row, $scope) { return dataTypeWithFilters("Simple nucleotide variation", row, $scope.$filter); },
                            thClassName: 'text-right',
                            tdClassName: 'text-right'
                        },
                        {
                            name: 'CNV',
                            th: '<abbr data-uib-tooltip="Copy number variation">CNV</abbr>',
                            id: 'cnv',
                            td: function (row, $scope) { return dataTypeWithFilters("Copy number variation", row, $scope.$filter); },
                            thClassName: 'text-right',
                            tdClassName: 'text-right'
                        },
                        {
                            name: 'SV',
                            th: '<abbr data-uib-tooltip="Structural rearrangement">SV</abbr>',
                            id: 'sv',
                            td: function (row, $scope) { return dataTypeWithFilters("Structural rearrangement", row, $scope.$filter); },
                            thClassName: 'text-right',
                            tdClassName: 'text-right'
                        },
                        {
                            name: 'Exp',
                            th: '<abbr data-uib-tooltip="Gene expression">Exp</abbr>',
                            id: 'Exp',
                            td: function (row, $scope) { return dataTypeWithFilters("Gene expression", row, $scope.$filter); },
                            thClassName: 'text-right',
                            tdClassName: 'text-right'
                        },
                        {
                            name: 'PExp',
                            th: '<abbr data-uib-tooltip="Protein expression">PExp</abbr>',
                            id: 'pexp',
                            td: function (row, $scope) { return dataTypeWithFilters("Protein expression", row, $scope.$filter); },
                            thClassName: 'text-right',
                            tdClassName: 'text-right'
                        },
                        {
                            name: 'Meth',
                            th: '<abbr data-uib-tooltip="DNA methylation">Meth</abbr>',
                            id: 'meth',
                            td: function (row, $scope) { return dataTypeWithFilters("DNA methylation", row, $scope.$filter); },
                            thClassName: 'text-right',
                            tdClassName: 'text-right'
                        },
                        {
                            name: 'Other',
                            id: 'other',
                            td: function (row, $scope) { return dataTypeWithFilters("Other", row, $scope.$filter); },
                            thClassName: 'text-right',
                            tdClassName: 'text-right'
                        }
                    ]
                }, {
                    name: "Annotations",
                    id: "annotations.annotation_id",
                    td: function (row, $scope) {
                        function getAnnotations(row, $filter) {
                            return row.annotations.length == 1 ? '<a href="annotations/' + row.annotations[0].annotation_id + '">' + 1 + '</a>' : withAnnotationFilter(row.annotations.length, [{ field: "annotation_id", value: _.pluck(row.annotations, 'annotation_id') }], $filter);
                        }
                        return row.annotations && row.annotations.length ? getAnnotations(row, $scope.$filter) : 0;
                    },
                    thClassName: 'text-right',
                    tdClassName: 'text-right'
                }, {
                    name: 'Program',
                    id: 'project.program.name',
                    td: function (row, $scope) { return row.project && $scope.$filter("humanify")(row.project.program.name); },
                    sortable: false,
                    hidden: true
                }, {
                    name: 'Disease Type',
                    id: 'project.disease_type',
                    td: function (row, $scope) { return row.project && $scope.$filter("humanify")(row.project.disease_type); },
                    sortable: false,
                    hidden: true
                }, {
                    name: 'Age at diagnosis',
                    id: 'diagnoses.age_at_diagnosis',
                    td: function (row, $scope) {
                        // Use diagnosis with minimum age
                        const age = (row.diagnoses || []).reduce(function (p, c) { return c.age_at_diagnosis < p ? c.age_at_diagnosis : p; }, Infinity);
                        return age !== Infinity && row.diagnoses ? $scope.$filter("ageDisplay")(age) : "--";
                    },
                    sortable: false,
                    hidden: true
                }, {
                    name: 'Days to death',
                    id: 'diagnoses.days_to_death',
                    td: function (row, $scope) {
                        const primaryDiagnosis = (row.diagnoses || []).reduce(youngestDiagnosis, { age_at_diagnosis: Infinity });
                        return (row.diagnoses && $scope.$filter("number")(primaryDiagnosis.days_to_death, 0)) || "--";
                    },
                    sortable: false,
                    hidden: true
                }, {
                    name: 'Vital Status',
                    id: 'diagnoses.vital_status',
                    td: function (row, $scope) {
                        const primaryDiagnosis = (row.diagnoses || []).reduce(youngestDiagnosis, { age_at_diagnosis: Infinity });
                        return row.diagnoses && $scope.$filter("humanify")(primaryDiagnosis.vital_status);
                    },
                    sortable: false,
                    hidden: true
                }, {
                    name: 'Year of diagnosis',
                    id: 'diagnoses.year_of_diagnosis',
                    td: function (row, $scope) {
                        const primaryDiagnosis = (row.diagnoses || []).reduce(youngestDiagnosis, { age_at_diagnosis: Infinity });
                        return (row.diagnoses && primaryDiagnosis.year_of_diagnosis) || "--";
                    },
                    sortable: false,
                    hidden: true
                }, {
                    name: 'ICD-10',
                    id: 'icd_10',
                    td: function (row, $scope) { return (row.clinical && row.clinical.icd_10) || "--"; },
                    sortable: false,
                    hidden: true
                }, {
                    name: 'Ethnicity',
                    id: 'demographic.ethnicity',
                    td: function (row, $scope) { return row.demographic && $scope.$filter("humanify")(row.demographic.ethnicity); },
                    sortable: false,
                    hidden: true
                }, {
                    name: 'Race',
                    id: 'demographic.race',
                    td: function (row, $scope) { return row.demographic && $scope.$filter("humanify")(row.demographic.race); },
                    sortable: false,
                    hidden: true
                }, {
                    name: 'Submitter ID',
                    id: 'submitter_id',
                    td: function (row, $scope) { return row.submitter_id; },
                    sortable: false,
                    hidden: true
                }],
                fields: [
                    "case_id",
                    "annotations.annotation_id",
                    "project.project_id",
                    "project.name",
                    "project.primary_site",
                    "project.program.name",
                    "project.disease_type",
                    "submitter_id"
                ],
                expand: [
                    "summary.data_types",
                    "clinical",
                    "demographic",
                    "diagnoses"
                ],
                facets: [
                    { name: "case_id", title: "Case", collapsed: false, facetType: "free-text", placeholder: "Case Barcode or Uuid" },
                    { name: "project.primary_site", title: "Primary Site", collapsed: false, facetType: "terms" },
                    { name: "project.program.name", title: "Cancer Program", collapsed: false, facetType: "terms" },
                    { name: "project.project_id", title: "Project", collapsed: false, facetType: "terms" },
                    { name: "project.disease_type", title: "Disease Type", collapsed: false, facetType: "terms" },
                    { name: "demographic.gender", title: "Gender", collapsed: true, facetType: "terms" },
                    { name: "diagnoses.age_at_diagnosis", title: "Age at diagnosis", hasGraph: true, collapsed: false, facetType: "range", unitsMap: [
                        {
                            "label": "years",
                            "conversionDivisor": 365,
                        },
                        {
                            "label": "days",
                            "conversionDivisor": 1,
                        }
                    ] },
                    { name: "diagnoses.vital_status", title: "Vital Status", collapsed: false, facetType: "terms" },
                    { name: "diagnoses.days_to_death", title: "Days to Death", collapsed: true, facetType: "range", hasGraph: true },
                    { name: "demographic.race", title: "Race", collapsed: true, facetType: "terms" },
                    { name: "demographic.ethincity", title: "Ethnicity", collapsed: true, facetType: "terms" }
                ]
            };
            angular.module("search.table.participants.model", []).value("SearchTableParticipantsModel", searchParticipantsModel);
        })(models = search.models || (search.models = {}));
    })(search = ngApp.search || (ngApp.search = {}));
})(ngApp || (ngApp = {}));
