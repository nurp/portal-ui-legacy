module ngApp.components.ui.string {

  class Ellipsicate {
    constructor() {
      return function (fullstring: string, length: number = 50) {
        if (fullstring) {
          return (fullstring.length <= length) ? fullstring : fullstring.substring(0, length) + "…";
        } else {
          return '';
        }
      };
    }
  }

  class Humanify {
    constructor() {
      return function (original: any, capitalize: boolean = true, facetTerm: boolean = false) {
        // use `--` for null, undefined and empty string
        if (original === null || original === undefined || (angular.isString(original) && original.length === 0)) {
          return '--';
        // return all other non-strings 
        } else if (!angular.isString(original)) return original;

        var humanified = "";

        if (facetTerm) {
          // Splits on capital letters followed by lowercase letters to find
          // words squished together in a string.
          original = original.split(/(?=[A-Z][a-z])/).join(" ");
          humanified = original.replace(/\./g, " ").replace(/_/g, " ").trim();
        } else {
          var split = original.split(".");
          humanified = split[split.length - 1].replace(/_/g, " ").trim();

          // Special case 'name' to include any parent nested for sake of
          // specificity in the UI
          if (humanified === "name" && split.length > 1) {
            humanified = split[split.length - 2] + " " + humanified;
          }
        }

        return capitalize
          ? Capitalize()(humanified): humanified;
      };
    }
  }

  class FacetTitlefy {
    constructor() {
      return function(original: string) {
        // chop string until last biospec entity
        var biospecEntities = ['samples', 'portions', 'slides', 'analytes', 'aliquots'];
        var startAt = biospecEntities.reduce((lastIndex, b) => {
          var indexOf = original.indexOf(b);
          return indexOf > lastIndex ? indexOf : lastIndex;
        }, 0);
        var chopped = original.substring(startAt);
        // Splits on capital letters followed by lowercase letters to find
        // words squished together in a string.
        return Capitalize()(chopped.split(/(?=[A-Z][a-z])/)
                                   .join(" ")
                                   .replace(/\./g, ' ')
                                   .replace(/_/g, ' ')
                                   .trim());
      }
    }
  }

  // differs from angular's uppercase by not uppering miRNA
  class Capitalize {
    constructor() {
      return function(original: string) {
        return original.split(' ').map(function (word) {
              return word.indexOf("miRNA") === -1
                ? word.charAt(0).toUpperCase() + word.slice(1)
                : word
            }).join(' ');
      };
    }
  }

  class Titlefy {
    constructor() {
      return function(s) {
        s = ( s === undefined || s === null ) ? '' : s;
        return s.toString().toLowerCase().replace( /\b([a-z])/g, function(ch) {
          return ch.toUpperCase();
        });
      }
    }
  }

  class SpaceReplace {
    constructor() {
      return function(s: string, replaceWith: string) {
        return s.toString().replace(/\s+/g, replaceWith || '');
      };
    }
  }

  class DotReplace {
    constructor() {
      return function(s: string, replaceWith: string) {
        return s.toString().replace(/\.+/g, replaceWith || '');
      };
    }
  }

  class Replace {
    constructor() {
      return function(s: string, substr: string, newSubstr: string) {
        return s.toString().replace(substr, newSubstr);
      };
    }
  }


  class AgeDisplay {
    constructor(gettextCatalog: any) {
      const oneYear = 365.25;
      const leapThenPair = (years: number, days: number): number[] => (days === 365) ? [years + 1, 0] : [years, days];
      const timeString = (number: number, singular: string, plural: string): string =>
        ('' + number + ' ' + gettextCatalog.getPlural(number, singular, plural || singular + 's'));
      // if ES6 is ever used, use `...` instead.
      const _timeString = _.spread(timeString);

      return (ageInDays: number, yearsOnly: boolean = false, defaultValue: string = '--'): string => {
        if (!ageInDays) {
          return defaultValue;
        }
        return _.zip(leapThenPair(Math.floor(ageInDays / oneYear), Math.ceil(ageInDays % oneYear)), ['year', 'day'])
        .filter(p => yearsOnly ? p[1] === 'year' : p[0] > 0)
        .map(p => !yearsOnly ? _timeString(p) : p[0])
        .join(' ')
        .trim();
      }
    }
  }

  angular.module("string.filters", [])
      .filter("ellipsicate", Ellipsicate)
      .filter("titlefy", Titlefy)
      .filter("spaceReplace", SpaceReplace)
      .filter("dotReplace", DotReplace)
      .filter("replace", Replace)
      .filter("humanify", Humanify)
      .filter("facetTitlefy", FacetTitlefy)
      .filter("capitalize", Capitalize)
      .filter("ageDisplay", AgeDisplay);
}
