/// <reference path="./types.ts"/>
// Cross-Site Request Forgery (CSRF) Prevention
// https://www.owasp.org/index.php/Cross-Site_Request_Forgery_(CSRF)_Prevention_Cheat_Sheet#General_Recommendation:_Synchronizer_Token_Pattern
function addTokenToRequest(element, operation, route, url, headers, params, httpConfig) {
    var csrftoken = document.cookie.replace(/(?:(?:^|.*;\s*)csrftoken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    return {
        element: element,
        headers: _.extend(headers, { 'X-CSRFToken': csrftoken }),
        params: params,
        httpConfig: httpConfig
    };
}
/* @ngInject */
function appConfig($urlRouterProvider, $locationProvider, RestangularProvider, config, $compileProvider, $httpProvider) {
    $compileProvider.debugInfoEnabled(!config.production);
    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise("search/f");
    RestangularProvider.setBaseUrl(config.api);
    RestangularProvider.setDefaultHttpFields({
        cache: true
    });
    /**
    The regex is from https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie in Example #2.
    Cookies are stored in document.cookie as "cookieName1=cookieValue; cookieName2=cookieValue"
    so the capturing group after the "csrftoken=" captures the value and places it into var csrftoken.
    Unable to use $cookies because services can't be injected in config step
    **/
    var csrftoken = document.cookie.replace(/(?:(?:^|.*;\s*)csrftoken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    $httpProvider.defaults.headers.common['X-CSRFToken'] = csrftoken;
}
/* @ngInject */
function appRun(gettextCatalog, Restangular, $state, CoreService, $rootScope, config, notify, $cookies, UserService, ProjectsService, $window, $uibModal, LocalStorageService) {
    if ($cookies.get("GDC-Portal-Sha") !== config.commitHash) {
        $cookies.put("GDC-Portal-Sha", config.commitHash);
        [
            "gdc-archive-Annotations-col",
            "gdc-archive-Files-col",
            "gdc-archive-Cart-col",
            "gdc-archive-cart-items",
            "gdc-archive-cart-updated",
            "gdc-archive-facet-config",
        ].forEach(function (item) { return LocalStorageService.removeItem(item); });
    }
    gettextCatalog.debug = true;
    $rootScope.config = config;
    Restangular.addFullRequestInterceptor(addTokenToRequest);
    Restangular.setErrorInterceptor(function (response) {
        CoreService.xhrDone();
        if (response.status === 500) {
            $uibModal.open({
                templateUrl: "core/templates/internal-server-error.html",
                controller: "WarningController",
                controllerAs: "wc",
                backdrop: "static",
                keyboard: false,
                backdropClass: "warning-backdrop",
                animation: false,
                size: "lg"
            });
        }
        // TODO more than just 404
        //$state.go("404", {}, {inherit: true});
    });
    Restangular.addResponseInterceptor(function (data, operation, model, url, response, deferred) {
        // Ajax
        CoreService.xhrDone();
        if (response.headers('content-disposition')) {
            return deferred.resolve({ 'data': data, 'headers': response.headers() });
        }
        else {
            return deferred.resolve(data);
        }
    });
    Restangular.all('status').get('').then(function (data) {
        config.apiVersion = data['tag'];
        config.apiCommitHash = data['commit'];
        config.apiTag = "https://github.com/NCI-GDC/gdcapi/releases/tag/" + config.apiVersion;
        config.apiCommitLink = "https://github.com/NCI-GDC/gdcapi/commit/" + config.apiCommitHash;
        if (+data.version !== +config.supportedAPI) {
            config.apiIsMismatched = true;
        }
    }, function (response) {
        notify.config({ duration: 60000 });
        notify.closeAll();
        notify({
            message: "",
            messageTemplate: "<span>Unable to connect to the GDC API. Make sure you have " + "accepted the Security Certificate. <br>If not, please click " + "<a target='_blank' href='" + config.api + "/status'>here</a> and accept the Security Certificate</span>",
            container: "#notification",
            classes: "alert-danger"
        });
    });
    UserService.login();
    ProjectsService.getProjects({
        size: 100
    }).then(function (data) {
        var mapping = {};
        _.each(data.hits, function (project) {
            mapping[project.project_id] = project.name;
        });
        ProjectsService.projectIdMapping = mapping;
    });
    $rootScope.$on("$stateChangeStart", function () {
        // Page change
        //CoreService.setLoadedState(false);
        // Close all notifcation windows
        notify.closeAll();
    });
    $rootScope.$on("$stateChangeSuccess", function () {
        // Page change
        CoreService.setLoadedState(true);
    });
}
angular.module("ngApp", [
    "cgNotify",
    "ngProgressLite",
    "ngAnimate",
    "ngAria",
    "ngCookies",
    "ngSanitize",
    "ngApp.config",
    "ui.router.state",
    "ui.bootstrap",
    "restangular",
    "gettext",
    "ngTagsInput",
    "ui.sortable",
    "ngApp.core",
    "ngApp.search",
    "ngApp.query",
    "ngApp.participants",
    "ngApp.files",
    "ngApp.annotations",
    "ngApp.projects",
    "ngApp.components",
    "ngApp.cart",
    "ngApp.cases",
    "ngApp.notFound",
    "templates"
]).config(appConfig).factory('RestFullResponse', function (Restangular) {
    return Restangular.withConfig(function (RestangularConfigurer) {
        RestangularConfigurer.setFullResponse(true);
    }).addFullRequestInterceptor(addTokenToRequest);
}).run(appRun).factory('AuthRestangular', function (Restangular, config, CoreService) {
    return Restangular.withConfig(function (RestangularConfigurer) {
        RestangularConfigurer.setBaseUrl(config.auth);
    }).addFullRequestInterceptor(addTokenToRequest).addResponseInterceptor(function (data, operation, model, url, response, deferred) {
        // Ajax
        CoreService.xhrDone();
        if (response.headers('content-disposition')) {
            return deferred.resolve({ 'data': data, 'headers': response.headers() });
        }
        else {
            return deferred.resolve(data);
        }
    });
});
