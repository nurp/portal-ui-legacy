var ngApp;
(function (ngApp) {
    var cart;
    (function (cart) {
        var services;
        (function (services) {
            var QueryCartService = (function () {
                /* @ngInject */
                function QueryCartService($window, $q, FilesService, LocalStorageService) {
                    this.$window = $window;
                    this.$q = $q;
                    this.FilesService = FilesService;
                    this.LocalStorageService = LocalStorageService;
                    this.files = {
                        hits: [],
                        pagination: { total: 0 }
                    };
                    this.getFiles();
                }
                QueryCartService.prototype.pushAddedQuery = function (query) {
                    var oldQuery = this.LocalStorageService.getItem(QueryCartService.GDC_CART_ADDED_QUERY, { "op": "or", content: [] });
                    // if user clicked add all and the query is empty
                    var newQuery = { "op": "or", content: Object.keys(query).length ? oldQuery.content.concat(query) : [] };
                    this.LocalStorageService.setItem(QueryCartService.GDC_CART_ADDED_QUERY, newQuery);
                    this.getFiles();
                };
                QueryCartService.prototype.pushRemovedQuery = function (query) {
                    var oldQuery = this.LocalStorageService.getItem(QueryCartService.GDC_CART_REMOVED_QUERY, { "op": "or", content: [] });
                    var newQuery = { "op": "or", content: oldQuery.content.concat(query) };
                    this.LocalStorageService.setItem(QueryCartService.GDC_CART_REMOVED_QUERY, newQuery);
                    this.getFiles();
                };
                QueryCartService.prototype.pushAddedFiles = function (fileIds) {
                    var oldFileIds = this.LocalStorageService.getItem(QueryCartService.GDC_CART_ADDED_FILES, []);
                    this.LocalStorageService.setItem(QueryCartService.GDC_CART_ADDED_FILES, oldFileIds.concat(fileIds));
                    this.getFiles();
                };
                QueryCartService.prototype.pushRemovedFiles = function (fileIds) {
                    var oldFileIds = this.LocalStorageService.getItem(QueryCartService.GDC_CART_REMOVED_FILES, []);
                    this.LocalStorageService.setItem(QueryCartService.GDC_CART_REMOVED_FILES, oldFileIds.concat(fileIds));
                    this.getFiles();
                };
                QueryCartService.prototype.isInCart = function (fileId) {
                    //todo: better way to do this that includes the files defined by addedQuery
                    var fileIds = this.LocalStorageService.getItem(QueryCartService.GDC_CART_ADDED_FILES, []);
                    return fileIds.find(function (f) { return f === fileId; }) ? true : false;
                };
                QueryCartService.prototype.getFiles = function () {
                    var _this = this;
                    var addedQuery = this.LocalStorageService.getItem(QueryCartService.GDC_CART_ADDED_QUERY);
                    var removedQuery = this.LocalStorageService.getItem(QueryCartService.GDC_CART_REMOVED_QUERY);
                    //incomplete
                    var filters = removedQuery ? { "op": "and", "content": [addedQuery, removedQuery] } : addedQuery;
                    if (filters) {
                        return this.FilesService.getFiles({
                            fields: ["access", "file_name", "file_id", "file_size", "data_type", "data_format", "annotations.annotation_id", "cases.case_id", "cases.project.project_id", "cases.project.name"],
                            filters: filters.content.length ? filters : '',
                            size: 20,
                            from: 0
                        }).then(function (data) {
                            _this.files = data;
                            return data;
                        });
                    }
                    else {
                        // if there was no filter sending an empty query to ES returns everything
                        // so don't send a request but return an empty promise
                        return this.$q(function (resolve) {
                            var data = { hits: [], pagination: { total: 0 } };
                            _this.files = data;
                            resolve(data);
                        });
                    }
                };
                QueryCartService.GDC_CART_ADDED_QUERY = "gdc-archive-cart-added-query";
                QueryCartService.GDC_CART_REMOVED_QUERY = "gdc-archive-cart-removed-query";
                QueryCartService.GDC_CART_ADDED_FILES = "gdc-archive-cart-added-files";
                QueryCartService.GDC_CART_REMOVED_FILES = "gdc-archive-cart-removed-files";
                return QueryCartService;
            })();
            var CartService = (function () {
                /* @ngInject */
                function CartService($window, notify, UserService, $rootScope, gettextCatalog, $filter, $timeout, LocalStorageService) {
                    this.$window = $window;
                    this.notify = notify;
                    this.UserService = UserService;
                    this.$rootScope = $rootScope;
                    this.gettextCatalog = gettextCatalog;
                    this.$filter = $filter;
                    this.$timeout = $timeout;
                    this.LocalStorageService = LocalStorageService;
                    this.reloadFromLocalStorage();
                }
                CartService.prototype.reloadFromLocalStorage = function () {
                    var local_time = this.LocalStorageService.getItem(CartService.GDC_CART_UPDATE);
                    this.lastModified = local_time ? this.$window.moment(local_time) : this.$window.moment();
                    this.files = this.LocalStorageService.getItem(CartService.GDC_CART_KEY, []);
                };
                CartService.prototype.getMaxSize = function () {
                    return CartService.MAX_SIZE;
                };
                CartService.prototype.isFull = function () {
                    return this.files.length >= CartService.MAX_SIZE;
                };
                CartService.prototype.getCartVacancySize = function () {
                    return this.getMaxSize() - this.getFiles().length;
                };
                CartService.prototype.getFiles = function () {
                    return this.files;
                };
                CartService.prototype.getFile = function (fileId) {
                    return _.find(this.getFiles(), { "file_id": fileId });
                };
                CartService.prototype.getAuthorizedFiles = function () {
                    var _this = this;
                    return this.files.filter(function (file) {
                        return _this.UserService.userCanDownloadFile(file);
                    });
                };
                CartService.prototype.getUnauthorizedFiles = function () {
                    var _this = this;
                    return this.files.filter(function (file) {
                        return !_this.UserService.userCanDownloadFile(file);
                    });
                };
                CartService.prototype.isInCart = function (fileId) {
                    return _.some(this.files, { "file_id": fileId });
                };
                CartService.prototype.areInCart = function (files) {
                    var _this = this;
                    return _.every(files, function (f) { return _this.isInCart(f.file_id); });
                };
                CartService.prototype.add = function (file) {
                    this.addFiles([file]);
                };
                CartService.prototype.addFiles = function (files, displayAddingNotification) {
                    var _this = this;
                    if (displayAddingNotification === void 0) { displayAddingNotification = true; }
                    if (displayAddingNotification) {
                        var addingMsgPromise = this.$timeout(function () {
                            _this.notify({
                                message: "",
                                messageTemplate: "<span data-translate>Adding <strong>" + files.length + "</strong> files to cart</span>",
                                container: "#notification",
                                classes: "alert-info"
                            });
                        }, 1000);
                    }
                    this.lastModifiedFiles = [];
                    var alreadyIn = [];
                    _.forEach(files, function (file) {
                        if (!_this.isInCart(file.file_id)) {
                            _this.lastModifiedFiles.push(file);
                        }
                        else {
                            alreadyIn.push(file);
                        }
                    });
                    this.files = this.files.concat(this.lastModifiedFiles);
                    if (addingMsgPromise) {
                        this.$timeout.cancel(addingMsgPromise);
                    }
                    this._sync();
                    this.notify.closeAll();
                    this.notify.config({ duration: 5000 });
                    this.notify({
                        message: "",
                        messageTemplate: this.buildAddedMsg(this.lastModifiedFiles, alreadyIn),
                        container: "#notification",
                        classes: "alert-success"
                    });
                };
                CartService.prototype.sizeWarning = function () {
                    var cartAvailable = this.getCartVacancySize(), template = ["Only", this.$filter("number")(cartAvailable)];
                    if (cartAvailable !== this.getMaxSize()) {
                        if (cartAvailable > 1) {
                            template.push("more");
                            template.push("files");
                        }
                        else if (cartAvailable === 1) {
                            template.push("more");
                            template.push("file");
                        }
                        else {
                            template = ["No more files"];
                        }
                    }
                    else {
                        template.push("files");
                    }
                    template.push("can be added to the cart.");
                    template = "<span>" + this.gettextCatalog.getString(template.join(" ")) + "</span>";
                    this.notify.config({ duration: 5000 });
                    this.notify.closeAll();
                    this.notify({
                        message: "",
                        messageTemplate: template,
                        container: "#notification",
                        classes: "alert-warning"
                    });
                };
                CartService.prototype.buildAddedMsg = function (added, alreadyIn) {
                    var message = this.gettextCatalog.getPlural(added.length, "<span>Added <strong>" + _.get(_.first(added), "file_name") + "</strong> to the cart.", "<span>Added <strong>" + added.length + "</strong> files to the cart.");
                    if (alreadyIn.length) {
                        message += this.gettextCatalog.getPlural(alreadyIn.length, added.length === 0 ? "<br />The file was already in cart, not added." : "<strong>" + _.get(_.first(added), "file_name") + "</strong> already in cart, not added", "<br /><strong>" + alreadyIn.length + "</strong> files were already in cart, not added");
                    }
                    if (added.length !== 0) {
                        message += "<br /> <a data-ng-click='undoClicked(\"added\")'><i class='fa fa-undo'></i> Undo</a>";
                    }
                    return message + "</span>";
                };
                CartService.prototype.buildRemovedMsg = function (removedFiles) {
                    var message = this.gettextCatalog.getPlural(removedFiles.length, "<span>Removed <strong>" + _.get(_.first(removedFiles), "file_name") + "</strong> from the cart.", "<span>Removed <strong>" + removedFiles.length + "</strong> files from the cart.");
                    if (removedFiles.length !== 0) {
                        message += "<br /> <a data-ng-click='undoClicked(\"removed\")'><i class='fa fa-undo'></i> Undo</a>";
                    }
                    return message + "</span>";
                };
                CartService.prototype.removeAll = function () {
                    this.remove(this.files);
                };
                CartService.prototype.remove = function (filesToRemove) {
                    var partitioned = this.files.reduce(function (acc, f) {
                        var fileToRemove = _.find(filesToRemove, function (f2r) { return f2r.file_id === f.file_id; });
                        if (fileToRemove) {
                            return { remaining: acc.remaining, removed: acc.removed.concat(fileToRemove) };
                        }
                        return { remaining: acc.remaining.concat(f), removed: acc.removed };
                    }, { remaining: [], removed: [] });
                    this.lastModifiedFiles = partitioned.removed;
                    this.notify.closeAll();
                    this.notify({
                        message: "",
                        messageTemplate: this.buildRemovedMsg(this.lastModifiedFiles),
                        container: "#notification",
                        classes: "alert-warning"
                    });
                    this.files = partitioned.remaining;
                    this._sync();
                };
                CartService.prototype.getFileIds = function () {
                    return _.pluck(this.files, "file_id");
                };
                CartService.prototype.undoAdded = function () {
                    this.remove(this.lastModifiedFiles);
                };
                CartService.prototype.undoRemoved = function () {
                    this.addFiles(this.lastModifiedFiles, false);
                };
                CartService.prototype._sync = function () {
                    this.$rootScope.$broadcast("cart-update");
                    this.lastModified = this.$window.moment();
                    var filesArray = this.files.map(function (f) {
                        return {
                            access: f.access,
                            file_id: f.file_id,
                            file_size: f.file_size,
                            projects: _.map(f.cases, function (c) { return c.project.project_id; })
                        };
                    });
                    this.LocalStorageService.setItem(CartService.GDC_CART_UPDATE, this.lastModified.toISOString());
                    this.LocalStorageService.setItem(CartService.GDC_CART_KEY, filesArray);
                };
                CartService.GDC_CART_KEY = "gdc-archive-cart-items";
                CartService.GDC_CART_UPDATE = "gdc-archive-cart-updated";
                CartService.MAX_SIZE = 10000;
                return CartService;
            })();
            var State = (function () {
                function State() {
                    this.tabs = {
                        summary: {
                            active: false
                        },
                        items: {
                            active: false
                        }
                    };
                }
                State.prototype.setActive = function (section, tab) {
                    if (section && tab) {
                        _.each(this[section], function (section) {
                            section.active = false;
                        });
                        this[section][tab].active = true;
                    }
                };
                return State;
            })();
            angular.module("cart.services", [
                "ngApp.core",
                "ngApp.files",
                "cgNotify"
            ]).service("CartState", State).service("QueryCartService", QueryCartService).service("CartService", CartService);
        })(services = cart.services || (cart.services = {}));
    })(cart = ngApp.cart || (ngApp.cart = {}));
})(ngApp || (ngApp = {}));
