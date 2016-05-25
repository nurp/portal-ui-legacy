module ngApp.search.models {
  function withAnnotationFilter(value: number, filters: Object[], $filter: ng.IFilterService): string {
    var filterString = $filter("makeFilter")(filters, true);
    var href = '/legacy-archive/annotations?filters=' + filterString;
    var val = $filter("number")(value);
    return "<a href='" + href + "'>" + val + '</a>';
  }

  function withFilter(value: number, filters: Object[], $filter: ng.IFilterService): string {
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
        td: row => '<add-to-cart-single-icon file="row" style="margin-right:5px"></add-to-cart-single-icon>',
        tdClassName: 'text-center'
      }, {
        name: "File UUID",
        id: "file_id",
        toolTipText: row => row.file_id,
        td: row => '<a href="/legacy-archive/files/' + row.file_id + '">' + row.file_id + '</a>',
        sortable: true,
        hidden: true,
        tdClassName: 'truncated-cell'
      }, {
        name: "File Submitter ID",
        id: "submitter_id",
        toolTipText: row => row.submitter_id,
        td: row => row.submitter_id || '--',
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
        toolTipText: row => row.file_name,
        td: row => '<a href="/legacy-archive/files/' + row.file_id + '">' + row.file_name + '</a>',
        sortable: true,
        tdClassName: 'truncated-cell'
      }, {
        name: "Cases",
        id: "cases.case_id",
        td: row => row.cases.length,
        thClassName: 'text-right',
        tdClassName: 'text-right'
      }, {
        name: "Project",
        id: "cases.project.project_id",
        toolTipText: row => _.unique(_.map(row.cases, p => p.project.name)).join(', '),
        td: row => _.unique(_.map(row.cases, p => p.project.project_id)).join('<br>') || '--',
        sortable: true
      }, {
        name: "Data Category",
        id: "data_category",
        td: row => row.data_category || '--',
        sortable: true
      }, {
        name: "Data Format",
        id: "data_format",
        td: row => row.data_format || '--',
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
                     '<a href="/legacy-archive/annotations/' + row.annotations[0].annotation_id + '">' + 1 + '</a>' :
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
        name: "Data Type",
        id: "data_type",
        td: (row, $scope) => $scope.$filter("humanify")(row.data_type),
        sortable: false,
        hidden: true
      }, {
        name: "Experimental Strategy",
        id: "experimental_strategy",
        td: (row, $scope) => $scope.$filter("humanify")(row.experimental_strategy),
        sortable: false,
        hidden: true
      }, {
        name: "Platform",
        id: "platform",
        td: (row, $scope) => row.platform || '--',
        sortable: false,
        hidden: true
      }],
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
      "submitter_id",
      "cases.case_id",
      "cases.project.project_id",
      "cases.project.name"
    ],
    facets: [
      {name: "file_id", title: "File", collapsed: false, facetType: "free-text", placeholder: "File name or ID", removable: false },
      {name: "data_category", title: "Data Category", collapsed: false, facetType: "terms", removable: false },
      {name: "data_type", title: "Data Type", collapsed: false, facetType: "terms", removable: false },
      {name: "experimental_strategy", title: "Experimental Strategy", collapsed: false, facetType: "terms", removable: false },
      {name: "data_format", title: "Data Format", collapsed: false, facetType: "terms", removable: false },
      {name: "platform", title: "Platform", collapsed: false, facetType: "terms", removable: false },
      {name: "access", title: "Access Level", collapsed: false, facetType: "terms", removable: false },
    ]
  };
  angular.module("search.table.files.model", [])
      .value("SearchTableFilesModel", searchTableFilesModel);
}
