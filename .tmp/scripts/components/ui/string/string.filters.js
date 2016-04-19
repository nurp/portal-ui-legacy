var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var ui;
        (function (ui) {
            var string;
            (function (string) {
                var Ellipsicate = (function () {
                    function Ellipsicate() {
                        return function (fullstring, length) {
                            if (length === void 0) { length = 50; }
                            if (fullstring) {
                                return (fullstring.length <= length) ? fullstring : fullstring.substring(0, length) + "…";
                            }
                            else {
                                return '';
                            }
                        };
                    }
                    return Ellipsicate;
                })();
                var Humanify = (function () {
                    function Humanify() {
                        return function (original, capitalize, facetTerm) {
                            if (capitalize === void 0) { capitalize = true; }
                            if (facetTerm === void 0) { facetTerm = false; }
                            // use `--` for null, undefined and empty string
                            if (original === null || original === undefined || (angular.isString(original) && original.length === 0)) {
                                return '--';
                            }
                            else if (!angular.isString(original))
                                return original;
                            var humanified = "";
                            if (facetTerm) {
                                // Splits on capital letters followed by lowercase letters to find
                                // words squished together in a string.
                                original = original.split(/(?=[A-Z][a-z])/).join(" ");
                                humanified = original.replace(/\./g, " ").replace(/_/g, " ").trim();
                            }
                            else {
                                var split = original.split(".");
                                humanified = split[split.length - 1].replace(/_/g, " ").trim();
                                // Special case 'name' to include any parent nested for sake of
                                // specificity in the UI
                                if (humanified === "name" && split.length > 1) {
                                    humanified = split[split.length - 2] + " " + humanified;
                                }
                            }
                            return capitalize ? Capitalize()(humanified) : humanified;
                        };
                    }
                    return Humanify;
                })();
                var FacetTitlefy = (function () {
                    function FacetTitlefy() {
                        return function (original) {
                            // chop string until last biospec entity
                            var biospecEntities = ['samples', 'portions', 'slides', 'analytes', 'aliquots'];
                            var startAt = biospecEntities.reduce(function (lastIndex, b) {
                                var indexOf = original.indexOf(b);
                                return indexOf > lastIndex ? indexOf : lastIndex;
                            }, 0);
                            var chopped = original.substring(startAt);
                            // Splits on capital letters followed by lowercase letters to find
                            // words squished together in a string.
                            return Capitalize()(chopped.split(/(?=[A-Z][a-z])/).join(" ").replace(/\./g, ' ').replace(/_/g, ' ').trim());
                        };
                    }
                    return FacetTitlefy;
                })();
                // differs from angular's uppercase by not uppering miRNA
                var Capitalize = (function () {
                    function Capitalize() {
                        return function (original) {
                            return original.split(' ').map(function (word) {
                                return word.indexOf("miRNA") === -1 ? word.charAt(0).toUpperCase() + word.slice(1) : word;
                            }).join(' ');
                        };
                    }
                    return Capitalize;
                })();
                var Titlefy = (function () {
                    function Titlefy() {
                        return function (s) {
                            s = (s === undefined || s === null) ? '' : s;
                            return s.toString().toLowerCase().replace(/\b([a-z])/g, function (ch) {
                                return ch.toUpperCase();
                            });
                        };
                    }
                    return Titlefy;
                })();
                var SpaceReplace = (function () {
                    function SpaceReplace() {
                        return function (s, replaceWith) {
                            return s.toString().replace(/\s+/g, replaceWith || '');
                        };
                    }
                    return SpaceReplace;
                })();
                var DotReplace = (function () {
                    function DotReplace() {
                        return function (s, replaceWith) {
                            return s.toString().replace(/\.+/g, replaceWith || '');
                        };
                    }
                    return DotReplace;
                })();
                var Replace = (function () {
                    function Replace() {
                        return function (s, substr, newSubstr) {
                            return s.toString().replace(substr, newSubstr);
                        };
                    }
                    return Replace;
                })();
                var AgeDisplay = (function () {
                    function AgeDisplay(gettextCatalog) {
                        return function (ageInDays) {
                            if (ageInDays < 365) {
                                var daysText = gettextCatalog.getPlural(ageInDays, "day", "days");
                                return ageInDays + " " + daysText;
                            }
                            else {
                                var ageInYears = Math.floor(ageInDays / 365);
                                var remainderDays = Math.ceil(ageInDays % 365);
                                var yearsText = gettextCatalog.getPlural(ageInYears, "year", "years");
                                var daysText = gettextCatalog.getPlural(remainderDays, "day", "days");
                                return ageInYears + " " + yearsText + (remainderDays ? " " + remainderDays + " " + daysText : "");
                            }
                        };
                    }
                    return AgeDisplay;
                })();
                angular.module("string.filters", []).filter("ellipsicate", Ellipsicate).filter("titlefy", Titlefy).filter("spaceReplace", SpaceReplace).filter("dotReplace", DotReplace).filter("replace", Replace).filter("humanify", Humanify).filter("facetTitlefy", FacetTitlefy).filter("capitalize", Capitalize).filter("ageDisplay", AgeDisplay);
            })(string = ui.string || (ui.string = {}));
        })(ui = components.ui || (components.ui = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));
