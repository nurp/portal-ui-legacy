var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var tables;
        (function (tables) {
            var services;
            (function (services) {
                var TableService = (function () {
                    function TableService() {
                    }
                    /**
                     * If, in a given array, there is a member and that member has a property called ID and that property is equal to @id, return true if that member also has a truthy enabled property.
                     * @param array
                     * The array to search for the enabled member.
                     * @param id
                     * The ID of the member whose enabled property will be returned.
                     * @returns enabled:boolean
                     * If the member is enabled or not.
                     */
                    TableService.prototype.objectWithMatchingIdInArrayIsEnabled = function (array, id) {
                        var column = _.find(array, function (_column) {
                            return _column.id === id;
                        });
                        return column && column.enabled;
                    };
                    /**
                     * Takes an object that may have another object nested inside it at index @key.
                     * If there is, extend the original object with values from that key and return it.
                     * @param object
                     * An object to be extended if its property at index @key is an object.
                     * @param key
                     * The index of the object to check for a possible object
                     * @returns {Object}
                     * The new object with properties (if any) added.
                     */
                    TableService.prototype.flattenObjectAtKey = function (object, key) {
                        return _.extend(object, object[key]);
                    };
                    /**
                     * Takes an object and converts it into an array of objects.
                     * Arrays are easier to ng-repeat through than objects.
                     *
                     * Each object has an ID and a value property.
                     * i.e, {a:1,b:2} -> [{id:'a',val:1},{id:'b',val:2}]
                     * @param object
                     * The object to turn into an array
                     * @returns {any[]}
                     * The object as an array.
                     */
                    TableService.prototype.objectToArray = function (object) {
                        return _.keys(object).map(function (key) {
                            return {
                                id: key,
                                val: object[key]
                            };
                        });
                    };
                    /**
                     * Takes an array of values that are possibly objects and flattens each one with @flattenObjectAtKey.
                     * @param array
                     * The array containing elements to be flattened.
                     * @param key
                     * The key where the entries that need expanding are.
                     * @returns {any}
                     * The flattened array.
                     */
                    TableService.prototype.flattenArrayAtKey = function (array, key) {
                        var _this = this;
                        return array.map(function (elem) {
                            return _this.flattenObjectAtKey(elem, key);
                        });
                    };
                    /**
                     * Goes through an array of Tableicious column definitions.
                     * If any columns are nested in other columns as children, promote those to the top level of the collection.
                     * @param headings
                     * @returns {any}
                     */
                    TableService.prototype.expandHeadings = function (headings) {
                        if (!headings) {
                            throw new Error("You have not defined any headings.");
                        }
                        return headings.reduce(function (a, b) {
                            function addChildrenOfNode(node) {
                                a.push(node);
                                if (node.parent) {
                                    node.nestingLevel = node.parent.nestingLevel + 1;
                                }
                                else {
                                    node.nestingLevel = 0;
                                }
                                if (node.children) {
                                    node.children.forEach(function (heading) {
                                        heading.parent = node;
                                        addChildrenOfNode(heading);
                                    });
                                }
                            }
                            if (b) {
                                addChildrenOfNode(b);
                            }
                            return a;
                        }, []).map(function (heading) {
                            heading.parent = undefined;
                            return heading;
                        });
                    };
                    /**
                     * Returns the appropriate width for a heading in columns.
                     */
                    TableService.prototype.getHeadingRowSpan = function (heading) {
                        return heading.children ? 1 : 2;
                    };
                    /**
                     * Returns the appropriate height for a heading in rows.
                     */
                    TableService.prototype.getHeadingColSpan = function (heading) {
                        return heading.children ? heading.children.length : 1;
                    };
                    /**
                     * Given an array of objects each having a "val" and an "id" property, returns the
                     * val of an object whose ID matches `valueId`
                     */
                    TableService.prototype.getValueFromRow = function (row, valueId) {
                        var tuple = _.find(row, function (x) {
                            return x.id === valueId;
                        });
                        return tuple && tuple.val;
                    };
                    /**
                     * Finds a nested value in an array of tuples.
                     * @param str
                     * The string representing the path into the data.
                     * @param row
                     * An array representing one entry in a table.
                     * @param delimiter
                     */
                    TableService.prototype.delimitedStringToValue = function (str, row, delimiter) {
                        if (delimiter === void 0) { delimiter = '.'; }
                        var result = undefined;
                        var split = str.split(delimiter);
                        var getValueFromRow = this.getValueFromRow;
                        split.forEach(function (pathSeg) {
                            if (result) {
                                result = result[pathSeg];
                            }
                            else {
                                result = getValueFromRow(row, pathSeg);
                            }
                        });
                        return result;
                    };
                    /**
                     * Returns the ultimate text value for an entry in a table based on the heading defintion and the whole row.
                     */
                    TableService.prototype.getTemplate = function (scope, $filter) {
                        var result;
                        var heading = scope.heading;
                        var id = heading.id;
                        var row = scope.$parent.datum;
                        var field = {
                            val: this.getValueFromRow(row, heading.id),
                            id: heading.id
                        };
                        var template = heading.template;
                        if (heading.template) {
                            try {
                                result = heading.template(field, row, scope, $filter);
                            }
                            catch (e) {
                                result = '--';
                            }
                        }
                        else {
                            result = this.delimitedStringToValue(id, row);
                        }
                        return result;
                    };
                    /**
                 * Returns the ultimate text value for an entry in a table based on the heading defintion and the whole row.
                 */
                    TableService.prototype.getIcon = function (scope, $filter) {
                        var heading = scope.heading;
                        var row = scope.$parent.datum;
                        var field = {
                            val: this.getValueFromRow(row, heading.id),
                            id: heading.id
                        };
                        var result;
                        var id = heading.id;
                        if (heading.icon) {
                            try {
                                result = heading.icon(field, row, scope, $filter);
                            }
                            catch (e) {
                                result = '--';
                            }
                        }
                        else {
                            result = '--';
                        }
                        return result;
                    };
                    /**
                     * Given a heading, determines if that heading should be displayed or not.
                     * Gets passed $scope since usually you will want a reference to UserService or
                     * another service for this function.
                     */
                    TableService.prototype.getHeadingEnabled = function (heading, $scope) {
                        if (_.isFunction(heading.enabled)) {
                            return heading.enabled($scope);
                        }
                        else {
                            return true;
                        }
                    };
                    TableService.prototype.getSref = function (scope, $filter) {
                        var heading = scope.heading;
                        var row = scope.$parent.datum;
                        var field = {
                            val: this.getValueFromRow(row, heading.id),
                            id: heading.id
                        };
                        var result = undefined;
                        try {
                            result = heading.sref ? heading.sref(field, row, scope, $filter) : field.val;
                            if (result.filters) {
                                result = result.state + "?filters=" + angular.fromJson(result.filters);
                            }
                            else {
                                result = result.state;
                            }
                        }
                        catch (e) {
                            result = '--';
                        }
                        return result;
                    };
                    TableService.prototype.getFieldClass = function (elem, row, scope, heading) {
                        if (heading.fieldClass) {
                            if (_.isFunction(heading.fieldClass)) {
                                return heading.fieldClass(elem, row, scope);
                            }
                            else {
                                return heading.fieldClass;
                            }
                        }
                    };
                    TableService.prototype.getHeadingClass = function (heading) {
                        if (heading.headingClass) {
                            if (_.isFunction(heading.headingClass)) {
                                return heading.headingClass();
                            }
                            else {
                                return heading.headingClass;
                            }
                        }
                    };
                    return TableService;
                })();
                angular.module("tables.services", []).service("TableService", TableService);
            })(services = tables.services || (tables.services = {}));
        })(tables = components.tables || (components.tables = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));
