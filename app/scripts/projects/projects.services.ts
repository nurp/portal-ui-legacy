module ngApp.projects.services {
  import IProject = ngApp.projects.models.IProject;
  import IProjects = ngApp.projects.models.IProjects;

  export interface IProjectsService {
    getProjects(params?: Object): ng.IPromise<IProjects>;
  }

  class ProjectsService implements IProjectsService {
    private ds: restangular.IElement;

    /* @ngInject */
    constructor(Restangular: restangular.IService) {
      this.ds = Restangular.all("projects");
    }

    getProjects(params): ng.IPromise<IProjects> {
      return this.ds.get("", params).then(response => response.data)
    }
  }

  angular
    .module("projects.services", [ "restangular" ])
    .service("ProjectsService", ProjectsService);
}
