module ngApp.projects.controllers {
  import IProject = ngApp.projects.models.IProject;
  import IProjects = ngApp.projects.models.IProjects;
  import IProjectsService = ngApp.projects.services.IProjectsService;
  import ICoreService = ngApp.core.services.ICoreService;

  export interface IProjectsController {
    projects: IProjects;
  }

  class ProjectsController implements IProjectsController {
    projects: IProjects;
    /* @ngInject */
    constructor(private $scope, private ProjectsService: IProjectsService, private CoreService: ICoreService) {
      CoreService.setPageTitle("Projects");
      this.$scope.$on('$locationChangeSuccess', (event, next) => {
        if (next.indexOf('projects') !== -1) {
          this.refresh();
        }
      });
      this.refresh();
    }

    refresh() {
      this.ProjectsService.getProjects({
        fields: [
          "project_uuid",
          "project_name",
          "status",
          "program",
          "project_code",
          "_summary._participant_count",
          "_summary._analyzed_data.data_type",
          "_summary._analyzed_data._participant_count",
          "_summary._analyzed_data._file_count"
        ],
        facets: [
          "status",
          "program",
          "project_code"
        ]
      }).then((data) => this.projects = data);
    }
  }

  export interface IProjectController {
    project: IProject;
  }

  class ProjectController implements IProjectController {
    /* @ngInject */
    constructor(public project: IProject, private CoreService: ICoreService) {
      CoreService.setPageTitle("Project " + project.project_code);
    }
  }

  angular
      .module("projects.controller", [
        "projects.services",
        "core.services"
      ])
      .controller("ProjectsController", ProjectsController)
      .controller("ProjectController", ProjectController);
}
