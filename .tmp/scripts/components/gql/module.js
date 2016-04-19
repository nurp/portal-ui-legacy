var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var gql;
        (function (gql) {
            var KeyCode;
            (function (KeyCode) {
                KeyCode[KeyCode["Space"] = 32] = "Space";
                KeyCode[KeyCode["Enter"] = 13] = "Enter";
                KeyCode[KeyCode["Esc"] = 27] = "Esc";
                KeyCode[KeyCode["Left"] = 37] = "Left";
                KeyCode[KeyCode["Right"] = 39] = "Right";
                KeyCode[KeyCode["Up"] = 38] = "Up";
                KeyCode[KeyCode["Down"] = 40] = "Down";
            })(KeyCode || (KeyCode = {}));
            var Mode;
            (function (Mode) {
                Mode[Mode["Field"] = 0] = "Field";
                Mode[Mode["Quoted"] = 1] = "Quoted";
                Mode[Mode["Unquoted"] = 2] = "Unquoted";
                Mode[Mode["List"] = 3] = "List";
                Mode[Mode["Op"] = 4] = "Op";
            })(Mode || (Mode = {}));
            var Cycle;
            (function (Cycle) {
                Cycle[Cycle["Up"] = -1] = "Up";
                Cycle[Cycle["Down"] = 1] = "Down";
            })(Cycle || (Cycle = {}));
            var GqlService = (function () {
                /* @ngInject */
                function GqlService($timeout, $document, FilesService, ParticipantsService, GqlTokens) {
                    this.$timeout = $timeout;
                    this.$document = $document;
                    this.FilesService = FilesService;
                    this.ParticipantsService = ParticipantsService;
                    this.GqlTokens = GqlTokens;
                }
                GqlService.prototype.getPos = function (element) {
                    if ('selectionStart' in element) {
                        return element.selectionStart;
                    }
                    else if (this.$document['selection']) {
                        element.focus();
                        var sel = this.$document['selection'].createRange();
                        var selLen = this.$document['selection'].createRange().text.length;
                        sel.moveStart('character', -element.value.length);
                        return sel.text.length - selLen;
                    }
                };
                GqlService.prototype.setPos = function (element, caretPos) {
                    if (element.createTextRange) {
                        var range = element.createTextRange();
                        range.move('character', caretPos);
                        range.select();
                    }
                    else {
                        element.focus();
                        if (element.selectionStart !== undefined) {
                            this.$timeout(function () { return element.setSelectionRange(caretPos, caretPos); });
                        }
                    }
                };
                GqlService.prototype.countNeedle = function (stack, needle) {
                    // http://stackoverflow.com/questions/881085/count-the-number-of-occurences-of-a-character-in-a-string-in-javascript
                    return stack.split(needle).length - 1;
                };
                GqlService.prototype.isCountOdd = function (stack, needle) {
                    return this.countNeedle(stack, needle) % 2 !== 0;
                };
                GqlService.prototype.isUnbalanced = function (stack, start, end) {
                    var numStart = this.countNeedle(stack, start);
                    var numEnd = this.countNeedle(stack, end);
                    return numStart > numEnd;
                };
                GqlService.prototype.contains = function (phrase, sub) {
                    if (sub.length === 0)
                        return true;
                    var phraseStr = (phrase + this.GqlTokens.NOTHING).toLowerCase();
                    return phraseStr.indexOf((sub + this.GqlTokens.NOTHING).toLowerCase()) > -1;
                };
                GqlService.prototype.clean = function (e) {
                    return (e !== undefined) && [
                        '[A-Za-z0-9\\-_.]',
                        '[0-9]',
                        'whitespace',
                        'newline',
                        'end of input',
                        '_missing',
                        this.GqlTokens.QUOTE,
                        this.GqlTokens.LPARENS
                    ].indexOf(e) == -1;
                };
                GqlService.prototype.getStartOfList = function (s) {
                    var bracket = s.lastIndexOf(this.GqlTokens.LBRACKET);
                    return bracket === -1 ? s.length : bracket + 1;
                };
                GqlService.prototype.getEndOfList = function (s) {
                    return s.indexOf(this.GqlTokens.RBRACKET) !== -1 ? s.indexOf(this.GqlTokens.RBRACKET) : s.length;
                };
                GqlService.prototype.getValuesOfList = function (s) {
                    var _this = this;
                    return _.map(s.split(this.GqlTokens.COMMA), function (x) { return x.trim().split(_this.GqlTokens.QUOTE).join(_this.GqlTokens.NOTHING); });
                };
                GqlService.prototype.cleanNeedle = function (s) {
                    return s.trim().replace(this.GqlTokens.QUOTE, this.GqlTokens.NOTHING).replace(this.GqlTokens.LBRACKET, this.GqlTokens.NOTHING).replace(this.GqlTokens.LPARENS, this.GqlTokens.NOTHING);
                };
                GqlService.prototype.getNeedleFromList = function (s) {
                    return this.cleanNeedle(_.last(this.getValuesOfList(s)));
                };
                GqlService.prototype.getParts = function (s) {
                    var parts = s.split(this.GqlTokens.SPACE);
                    var needle = this.cleanNeedle(parts[parts.length - 1] || '');
                    var op = parts[parts.length - 2] || '';
                    var field = parts[parts.length - 3] || '';
                    if (field) {
                        field = field.replace(this.GqlTokens.LPARENS, this.GqlTokens.NOTHING);
                    }
                    return {
                        field: field,
                        op: op.toUpperCase(),
                        needle: needle
                    };
                };
                GqlService.prototype.getComplexParts = function (s, n) {
                    var parts = this.getParts(s.substring(0, n));
                    parts.needle = this.getNeedleFromList(s.substring(n));
                    return parts;
                };
                GqlService.prototype.splitField = function (s) {
                    var xs = s.split(this.GqlTokens.PERIOD);
                    return {
                        docType: xs.shift(),
                        facet: xs.join(this.GqlTokens.PERIOD)
                    };
                };
                GqlService.prototype.isQuoted = function (s) {
                    return s.toString().indexOf(this.GqlTokens.SPACE) !== -1;
                };
                GqlService.prototype.ajaxRequest = function (field) {
                    var parts = this.splitField(field);
                    var params = {
                        facets: [parts.facet],
                        size: 0,
                        filters: {}
                    };
                    if (parts.docType === "files") {
                        return this.FilesService.getFiles(params).then(function (fs) {
                            var f = fs.aggregations[parts.facet];
                            return _.map(f.buckets, function (b) {
                                return { field: b.key, full: b.key };
                            });
                        });
                    }
                    else {
                        return this.ParticipantsService.getParticipants(params).then(function (fs) {
                            var f = fs.aggregations[parts.facet];
                            return _.map(f.buckets, function (b) {
                                return { field: b.key, full: b.key };
                            });
                        });
                    }
                };
                GqlService.prototype.parseGrammarError = function (needle, error) {
                    var _this = this;
                    // Handles GQL Parser errors
                    return _.map(_.filter(error.expected, function (e) {
                        return _this.contains(e.description, needle) && _this.clean(e.description);
                    }), function (m) {
                        var val = m.description ? m.description : m.value;
                        return {
                            field: val,
                            full: val
                        };
                    });
                };
                GqlService.prototype.getLastComma = function (s) {
                    return s.lastIndexOf(this.GqlTokens.COMMA) + 1;
                };
                GqlService.prototype.getFirstComma = function (s) {
                    return s.indexOf(this.GqlTokens.COMMA);
                };
                GqlService.prototype.getListContent = function (left, listStart, right) {
                    var lComma = this.getLastComma(left);
                    lComma = lComma === 0 ? listStart : lComma;
                    var rComma = this.getFirstComma(right);
                    var listEnd = this.getEndOfList(right);
                    return left.substring(listStart, lComma) + right.substring(rComma + 1, listEnd);
                };
                GqlService.prototype.parseList = function (left, right) {
                    /*
                    * ... FIELD OP [vvv, vvv, nnn|xxx, vvv, vvv] ...
                    * FIELD = field searching on
                    * OP = operator using on search
                    * | = current cursor position
                    * nnn = active part of value - used in filtering
                    * xxx = ignored - NOT used in filtering and removed after adding new value
                    * vvv = other values in the list
                    * ... = uninteresting parts of the query
                    *
                    * Requirements for List:
                    *  - Get the beginning of the list
                    *  - Get the end of the list
                    *  - Get the values of the list
                    *  - Get active search term
                    *  - Autocomplete values for FIELD
                    *  - Remove current values from autocomplete
                    */
                    // Get the beginning of the list
                    var listStart = this.getStartOfList(left);
                    // Get the values of the list
                    var listContent = this.getListContent(left, listStart, right);
                    // Get array of list values
                    var listValues = this.getValuesOfList(listContent);
                    // Get all the fields needed for Ajax
                    return {
                        parts: this.getComplexParts(left, listStart),
                        listValues: listValues
                    };
                };
                GqlService.prototype.ajaxList = function (parts, listValues) {
                    var _this = this;
                    // Autocomplete suggestions
                    return this.ajaxRequest(parts.field).then(function (d) {
                        return _.filter(d, function (m) {
                            // Filter out values that are already in the list
                            return m && m.full && listValues.indexOf(m.field.toString()) === -1 && _this.contains(m.full.toString(), parts.needle) && _this.clean(m.full.toString());
                        });
                    });
                };
                GqlService.prototype.parseQuoted = function (left) {
                    /*
                   * ... FIELD OP "nnn nnn|xxx ...
                   * FIELD = field searching on
                   * OP = operator using on search
                   * | = current cursor position
                   * nnn = active part of value - used in filtering
                   * xxx = ignored - NOT used in filtering and removed after adding new value
                   * ... = uninteresting parts of the query
                   *
                   * Requirements for List:
                   *  - Get the beginning of the quoted term
                   *  - Get active search term
                   *  - Autocomplete values for FIELD
                   */
                    // Get the last quote
                    var lastQuote = left.lastIndexOf(this.GqlTokens.QUOTE);
                    // Get all the fields needed for Ajax
                    return this.getComplexParts(left, lastQuote);
                };
                GqlService.prototype.ajaxQuoted = function (parts) {
                    var _this = this;
                    // Autocomplete suggestions
                    return this.ajaxRequest(parts.field).then(function (d) {
                        return _.filter(d, function (m) {
                            return m && m.full && _this.contains(m.full.toString(), parts.needle) && _this.clean(m.full.toString());
                        });
                    });
                };
                GqlService.prototype.lhsRewrite = function (left, needleLength) {
                    return left.substring(0, left.length - needleLength);
                };
                GqlService.prototype.rhsRewrite = function (right) {
                    var rFirstSpace = right.indexOf(this.GqlTokens.SPACE);
                    var tokenIndex = rFirstSpace === -1 ? right.length : rFirstSpace;
                    return right.substring(tokenIndex);
                };
                GqlService.prototype.rhsRewriteQuoted = function (right) {
                    var rFirstSpace = right.search(/[a-z]"/i);
                    return right.substring(rFirstSpace + 2);
                };
                GqlService.prototype.rhsRewriteList = function (right) {
                    var bracket = right.indexOf(this.GqlTokens.RBRACKET);
                    var comma = right.indexOf(this.GqlTokens.COMMA);
                    // is there a comma before the ] - if yes use that
                    var pos = comma >= 0 && comma < bracket ? comma : bracket;
                    // other wise is there a ] at all - then use that
                    // else end of line
                    pos = pos === -1 ? right.length : pos;
                    return right.substring(pos);
                };
                GqlService.prototype.humanError = function (s, e) {
                    var right = s.substring(e.location.start.offset);
                    var space = right.indexOf(this.GqlTokens.SPACE);
                    space = space === -1 ? right.length : space;
                    var token = right.substring(0, space);
                    if (e.found) {
                        e.message = e.message.replace(/but.*$/, 'but "' + token + '" found.');
                    }
                    return e.location.start.line + " : " + e.location.start.column + " - " + e.message;
                };
                return GqlService;
            })();
            /* @ngInject */
            function gqlInput($window, $document, $compile, $timeout, Restangular, GqlService, GqlTokens) {
                return {
                    restrict: 'E',
                    replace: true,
                    scope: {
                        gql: '=',
                        query: '=',
                        error: '='
                    },
                    templateUrl: "components/gql/templates/gql.html",
                    link: function ($scope, element) {
                        var INACTIVE = -1;
                        var T = GqlTokens;
                        var ds = Restangular.all("gql");
                        var mapping;
                        ds.get('_mapping', {}).then(function (m) { return mapping = m; });
                        $scope.active = INACTIVE;
                        $scope.offset = 0;
                        $scope.limit = 10;
                        $scope.onChange = function () {
                            $scope.focused = true;
                            $scope.active = INACTIVE;
                            gqlParse();
                            var index = GqlService.getPos(element[0]);
                            $scope.left = $scope.query.substring(0, index);
                            $scope.right = $scope.query.substring(index);
                            var left = $scope.left;
                            var right = $scope.right;
                            $scope.parts = GqlService.getParts(left);
                            if ($scope.error && _.some($scope.error.expected, function (e) {
                                return [T.IN, T.AND].indexOf(e.description) !== -1;
                            })) {
                                $scope.mode = 4 /* Op */;
                                $scope.ddItems = _.filter(GqlService.parseGrammarError($scope.parts.needle, $scope.error), function (item) {
                                    var op = mapping[$scope.parts.op.toLowerCase()] || {};
                                    if ((op.type || '') === 'long' || (op.full || '').toString().indexOf('datetime') != -1) {
                                        return [T.EQ, T.NE, T.GT, T.GTE, T.LT, T.LTE, T.IS, T.NOT].indexOf(item.full.toString()) != -1;
                                    }
                                    else if (op.type === 'string') {
                                        return [T.EQ, T.NE, T.IN, T.EXCLUDE, T.IS, T.NOT].indexOf(item.full.toString()) != -1;
                                    }
                                    else {
                                        return false;
                                    }
                                });
                            }
                            else if ($scope.error && _.some($scope.error.expected, function (e) {
                                return [T.MISSING].indexOf(e.description) !== -1;
                            })) {
                                $scope.mode = 2 /* Unquoted */;
                                $scope.ddItems = GqlService.parseGrammarError($scope.parts.needle, $scope.error);
                            }
                            else {
                                if ([T.IN, T.EXCLUDE].indexOf($scope.parts.op) !== -1 || GqlService.isUnbalanced(left, T.LBRACKET, T.RBRACKET)) {
                                    // in_list_of_values
                                    $scope.mode = 3 /* List */;
                                    var ret = GqlService.parseList(left, right);
                                    $scope.parts = ret.parts;
                                    GqlService.ajaxList($scope.parts, ret.listValues).then(function (d) {
                                        $scope.ddItems = d;
                                    });
                                }
                                else if (GqlService.isCountOdd(left, T.QUOTE)) {
                                    //in_quoted_string
                                    $scope.mode = 1 /* Quoted */;
                                    $scope.parts = GqlService.parseQuoted(left);
                                    GqlService.ajaxQuoted($scope.parts).then(function (d) {
                                        $scope.ddItems = d;
                                    });
                                }
                                else {
                                    if (($scope.parts.needle.toUpperCase() && !$scope.parts.op) || [T.AND, T.OR].indexOf($scope.parts.op) !== -1) {
                                        // is_field_string
                                        $scope.mode = 0 /* Field */;
                                        $scope.ddItems = _.filter(mapping, function (m) {
                                            return (m && m.full && GqlService.clean(m.full.toString()) && (GqlService.contains(m.full.toString(), $scope.parts.needle.replace(T.LPARENS, T.NOTHING)) || GqlService.contains(m.type, $scope.parts.needle.replace(T.LPARENS, T.NOTHING))));
                                        });
                                    }
                                    else if ([T.EQ, T.NE].indexOf($scope.parts.op) !== -1) {
                                        // is_value_string is_unquoted_string
                                        $scope.mode = 2 /* Unquoted */;
                                        GqlService.ajaxRequest($scope.parts.field).then(function (d) {
                                            $scope.ddItems = _.filter(d, function (m) {
                                                return m && m.full && GqlService.contains(m.full.toString(), $scope.parts.needle) && GqlService.clean(m.full.toString());
                                            });
                                        });
                                    }
                                }
                            }
                        };
                        function gqlParse() {
                            try {
                                $scope.gql = $window.gql.parse($scope.query);
                                $scope.error = null;
                            }
                            catch (Error) {
                                Error.human = GqlService.humanError($scope.query, Error);
                                $scope.error = Error;
                                $scope.gql = null;
                            }
                        }
                        $scope.setActive = function (active) {
                            if ($scope.active >= 0)
                                $scope.ddItems[$scope.active].active = false;
                            $scope.ddItems[active].active = true;
                            $scope.active = active;
                        };
                        $scope.cycle = function (val) {
                            $scope.showResults();
                            var active = $scope.active + val;
                            if (active >= $scope.ddItems.length) {
                                active = 0;
                                $scope.offset = 0;
                            }
                            else if (active < 0) {
                                active = $scope.ddItems.length - 1;
                                if ($scope.ddItems.length > $scope.limit) {
                                    $scope.offset = $scope.ddItems.length - $scope.limit;
                                }
                            }
                            else if (active >= $scope.offset + $scope.limit) {
                                $scope.offset++;
                            }
                            else if (active < $scope.offset) {
                                $scope.offset--;
                            }
                            $scope.setActive(active);
                        };
                        $scope.showResults = function () {
                            var results = $scope.ddItems ? !!$scope.ddItems.length : false;
                            var bool = !!($scope.focused && $scope.query.length > 0 && results);
                            if (!bool)
                                $scope.offset = 0;
                            return bool;
                        };
                        $scope.keypress = function (e) {
                            var key = e.which || e.keyCode;
                            switch (key) {
                                case 13 /* Enter */:
                                    e.preventDefault();
                                    if ($scope.showResults()) {
                                        $scope.enter();
                                    }
                                    break;
                                case 38 /* Up */:
                                    e.preventDefault();
                                    if ($scope.showResults()) {
                                        $scope.cycle(-1 /* Up */);
                                    }
                                    break;
                                case 40 /* Down */:
                                    e.preventDefault();
                                    if ($scope.showResults()) {
                                        $scope.cycle(1 /* Down */);
                                    }
                                    else {
                                        $scope.onChange();
                                    }
                                    break;
                                case 32 /* Space */:
                                    if ($scope.mode !== 1 /* Quoted */) {
                                        $scope.ddItems = [];
                                        gqlParse();
                                        if ($scope.query && !$scope.error) {
                                            $scope.ddItems = [{
                                                field: 'AND',
                                                full: 'AND'
                                            }, {
                                                field: 'OR',
                                                full: 'OR'
                                            }];
                                        }
                                    }
                                    break;
                                case 27 /* Esc */:
                                    clearActive();
                                    break;
                                case 37 /* Left */:
                                case 39 /* Right */:
                                default:
                                    break;
                            }
                        };
                        function clearActive() {
                            if ($scope.ddItems && $scope.ddItems[$scope.active]) {
                                $scope.ddItems[$scope.active].active = false;
                            }
                            $scope.ddItems = [];
                            $scope.active = INACTIVE;
                            $scope.focused = false;
                        }
                        $scope.enter = function (item) {
                            item = item || ($scope.active === INACTIVE ? $scope.ddItems[0] : $scope.ddItems[$scope.active]);
                            var needleLength = $scope.parts.needle.length;
                            // Quote the value if it has a space so the parse can handle it  
                            if (GqlService.isQuoted(item.full))
                                item.full = T.QUOTE + item.full + T.QUOTE;
                            // After selecting a value close the autocomplete
                            clearActive();
                            var left = $scope.left;
                            var right = $scope.right;
                            if ([0 /* Field */, 4 /* Op */, 2 /* Unquoted */].indexOf($scope.mode) !== -1) {
                                var newLeft = GqlService.lhsRewrite(left, needleLength);
                                var newRight = GqlService.rhsRewrite(right);
                                var insert = [T.IN, T.EXCLUDE].indexOf(item.full.toString().toUpperCase()) != -1 ? item.full.toString() + T.SPACE + T.LBRACKET : item.full;
                                $scope.query = newLeft + insert + newRight;
                                GqlService.setPos(element[0], (newLeft + insert).length);
                            }
                            else if ($scope.mode === 1 /* Quoted */) {
                                var newLeft = GqlService.lhsRewrite(left, needleLength + 1);
                                var newRight = GqlService.rhsRewriteQuoted(right);
                                $scope.query = newLeft + item.full + newRight;
                                GqlService.setPos(element[0], (newLeft + item.full).length);
                            }
                            else if ($scope.mode === 3 /* List */) {
                                if (GqlService.isCountOdd(left, T.QUOTE))
                                    needleLength++;
                                // [OICR-925] Auto insert [ if not there already
                                // if (left.substr(-4).toUpperCase() === T.SPACE + T.IN + T.SPACE) left += T.LBRACKET;
                                var newLeft = GqlService.lhsRewrite(left, needleLength);
                                var newRight = GqlService.rhsRewriteList(right);
                                $scope.query = newLeft + item.full + newRight;
                                GqlService.setPos(element[0], (newLeft + item.full).length);
                            }
                            gqlParse();
                        };
                        function blur() {
                            clearActive();
                        }
                        $scope.focus = function () {
                            element[0].focus();
                            $scope.focused = true;
                        };
                        gqlParse();
                        // $scope.$on('application:click', blur);
                        element.after($compile('<gql-dropdown></gql-dropdown>')($scope));
                    }
                };
            }
            /* @ngInject */
            function gqlDropdown($interval) {
                return {
                    restrict: 'E',
                    replace: true,
                    templateUrl: "components/gql/templates/gql_dropdown.html",
                    link: function ($scope) {
                        $scope.click = function (item) {
                            $scope.enter(item);
                        };
                        $scope.mouseIn = function (idx) {
                            $scope.setActive(idx + $scope.offset);
                        };
                        $scope.handleOnClickUpArrow = function () {
                            $scope.focus();
                            if ($scope.offset > 0)
                                $scope.cycle(-1 /* Up */);
                        };
                        $scope.handleOnClickDownArrow = function () {
                            $scope.focus();
                            if ($scope.ddItems.length > $scope.offset + $scope.limit)
                                $scope.cycle(1 /* Down */);
                        };
                    }
                };
            }
            var Tokens = {
                EQ: "=",
                NE: "!=",
                GT: ">",
                GTE: ">=",
                LT: "<",
                LTE: "<=",
                IN: "IN",
                EXCLUDE: "EXCLUDE",
                OR: "OR",
                AND: "AND",
                IS: "IS",
                NOT: "NOT",
                MISSING: "MISSING",
                LBRACKET: '[',
                RBRACKET: ']',
                LPARENS: '(',
                RPARENS: ')',
                QUOTE: '"',
                SPACE: ' ',
                COMMA: ',',
                NOTHING: '',
                PERIOD: '.'
            };
            angular.module("components.gql", [
                "gql.filters",
            ]).service("GqlService", GqlService).directive("gql", gqlInput).directive("gqlDropdown", gqlDropdown).constant('GqlTokens', Tokens);
        })(gql = components.gql || (components.gql = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));
