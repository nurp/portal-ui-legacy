var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var facets;
        (function (facets) {
            var services;
            (function (services) {
                var FacetService = (function () {
                    /* @ngInject */
                    function FacetService(LocationService, Restangular, UserService, $q) {
                        this.LocationService = LocationService;
                        this.Restangular = Restangular;
                        this.UserService = UserService;
                        this.$q = $q;
                    }
                    FacetService.prototype.autoComplete = function (entity, query, field) {
                        var projectsKeys = {
                            "files": "cases.project.project_id",
                            "cases": "project.project_id",
                            "projects": "project_id"
                        };
                        var options = {
                            query: query
                        };
                        var filters = this.LocationService.filters();
                        _.remove(filters.content, function (filter) {
                            return filter.content.field === field;
                        });
                        if (filters.content && filters.content.length > 0) {
                            filters = this.UserService.addMyProjectsFilter(filters, projectsKeys[entity]);
                            options.filters = filters;
                        }
                        return this.Restangular.all(entity + "/ids").get("", options).then(function (data) {
                            return data.data.hits.length ? data.data.hits : [{ warning: "No results found" }];
                        });
                    };
                    FacetService.prototype.searchAll = function (params) {
                        if (params.hasOwnProperty("fields")) {
                            params["fields"] = params["fields"].join();
                        }
                        if (params.hasOwnProperty("expand")) {
                            params["expand"] = params["expand"].join();
                        }
                        var abort = this.$q.defer();
                        var prom = this.Restangular.all("all").withHttpConfig({
                            timeout: abort.promise
                        }).get("", params).then(function (data) {
                            return data;
                        });
                        return prom;
                    };
                    FacetService.prototype.getActives = function (facet, terms) {
                        var filters = this.ensurePath(this.LocationService.filters());
                        var xs = [];
                        var cs = filters["content"];
                        for (var i = 0; i < filters["content"].length; i++) {
                            var c = cs[i]["content"];
                            if (facet === c["field"]) {
                                c["value"].forEach(function (v) {
                                    terms.forEach(function (t) {
                                        if (t.key === v) {
                                            xs.push(t);
                                        }
                                    });
                                });
                                break;
                            }
                        }
                        return xs;
                    };
                    FacetService.prototype.getActiveIDs = function (facet) {
                        var filters = this.ensurePath(this.LocationService.filters());
                        var xs = [];
                        var cs = filters["content"];
                        for (var i = 0; i < filters["content"].length; i++) {
                            var c = cs[i]["content"];
                            if (facet === c["field"]) {
                                c["value"].forEach(function (v) {
                                    xs.push(v);
                                });
                                break;
                            }
                        }
                        return xs;
                    };
                    FacetService.prototype.getActivesWithOperator = function (facet) {
                        var filters = this.ensurePath(this.LocationService.filters());
                        var xs = {};
                        var cs = filters["content"];
                        for (var i = 0; i < filters["content"].length; i++) {
                            var c = cs[i]["content"];
                            if (facet === c["field"]) {
                                c["value"].forEach(function (v) {
                                    xs[cs[i]["op"]] = v;
                                });
                            }
                        }
                        return xs;
                    };
                    FacetService.prototype.getActivesWithValue = function (facet) {
                        var filters = this.ensurePath(this.LocationService.filters());
                        var xs = {};
                        var cs = filters["content"];
                        for (var i = 0; i < filters["content"].length; i++) {
                            var c = cs[i]["content"];
                            if (facet === c["field"]) {
                                c["value"].forEach(function (v) {
                                    xs[facet] = v;
                                });
                            }
                        }
                        return xs;
                    };
                    FacetService.prototype.ensurePath = function (filters) {
                        if (!filters.hasOwnProperty("content")) {
                            filters = { op: "and", content: [] };
                        }
                        return filters;
                    };
                    FacetService.prototype.addTerm = function (facet, term, op) {
                        if (op === void 0) { op = 'in'; }
                        var filters = this.ensurePath(this.LocationService.filters());
                        // TODO - not like this
                        var found = false;
                        var cs = filters.content;
                        for (var i = 0; i < cs.length; i++) {
                            var c = cs[i].content;
                            if (c.field === facet && cs[i].op === op) {
                                found = true;
                                if (c.value.indexOf(term) === -1) {
                                    c.value.push(term);
                                }
                                else {
                                    return;
                                }
                                break;
                            }
                        }
                        if (!found) {
                            cs.push({
                                op: op,
                                content: {
                                    field: facet,
                                    value: [term]
                                }
                            });
                        }
                        this.LocationService.setFilters(filters);
                    };
                    FacetService.prototype.removeTerm = function (facet, term, op) {
                        var filters = this.ensurePath(this.LocationService.filters());
                        var cs = filters["content"];
                        for (var i = 0; i < cs.length; i++) {
                            var c = cs[i]["content"];
                            if (c["field"] === facet && (!op || cs[i]["op"] === op)) {
                                if (!term) {
                                    cs.splice(i, 1);
                                }
                                else {
                                    var vs = c["value"];
                                    vs.splice(vs.indexOf(term), 1);
                                    if (vs.length === 0) {
                                        cs.splice(i, 1);
                                    }
                                }
                                if (cs.length === 0) {
                                    filters = null;
                                }
                                break;
                            }
                        }
                        if (_.get(filters, "content", []).length === 0) {
                            this.LocationService.clear();
                        }
                        else {
                            this.LocationService.setFilters(filters);
                        }
                    };
                    return FacetService;
                })();
                var CustomFacetsService = (function () {
                    /* @ngInject */
                    function CustomFacetsService(Restangular, SearchTableFilesModel, SearchTableParticipantsModel, FacetsConfigService) {
                        this.Restangular = Restangular;
                        this.SearchTableFilesModel = SearchTableFilesModel;
                        this.SearchTableParticipantsModel = SearchTableParticipantsModel;
                        this.FacetsConfigService = FacetsConfigService;
                        this.ds = Restangular.all("gql/_mapping");
                    }
                    CustomFacetsService.prototype.getFacetFields = function (docType) {
                        var _this = this;
                        return this.ds.getList().then(function (data) {
                            var current = _.pluck(_this.FacetsConfigService.fieldsMap[docType], "name");
                            return _.map(_.filter(data, function (datum) { return datum.doc_type === docType && datum.field !== 'archive.revision' && !_.includes(datum.field, "_id") && !_.includes(current, datum.field) && !_.includes(docType === 'files' ? _.pluck(_this.SearchTableFilesModel.facets, "name") : _.pluck(_this.SearchTableParticipantsModel.facets, "name"), datum.field); }), function (f) { return _.merge(f, { description: 'this is a description' }); });
                        });
                    };
                    return CustomFacetsService;
                })();
                var FacetsConfigService = (function () {
                    /* @ngInject */
                    function FacetsConfigService($window, LocalStorageService) {
                        this.$window = $window;
                        this.LocalStorageService = LocalStorageService;
                        this.fieldsMap = {};
                        this.defaultFieldsMap = {};
                        this.FACET_CONFIG_KEY = "gdc-archive-facet-config";
                    }
                    FacetsConfigService.prototype.setFields = function (docType, fields) {
                        var saved = _.get(this.LocalStorageService.getItem(this.FACET_CONFIG_KEY), docType, null);
                        if (!saved) {
                            this.fieldsMap[docType] = fields;
                            this.save();
                        }
                        else {
                            this.fieldsMap[docType] = saved;
                        }
                        this.defaultFieldsMap[docType] = _.clone(fields, true);
                    };
                    FacetsConfigService.prototype.addField = function (docType, fieldName, fieldType) {
                        this.fieldsMap[docType].unshift({
                            name: fieldName,
                            title: fieldName,
                            collapsed: false,
                            facetType: fieldType === 'long' ? 'range' : fieldName.includes('datetime') ? 'datetime' : 'terms',
                            removable: true
                        });
                        this.save();
                    };
                    FacetsConfigService.prototype.removeField = function (docType, fieldName) {
                        this.fieldsMap[docType] = _.reject(this.fieldsMap[docType], function (facet) {
                            return facet.name === fieldName;
                        });
                        this.save();
                    };
                    FacetsConfigService.prototype.reset = function (docType) {
                        this.fieldsMap[docType] = _.clone(this.defaultFieldsMap[docType], true);
                        this.save();
                    };
                    FacetsConfigService.prototype.isDefault = function (docType) {
                        return this.fieldsMap[docType].length === this.defaultFieldsMap[docType].length;
                    };
                    FacetsConfigService.prototype.save = function () {
                        this.LocalStorageService.setItem(this.FACET_CONFIG_KEY, this.fieldsMap);
                    };
                    return FacetsConfigService;
                })();
                angular.module("facets.services", [
                    "location.services",
                    "restangular",
                    "user.services",
                    "ngApp.core"
                ]).service("CustomFacetsService", CustomFacetsService).service("FacetsConfigService", FacetsConfigService).service("FacetService", FacetService);
            })(services = facets.services || (facets.services = {}));
        })(facets = components.facets || (components.facets = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));
