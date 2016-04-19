var ngApp;
(function (ngApp) {
    var query;
    (function (query) {
        var services;
        (function (services) {
            var QState = (function () {
                function QState() {
                    this.tabs = {
                        summary: {
                            active: false,
                            hasLoadedOnce: false
                        },
                        participants: {
                            active: false,
                            hasLoadedOnce: false
                        },
                        files: {
                            active: false,
                            hasLoadedOnce: false
                        }
                    };
                }
                QState.prototype.setActive = function (tab, key) {
                    if (tab) {
                        if (key === "active") {
                            _.each(this.tabs, function (t) {
                                t.active = false;
                            });
                            this.tabs[tab].active = true;
                        }
                        else {
                            this.tabs[tab].hasLoadedOnce = true;
                        }
                    }
                };
                return QState;
            })();
            angular.module("query.services", []).service("QState", QState);
        })(services = query.services || (query.services = {}));
    })(query = ngApp.query || (ngApp.query = {}));
})(ngApp || (ngApp = {}));
