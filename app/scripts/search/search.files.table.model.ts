module ngApp.search.models {
  function withAnnotationFilter(value: number, filters: Object[], $filter: ng.IFilterService): string {
    var filterString = $filter("makeFilter")(filters, true);
    var href = '/legacy/annotations?filters=' + filterString;
    var val = $filter("number")(value);
    return "<a href='" + href + "'>" + val + '</a>';
  }

  function withFilter(value: number, filters: Object[], $filter: ng.IFilterService): string {
    var filterString = $filter("makeFilter")(filters, true);
    var href = '/legacy/search/c?filters=' + filterString;
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
        td: row => '<add-to-cart-single-icon file="row" style="margin-right:5px"></add-to-cart-single-icon>' +
                    '<download-button data-uib-tooltip="Download" data-tooltip-popup-delay=1000 files="row"></download-button>'
      }, {
        name: "File UUID",
        id: "file_id",
        td: row => '<a href="/legacy/files/' + row.file_id + '">' + row.file_id + '</a>',
        sortable: true,
        hidden: true,
        tdClassName: 'truncated-cell'
      }, {
        name: "Access",
        id: "access",
        td: (row, $scope) => {
          var val = $scope.$filter("humanify")(row.access);
          return '<i class="fa fa-'+ (row.access === 'controlled' ? 'lock' : 'unlock-alt') +'"></i> ' + val;
        },
        sortable: true
      }, {
        name: "File Name",
        id: "file_name",
        td: row => '<a href="/legacy/files/' + row.file_id + '">' + row.file_name + '</a>',
        sortable: true,
        tdClassName: 'truncated-cell'
      }, {
        name: "Cases",
        id: "cases",
        td: row => row.cases.length,
        thClassName: 'text-right',
        tdClassName: 'text-right'
      }, {
        name: "Project",
        id: "cases.project.project_id",
        td: row => _.unique(_.map(row.cases, p => p.project.project_id)).join('<br>'),
        sortable: true
      }, {
        name: "Data Type",
        id: "data_type",
        td: row => row.data_type,
        sortable: true
      }, {
        name: "Data Format",
        id: "data_format",
        td: row => row.data_format,
        sortable: true
      }, {
        name: "Size",
        id: "file_size",
        td: (row, $scope) => $scope.$filter("size")(row.file_size),
        sortable: true,
        thClassName: 'text-right',
        tdClassName: 'text-right'
      }, {
        name: "Annotations",
        id: "annotations.annotation_id",
        td: (row, $scope) => {
          function getAnnotations(row, $scope) {
            return row.annotations.length == 1 ?
                     '<a href="/legacy/annotations/' + row.annotations[0].annotation_id + '">' + 1 + '</a>' :
                     withAnnotationFilter(
                       row.annotations.length,
                       [{field: "annotation_id", value: _.pluck(row.annotations, 'annotation_id')}],
                       $scope.$filter);
          }

          return row.annotations && row.annotations.length ? getAnnotations(row, $scope) : 0;
        },
        thClassName: 'text-right',
        tdClassName: 'text-right'
      }, {
        name: "Data Subtype",
        id: "data_subtype",
        td: (row, $scope) => row.data_subtype && $scope.$filter("humanify")(row.data_subtype),
        sortable: false,
        hidden: true
      }, {
        name: "Experimental Strategy",
        id: "experimental_strategy",
        td: (row, $scope) => row.experimental_strategy && $scope.$filter("humanify")(row.experimental_strategy),
        sortable: false,
        hidden: true
      }, {
        name: "Platform",
        id: "platform",
        td: (row, $scope) => row.platform && $scope.$filter("humanify")(row.platform),
        sortable: false,
        hidden: true
      }, {
        name: "Data Submitter",
        id: "center.name",
        td: (row, $scope) => row.center && $scope.$filter("humanify")(row.center.name),
        sortable: false,
        hidden: true
      }, {
        name: "Tags",
        id: "tags",
        td: row => (row.tags && row.tags.join(", ")) || "--",
        sortable: false,
        hidden: true
      }],
    fields: [
      "access",
      "state",
      "file_name",
      "data_type",
      "data_subtype",
      "data_format",
      "file_size",
      "file_id",
      "platform",
      "annotations.annotation_id",
      "related_files.file_id",
      "archive.archive_id",
      "experimental_strategy",
      "center.name",
      "tags"
    ],
    expand: [
      "cases",
      "cases.project",
      "cases.clinical"
    ],
    facets: [
      {name: "file_id", title: "File", collapsed: false, facetType: "free-text", placeholder: "File name or ID", removable: false },
      {name: "data_type", title: "Data Type", collapsed: false, facetType: "terms", removable: false },
      {name: "data_subtype", title: "Data Subtype", collapsed: false, facetType: "terms", removable: false },
      {name: "experimental_strategy", title: "Experimental Strategy", collapsed: false, facetType: "terms", removable: false },
      {name: "data_format", title: "Data Format", collapsed: false, facetType: "terms", removable: false },
      {name: "origin", title: "File Origin", collapsed: true, facetType: "terms", removable: false },
      {name: "platform", title: "Platform", collapsed: true, facetType: "terms", removable: false },
      {name: "access", title: "Access Level", collapsed: true, facetType: "terms", removable: false },
      {name: "center.name", title: "Data Submitter", collapsed: true, facetType: "terms", removable: false },
      {name: "state", title: "File Status", collapsed: true, facetType: "terms", removable: false },
      {name: "tags", title: "Tags", collapsed: true, facetType: "terms", removable: false }
    ]
  };
  angular.module("search.table.files.model", [])
      .value("SearchTableFilesModel", searchTableFilesModel);
}
