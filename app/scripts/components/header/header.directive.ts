module ngApp.components.header.directives {

  import IHeaderController = ngApp.components.header.controllers.IHeaderController;

  function header(): ng.IDirective {
    return {
      restrict: "E",
      templateUrl: "components/header/templates/header.html",
      controller: "HeaderController as hc",
      scope: {
        notifications: '=',
      },
    };
  }

  /* @ngInject */
  function banner(): ng.IDirective {
    return {
      restrict: "E",
      replace: true,
      templateUrl: "components/header/templates/banner.html",
      scope: {
        notificationId: '@',
        level: '@',
        message: '@',
        dismissible: '=',
      },
      link: ($scope: ng.IScope) => {
        if (angular.isUndefined($scope.dismissible) || $scope.dismissible === null) {
          $scope.dismissible = true;
        }
        $scope.dismissed = false;
        $scope.dismiss = () => {
          $scope.dismissed = true;
          $scope.$emit('hideBanner');
        };
      }
    };
  }

  angular
      .module("header.directives", ["ngAnimate"])
      .directive("banner", banner)
      .directive("ngaHeader", header);
}
