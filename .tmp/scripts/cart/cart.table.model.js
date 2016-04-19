var ngApp;
(function (ngApp) {
    var cart;
    (function (cart) {
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
                var href = 'search/c?filters=' + filterString;
                var val = '{{' + value + '|number:0}}';
                return "<a href='" + href + "'>" + val + '</a>';
            }
            var CartTableModel = {
                title: 'Cart',
                rowId: 'file_id',
                headings: [
                    {
                        name: "Action",
                        id: "file_actions",
                        td: function (row) { return '<download-button data-tooltip="Download" data-tooltip-popup-delay=1000 files="row" style="margin-right: 10%"></download-button>' + '<remove-single-cart file="row" />'; },
                        tdClassName: "text-center"
                    },
                    {
                        name: "My Projects",
                        id: "my_projects",
                        td: function (row, $scope) {
                            var isUserProject = $scope.UserService.isUserProject(row);
                            var icon = isUserProject ? 'check' : 'remove';
                            return '<i class="fa fa-' + icon + '"></i>';
                        },
                        inactive: function ($scope) { return !$scope.UserService.currentUser; },
                        hidden: false,
                        tdClassName: "text-center"
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
                        td: function (row) { return '<a href="files/' + row.file_id + '">' + row.file_name + '</a>'; },
                        sortable: true,
                        tdClassName: 'truncated-cell'
                    },
                    {
                        name: "Cases",
                        id: "cases",
                        td: function (row, $scope) {
                            function getParticipants(row, $filter) {
                                return row.cases.length == 1 ? '<a href="cases/' + row.cases[0].case_id + '">1</a>' : withFilter(row.cases.length, [{ field: "files.file_id", value: row.file_id }], $filter);
                            }
                            //debugger
                            return row.cases.length ? getParticipants(row, $scope.$filter) : 0;
                        },
                        thClassName: 'text-right',
                        tdClassName: 'text-right'
                    },
                    {
                        name: "Project",
                        id: "cases.project.project_id",
                        td: function (row) {
                            return _.unique(row.cases, function (c) { return c.project.project_id; }).map(function (c) {
                                return ('<a href="projects/' + c.project.project_id + '" data-tooltip="' + c.project.name + '" data-tooltip-append-to-body="true" data-tooltip-placement="right">' + c.project.project_id + '</a>');
                            }).join('<br>');
                        },
                        sortable: true
                    },
                    {
                        name: "Data Type",
                        id: "data_type",
                        td: function (row) { return row.data_type; },
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
                        id: "annotations",
                        td: function (row, $scope) {
                            function getAnnotations(row, $scope) {
                                return row.annotations.length === 1 ? '<a href="annotations/' + row.annotations[0].annotation_id + '">' + 1 + '</a>' : withAnnotationFilter(row.annotations.length, [{ field: "annotation_id", value: row.annotations.map(function (a) { return a.annotation_id; }) }], $scope.$filter);
                            }
                            return row.annotations ? getAnnotations(row, $scope) : 0;
                        },
                        thClassName: 'text-right',
                        tdClassName: 'text-right'
                    }
                ]
            };
            angular.module("cart.table.model", []).value("CartTableModel", CartTableModel);
        })(models = cart.models || (cart.models = {}));
    })(cart = ngApp.cart || (ngApp.cart = {}));
})(ngApp || (ngApp = {}));
