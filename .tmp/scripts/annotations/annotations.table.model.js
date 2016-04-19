var ngApp;
(function (ngApp) {
    var projects;
    (function (projects) {
        var models;
        (function (models) {
            var AnnotationsTableModel = {
                title: "Annotations",
                rowId: 'annotation_id',
                headings: [
                    {
                        name: "ID",
                        id: "annotation_id",
                        td: function (row) { return '<a href="/legacy-archive/annotations/' + row.annotation_id + '">' + row.annotation_id + '</a>'; },
                        sortable: true,
                        tdClassName: 'truncated-cell'
                    },
                    {
                        name: "Case UUID",
                        id: "case_id",
                        td: function (row) { return row.case_id; },
                        sortable: true,
                        tdClassName: 'truncated-cell'
                    },
                    {
                        name: "Program",
                        id: "project.program.name",
                        td: function (row) { return row.project && row.project.program && row.project.program.name; },
                        sortable: true,
                        hidden: true
                    },
                    {
                        name: "Project",
                        id: "project.project_id",
                        td: function (row) { return row.project.project_id; },
                        sortable: true
                    },
                    {
                        name: "Entity Type",
                        id: "entity_type",
                        td: function (row) { return row.entity_type; },
                        sortable: true
                    },
                    {
                        name: "Entity ID",
                        id: "entity_id",
                        td: function (row) { return row.entity_id; },
                        sortable: true,
                        tdClassName: 'truncated-cell'
                    },
                    {
                        name: "Entity Barcode",
                        id: "entity_submitter_id",
                        td: function (row) { return row.entity_submitter_id; },
                        sortable: true,
                        hidden: true
                    },
                    {
                        name: "Category",
                        id: "category",
                        td: function (row) { return row.category; },
                        sortable: true
                    },
                    {
                        name: "Classification",
                        id: "classification",
                        td: function (row) { return row.classification; },
                        sortable: true
                    },
                    {
                        name: "Created Date",
                        id: "created_datetime",
                        td: function (row, $scope) { return row.created_datetime && $scope.$filter('date')(row.created_datetime, 'yyyy-MM-dd'); },
                    },
                    {
                        name: "Annotator",
                        id: "creator",
                        td: function (row) { return row.creator; },
                        sortable: true
                    },
                    {
                        name: "Status",
                        id: "status",
                        td: function (row) { return row.status; },
                        sortable: true,
                        hidden: true
                    },
                    {
                        name: "Notes",
                        id: "notes",
                        td: function (row) { return row.notes; },
                        sortable: false,
                        hidden: true
                    }
                ],
                fields: [
                    "annotation_id",
                    "category",
                    "created_datetime",
                    "creator",
                    "status",
                    "entity_type",
                    "entity_id",
                    "entity_submitter_id",
                    "notes",
                    "classification",
                    "case_id",
                    "notes",
                    "project.program.name"
                ],
                expand: [
                    "project"
                ]
            };
            angular.module("annotations.table.model", []).value("AnnotationsTableModel", AnnotationsTableModel);
        })(models = projects.models || (projects.models = {}));
    })(projects = ngApp.projects || (ngApp.projects = {}));
})(ngApp || (ngApp = {}));
