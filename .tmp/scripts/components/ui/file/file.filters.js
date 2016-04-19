var ngApp;
(function (ngApp) {
    var components;
    (function (components) {
        var ui;
        (function (ui) {
            var file;
            (function (file) {
                var FileSize = (function () {
                    function FileSize() {
                        return function (val) {
                            var formattedVal = "0 B";
                            if (val >= FileSize.BYTES_TB_LIMIT) {
                                formattedVal = (val / FileSize.BYTES_PB).toFixed(2) + " PB";
                            }
                            else if (val >= FileSize.BYTES_GB_LIMIT) {
                                formattedVal = (val / FileSize.BYTES_TB).toFixed(2) + " TB";
                            }
                            else if (val >= FileSize.BYTES_MB_LIMIT) {
                                formattedVal = (val / FileSize.BYTES_GB).toFixed(2) + " GB";
                            }
                            else if (val >= FileSize.BYTES_KB_LIMIT) {
                                formattedVal = (val / FileSize.BYTES_MB).toFixed(0) + " MB";
                            }
                            else if (val >= FileSize.BYTES_KB) {
                                formattedVal = (val / FileSize.BYTES_KB).toFixed(0) + " KB";
                            }
                            else if (val) {
                                formattedVal = val + " B";
                            }
                            return formattedVal;
                        };
                    }
                    FileSize.BYTES_PB = 1000000000000000;
                    FileSize.BYTES_TB_LIMIT = 999999500000000;
                    FileSize.BYTES_TB = 1000000000000;
                    FileSize.BYTES_GB_LIMIT = 999999500000;
                    FileSize.BYTES_GB = 1000000000;
                    FileSize.BYTES_MB_LIMIT = 999500000;
                    FileSize.BYTES_MB = 1000000;
                    FileSize.BYTES_KB_LIMIT = 999500;
                    FileSize.BYTES_KB = 1000;
                    return FileSize;
                })();
                angular.module("file.filters", []).filter("size", FileSize);
            })(file = ui.file || (ui.file = {}));
        })(ui = components.ui || (components.ui = {}));
    })(components = ngApp.components || (ngApp.components = {}));
})(ngApp || (ngApp = {}));
