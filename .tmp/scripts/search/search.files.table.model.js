var ngApp;
(function (ngApp) {
    var search;
    (function (search) {
        var models;
        (function (models) {
            function withAnnotationFilter(value, filters, $filter) {
                var filterString = $filter("makeFilter")(filters, true);
                var href = '/legacy-archive/annotations?filters=' + filterString;
                var val = $filter("number")(value);
                return "<a href='" + href + "'>" + val + '</a>';
            }
            function withFilter(value, filters, $filter) {
                var filterString = $filter("makeFilter")(filters, true);
                var href = '/search/c?filters=' + filterString;
                var val = $filter("number")(value);
                return "<a href='" + href + "'>" + val + '</a>';
            }
            var searchTableFilesModel = {
                title: 'Files',
                rowId: 'file_id',
                headings: [
                    {
                        th: '<add-to-cart-all-dropdown data-files="data" data-size="{{paging.total}}" />',
                        name: 'Add to Cart',
                        id: "file_actions",
                        td: function (row) { return '<add-to-cart-single-icon file="row" style="margin-right:5px"></add-to-cart-single-icon>' + '<download-button data-uib-tooltip="Download" data-tooltip-popup-delay=1000 files="row"></download-button>'; }
                    },
                    {
                        name: "File UUID",
                        id: "file_id",
                        toolTipText: function (row) { return row.file_id; },
                        td: function (row) { return '<a href="/legacy-archive/files/' + row.file_id + '">' + row.file_id + '</a>'; },
                        sortable: true,
                        hidden: true,
                        tdClassName: 'truncated-cell'
                    },
                    {
                        name: "File Submitter ID",
                        id: "submitter_id",
                        toolTipText: function (row) { return row.submitter_id; },
                        td: function (row) { return row.submitter_id; },
                        sortable: true,
                        hidden: true,
                        tdClassName: 'truncated-cell'
                    },
                    {
                        name: "Access",
                        id: "access",
                        td: function (row, $scope) {
                            var val = $scope.$filter("humanify")(row.access);
                            return '<i class="fa fa-' + (row.access === 'controlled' ? 'lock' : 'unlock-alt') + '"></i> ' + val;
                        },
                        sortable: true
                    },
                    {
                        name: "File Name",
                        id: "file_name",
                        toolTipText: function (row) { return row.file_name; },
                        td: function (row) { return '<a href="/legacy-archive/files/' + row.file_id + '">' + row.file_name + '</a>'; },
                        sortable: true,
                        tdClassName: 'truncated-cell'
                    },
                    {
                        name: "Cases",
                        id: "cases",
                        td: function (row) { return row.cases.length; },
                        thClassName: 'text-right',
                        tdClassName: 'text-right'
                    },
                    {
                        name: "Project",
                        id: "cases.project.project_id",
                        toolTipText: function (row) { return _.unique(_.map(row.cases, function (p) { return p.project.name; })).join(', '); },
                        td: function (row) { return _.unique(_.map(row.cases, function (p) { return p.project.project_id; })).join('<br>'); },
                        sortable: true
                    },
                    {
                        name: "Data Category",
                        id: "data_category",
                        td: function (row) { return row.data_category; },
                        sortable: true
                    },
                    {
                        name: "Data Format",
                        id: "data_format",
                        td: function (row) { return row.data_format; },
                        sortable: true
                    },
                    {
                        name: "Size",
                        id: "file_size",
                        td: function (row, $scope) { return $scope.$filter("size")(row.file_size); },
                        sortable: true,
                        thClassName: 'text-right',
                        tdClassName: 'text-right'
                    },
                    {
                        name: "Annotations",
                        id: "annotations.annotation_id",
                        td: function (row, $scope) {
                            function getAnnotations(row, $scope) {
                                return row.annotations.length == 1 ? '<a href="/legacy-archive/annotations/' + row.annotations[0].annotation_id + '">' + 1 + '</a>' : withAnnotationFilter(row.annotations.length, [{ field: "annotation_id", value: _.pluck(row.annotations, 'annotation_id') }], $scope.$filter);
                            }
                            return row.annotations && row.annotations.length ? getAnnotations(row, $scope) : 0;
                        },
                        thClassName: 'text-right',
                        tdClassName: 'text-right'
                    },
                    {
                        name: "Data Type",
                        id: "data_type",
                        td: function (row, $scope) { return row.data_type && $scope.$filter("humanify")(row.data_type); },
                        sortable: false,
                        hidden: true
                    },
                    {
                        name: "Experimental Strategy",
                        id: "experimental_strategy",
                        td: function (row, $scope) { return row.experimental_strategy && $scope.$filter("humanify")(row.experimental_strategy); },
                        sortable: false,
                        hidden: true
                    },
                    {
                        name: "Platform",
                        id: "platform",
                        td: function (row, $scope) { return row.platform && $scope.$filter("humanify")(row.platform); },
                        sortable: false,
                        hidden: true
                    }
                ],
                fields: [
                    "access",
                    "state",
                    "file_name",
                    "data_category",
                    "data_type",
                    "data_format",
                    "file_size",
                    "file_id",
                    "platform",
                    "annotations.annotation_id",
                    "related_files.file_id",
                    "archive.archive_id",
                    "experimental_strategy",
                    "center.name",
                ],
                expand: [
                    "cases",
                    "cases.project",
                    "cases.clinical"
                ],
                facets: [
                    { name: "file_id", title: "File", collapsed: false, facetType: "free-text", placeholder: "File name or ID", removable: false },
                    { name: "data_category", title: "Data Category", collapsed: false, facetType: "terms", removable: false },
                    { name: "data_type", title: "Data Type", collapsed: false, facetType: "terms", removable: false },
                    { name: "experimental_strategy", title: "Experimental Strategy", collapsed: false, facetType: "terms", removable: false },
                    { name: "data_format", title: "Data Format", collapsed: false, facetType: "terms", removable: false },
                    { name: "platform", title: "Platform", collapsed: true, facetType: "terms", removable: false },
                    { name: "access", title: "Access Level", collapsed: true, facetType: "terms", removable: false },
                    { name: "state", title: "File Status", collapsed: true, facetType: "terms", removable: false },
                ]
            };
            angular.module("search.table.files.model", []).value("SearchTableFilesModel", searchTableFilesModel);
        })(models = search.models || (search.models = {}));
    })(search = ngApp.search || (ngApp.search = {}));
})(ngApp || (ngApp = {}));
