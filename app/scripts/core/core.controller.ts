module ngApp.core.controllers {
  import ICartService = ngApp.cart.services.ICartService;
  import INotifyService = ng.cgNotify.INotifyService;
  import IUserService = ngApp.components.user.services.IUserService;
  import IGDCConfig = ngApp.IGDCConfig;

  export interface ICoreController {
    showWarning: boolean;
    loading: boolean;
  }

  class CoreController implements ICoreController {
    showWarning: boolean = false;
    loading: boolean;
    loading5s: boolean;
    loading8s: boolean;
    loadingTimers: Promise<any>[];
    notifications: Array<Object> = [];
    numDisplayedNotifications: number = 1; // the 1 is the hardcoded banner

    /* @ngInject */
    constructor(
      public $scope: ng.IScope,
      private $rootScope: ngApp.IRootScope,
      private CartService: ICartService,
      private notify: INotifyService,
      $location: ng.ILocationService,
      private $cookies: ng.cookies.ICookiesService,
      UserService: IUserService,
      private $uibModal: any,
      private $timeout,
      private $window: IGDCWindowService,
      private $document: any,
      private Restangular: restangular.IService,
      private config: IGDCConfig,
      private $http: ng.IHttpService,
    ) {
      this.$rootScope.$on('hideBanner', () => this.numDisplayedNotifications = this.numDisplayedNotifications - 1);

      $http({
        method: 'GET',
        url: `${config.api.replace(/legacy/, '')}/notifications`
      }).then(notifications => {
        const filteredNotifications = (notifications.data || { data: [] }).data
        .filter(n => _.includes(n.components, 'LEGACY_PORTAL') || _.includes(n.components, 'LEGACY_API'))
        .map(n => {
          n.dismissed = false;
          return n;
        });
        this.notifications = _.sortBy(filteredNotifications, n => n.dismissible);
        this.numDisplayedNotifications = this.numDisplayedNotifications + this.notifications.length;
      }, (response) => {
        console.log(`error getting notifications ${JSON.stringify(response)}`);
      });

      this.loadingTimers = [];

      this.$rootScope.$on('$stateChangeStart', (event, toState, toParams, fromState, fromParams, options) => {
        UserService.login();
        this.$rootScope.$emit('ShowLoadingScreen');
      });

      this.$rootScope.$on('$stateChangeSuccess', () => this.$rootScope.$emit('ClearLoadingScreen'));

      this.$rootScope.$on('ShowLoadingScreen', (data, throttleMs) => {
        this.loadingTimers.push(this.$timeout(() => this.showLoadingScreen(), throttleMs || 500));
      });

      this.$rootScope.$on('ClearLoadingScreen', () => {
        this.clearLoadingScreen();
      });

      // display login failed warning
      if(_.get($location.search(), 'error') === 'You are not authorized to gdc services') {
        var loginWarningModal = this.$uibModal.open({
          templateUrl: "core/templates/login-failed-warning.html",
          controller: "WarningController",
          controllerAs: "wc",
          backdrop: "static",
          keyboard: false,
          backdropClass: "warning-backdrop",
          animation: false,
          size: "lg",
          resolve: {
            warning: null
          }
        });
      }

      if (!$cookies.get("browser-checked")) {
        if(bowser.msie && bowser.version <= 9) {
          var bowserWarningModal = this.$uibModal.open({
            templateUrl: "core/templates/browser-check-warning.html",
            controller: "WarningController",
            controllerAs: "wc",
            backdrop: "static",
            keyboard: false,
            backdropClass: "warning-backdrop",
            animation: false,
            size: "lg",
            resolve: {
              warning: null
            }
          });
          bowserWarningModal.result.then(() => {
            this.$cookies.put("browser-checked", "true");
          });
        } else {
            this.$cookies.put("browser-checked", "true");
        }
      }

      if (!$cookies.get("NCI-Warning")) {
        var modalInstance = this.$uibModal.open({
          templateUrl: "core/templates/warning.html",
          controller: "WarningController",
          controllerAs: "wc",
          backdrop: "static",
          keyboard: false,
          backdropClass: "warning-backdrop",
          animation: false,
          size: "lg",
          resolve: {
            warning: null
          }
        });

        modalInstance.result.then(() => {
          this.$cookies.put("NCI-Warning", "true");
        });
      }

      $scope.$on("undo", (event, action) => {
        if (action === "added") {
          CartService.undoAdded();
        } else if (action === "removed") {
          CartService.undoRemoved();
        }
        this.notify.closeAll();
      });

      this.$rootScope.undoClicked = (action: string): void => {
        this.$rootScope.$broadcast("undo", action);
      };

      this.$rootScope.cancelRequest = (): void => {
        this.$rootScope.$broadcast("gdc-cancel-request");
      };

      this.$rootScope.handleApplicationClick = (): void => {
        $scope.$broadcast('application:click');
      }
      this.$rootScope.closeWarning = () => {
        this.$rootScope.showWarning = false;
        this.$cookies.put("NCI-Warning", "true");
      };

    }

    showLoadingScreen() {
      this.loading = true;
      this.loadingTimers = this.loadingTimers.concat(
        this.$timeout(() => this.loading5s = true, 5000),
        this.$timeout(() => this.loading8s = true, 8000)
      );
    }

    clearLoadingScreen() {
      this.loading = false
      this.loading5s = false;
      this.loading8s = false;
      this.loadingTimers.forEach(x => this.$timeout.cancel(x));
    }
  }

  class WarningController {
    defaultMsg: string = `The GDC service has encountered an error. Please contact <a href="https://gdc.cancer.gov/support#gdc-help-desk" target="_blank">GDC Support</a> if the problem persists.`;

    /* @ngInject */
    constructor(private $uibModalInstance, private warning) {}
    acceptWarning(): void {
      this.$uibModalInstance.close();
    }
  }

  angular
      .module("core.controller", ["ngCookies", "user.services"])
      .controller("WarningController", WarningController)
      .controller("CoreController", CoreController);
}
