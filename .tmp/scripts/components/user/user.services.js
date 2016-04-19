var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var user;
        (function (_user) {
            var services;
            (function (services) {
                var UserService = (function () {
                    /* @ngInject */
                    function UserService(AuthRestangular, $rootScope, LocationService, $cookies, $window, $uibModal, config, $log) {
                        this.AuthRestangular = AuthRestangular;
                        this.$rootScope = $rootScope;
                        this.LocationService = LocationService;
                        this.$cookies = $cookies;
                        this.$window = $window;
                        this.$uibModal = $uibModal;
                        this.config = config;
                        this.$log = $log;
                        if (config.fake_auth) {
                            this.setUser({
                                username: "DEV_USER",
                                projects: {
                                    phs_ids: {
                                        phs000178: ["_member_", "read", "delete"]
                                    },
                                    gdc_ids: {
                                        "TCGA-LAML": ["read", "delete", "read_report", "_member_"],
                                        "CGCI-BLGSP": ["read_report"],
                                        "TCGA-DEV1": ["read", "delete", "_member_"]
                                    }
                                }
                            });
                        }
                    }
                    UserService.prototype.login = function () {
                        var _this = this;
                        this.AuthRestangular.all("user").withHttpConfig({
                            withCredentials: true
                        }).post({}, {}).then(function (data) {
                            data.isFiltered = true;
                            _this.setUser(data);
                        }, function (response) {
                            if (response.status === 401) {
                                return;
                            }
                            else {
                                _this.$log.error("Error logging in, response status " + response.status);
                            }
                        });
                    };
                    UserService.prototype.getToken = function () {
                        var _this = this;
                        // TODO: We need to come up with a solution for exporting/downloading
                        // that will work with IE9 when auth tokens are required.
                        // TODO: Make this code reusable.
                        if (this.$window.URL && this.$window.URL.createObjectURL) {
                            this.AuthRestangular.all("token").withHttpConfig({
                                responseType: "blob",
                                withCredentials: true
                            }).get("", {}).then(function (file) {
                                // This endpoint receives the header 'content-disposition' which our Restangular
                                // setup alters the data.
                                _this.$window.saveAs(file.data, "gdc-user-token." + _this.$window.moment().format() + ".txt");
                            }, function (response) {
                                if (response.status === 401) {
                                    var loginWarningModal = _this.$uibModal.open({
                                        templateUrl: "core/templates/request-access-to-download-single.html",
                                        controller: "LoginToDownloadController",
                                        controllerAs: "wc",
                                        backdrop: "static",
                                        keyboard: false,
                                        backdropClass: "warning-backdrop",
                                        animation: false,
                                        size: "lg"
                                    });
                                }
                                else {
                                    _this.$log.error("Error logging in, response status " + response.status);
                                }
                            });
                        }
                    };
                    UserService.prototype.setUser = function (user) {
                        this.currentUser = { username: user.username, projects: {
                            gdc_ids: _.reduce(user.projects.gdc_ids || {}, function (acc, p, key) {
                                if (p.indexOf("_member_") !== -1) {
                                    acc.push(key);
                                }
                                return acc;
                            }, [])
                        } };
                        this.$rootScope.$broadcast("gdc-user-reset");
                    };
                    UserService.prototype.toggleFilter = function () {
                        this.$rootScope.$broadcast("gdc-user-reset");
                    };
                    UserService.prototype.hasProjects = function () {
                        if (!this.currentUser) {
                            return false;
                        }
                        var projects = _.get(this.currentUser.projects, 'gdc_ids', []);
                        return projects.length > 0;
                    };
                    UserService.prototype.isUserProject = function (file) {
                        if (!this.currentUser) {
                            return false;
                        }
                        var projectIds;
                        // Support multiple use cases
                        if (file.projects) {
                            projectIds = _.unique(_.map(file.projects, function (p) { return p.project_id || p; }));
                        }
                        else {
                            projectIds = _.unique(_.map(file.cases, function (participant) {
                                return participant.project.project_id;
                            }));
                        }
                        return !!_.intersection(projectIds, this.currentUser.projects.gdc_ids).length;
                    };
                    UserService.prototype.setUserProjectsTerms = function (terms) {
                        var _this = this;
                        if (!this.currentUser || !this.currentUser.isFiltered) {
                            return terms;
                        }
                        return _.filter(terms, function (term) {
                            return _this.isUserProject({
                                cases: [
                                    {
                                        project: {
                                            project_id: term.key
                                        }
                                    }
                                ]
                            });
                        });
                    };
                    UserService.prototype.userCanDownloadFile = function (file) {
                        return this.userCanDownloadFiles([file]);
                    };
                    UserService.prototype.userCanDownloadFiles = function (files) {
                        var _this = this;
                        return _.every(files, function (file) {
                            if (file.access === "open") {
                                return true;
                            }
                            if (file.access !== "open" && !_this.currentUser) {
                                return false;
                            }
                            if (_this.isUserProject(file)) {
                                return true;
                            }
                        });
                    };
                    UserService.prototype.addMyProjectsFilter = function (filters, key) {
                        if (this.currentUser && this.currentUser.isFiltered && _.get(this.currentUser.projects, "gdc_ids", []).length) {
                            var userProjects = {
                                content: {
                                    field: key,
                                    value: this.currentUser.projects.gdc_ids
                                },
                                op: "in"
                            };
                            if (!filters.content) {
                                filters.content = [userProjects];
                                filters.op = "and";
                            }
                            else {
                                var projectFilter = _.find(filters.content, function (filter) {
                                    if (filter.content.field === key) {
                                        return filter;
                                    }
                                    return null;
                                });
                                if (!projectFilter) {
                                    filters.content.push(userProjects);
                                }
                                else {
                                    var projects = this.currentUser.projects.gdc_ids;
                                    var sharedValues = _.intersection(projectFilter.content.value, projects);
                                    // If any of the projects selected belong to the user, stick with those rather then defaulting
                                    // to all of the users projects.
                                    if (sharedValues.length) {
                                        projectFilter.content.value = sharedValues;
                                    }
                                    else {
                                        // User is trying to search on only projects that aren't in their list.
                                        projectFilter.content.value = [""];
                                    }
                                }
                            }
                        }
                        return filters;
                    };
                    return UserService;
                })();
                angular.module("user.services", ["restangular", "location.services", "ngCookies", "ui.bootstrap"]).service("UserService", UserService);
            })(services = _user.services || (_user.services = {}));
        })(user = components.user || (components.user = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));
