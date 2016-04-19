var ngApp;
(function (ngApp) {
    var core;
    (function (core) {
        var services;
        (function (services) {
            var CoreService = (function () {
                /* @ngInject */
                function CoreService($rootScope, $state, ngProgressLite, gettextCatalog) {
                    this.$rootScope = $rootScope;
                    this.$state = $state;
                    this.ngProgressLite = ngProgressLite;
                    this.gettextCatalog = gettextCatalog;
                    this.activeRequests = false;
                    this.finishedRequests = 0;
                    this.requestCount = 0;
                    this.setLoadedState(true);
                }
                CoreService.prototype.setLoadedState = function (state) {
                    var wrapper = angular.element(document.getElementById("wrapper"));
                    var flippedState = !state;
                    wrapper.attr("aria-busy", flippedState.toString());
                    this.$rootScope.loaded = state;
                };
                CoreService.prototype.setPageTitle = function (title, id) {
                    // TODO - this could probably be done when the function is called
                    var formattedTitle = this.gettextCatalog.getString(title);
                    formattedTitle = id ? formattedTitle + " - " + id : formattedTitle;
                    this.$rootScope.pageTitle = formattedTitle;
                };
                CoreService.prototype.xhrSent = function () {
                    if (!this.activeRequests) {
                        this.activeRequests = true;
                        this.ngProgressLite.start();
                    }
                    this.requestCount++;
                };
                CoreService.prototype.xhrDone = function () {
                    this.finishedRequests++;
                    if (this.finishedRequests === this.requestCount) {
                        this.activeRequests = false;
                        this.finishedRequests = 0;
                        this.requestCount = 0;
                        this.ngProgressLite.done();
                    }
                };
                CoreService.prototype.setSearchModelState = function (state) {
                    this.$rootScope.modelLoaded = state;
                };
                return CoreService;
            })();
            var LocalStorageService = (function () {
                /* @ngInject */
                function LocalStorageService($window) {
                    this.$window = $window;
                }
                LocalStorageService.prototype.removeItem = function (item) {
                    try {
                        this.$window.localStorage.removeItem(item);
                    }
                    catch (e) {
                        console.log(e);
                    }
                };
                LocalStorageService.prototype.getItem = function (item, defaultResponse) {
                    var result;
                    try {
                        try {
                            result = JSON.parse(this.$window.localStorage.getItem(item)) || defaultResponse || {};
                        }
                        catch (e) {
                            result = this.$window.localStorage.getItem(item) || defaultResponse || {};
                        }
                    }
                    catch (e) {
                        console.log(e);
                        result = defaultResponse || {};
                    }
                    return result;
                };
                LocalStorageService.prototype.setItem = function (key, item) {
                    try {
                        // always stringify so can always parse
                        this.$window.localStorage.setItem(key, JSON.stringify(item));
                    }
                    catch (e) {
                        console.log(e);
                    }
                };
                return LocalStorageService;
            })();
            var dataNames = [
                'Sequencing Data',
                'Transcriptome Profiling',
                'Simple Nucleotide Variation',
                'Copy Number Variation',
                'Structural Rearrangement',
                'DNA Methylation',
                'Clinical',
                'Biospecimen'
            ];
            var expNames = [
                "Genotyping Array",
                "Gene Expression Array",
                "Exon Array",
                "miRNA Expression Array",
                "Methylation Array",
                "CGH Array",
                "MSI-Mono-Dinucleotide Assay",
                "WGS",
                "WGA",
                "WXS",
                "RNA-Seq",
                "miRNA-Seq",
                "ncRNA-Seq",
                "WCS",
                "CLONE",
                "POOLCLONE",
                "AMPLICON",
                "CLONEEND",
                "FINISHING",
                "ChIP-Seq",
                "MNase-Seq",
                "DNase-Hypersensitivity",
                "Bisulfite-Seq",
                "EST",
                "FL-cDNA",
                "CTS",
                "MRE-Seq",
                "MeDIP-Seq",
                "MBD-Seq",
                "Tn-Seq",
                "FAIRE-seq",
                "SELEX",
                "RIP-Seq",
                "ChIA-PET",
                "DNA-Seq",
                "Total RNA-Seq",
                "VALIDATION",
                "OTHER"
            ];
            angular.module("core.services", [
                "gettext"
            ]).value("DataCategoryNames", dataNames).value("ExperimentalStrategyNames", expNames).service("LocalStorageService", LocalStorageService).service("CoreService", CoreService);
        })(services = core.services || (core.services = {}));
    })(core = ngApp.core || (ngApp.core = {}));
})(ngApp || (ngApp = {}));
