(function (mod) {
    if (typeof exports === "object" && typeof module === "object") // CommonJS
        mod(require("codemirror/lib/codemirror"));
    else if (typeof define === "function" && define.amd) // AMD
        define(["codemirror/lib/codemirror"], mod);
    else // Plain browser env
        mod(CodeMirror);
})(function (CodeMirror) {
    "use strict";

    CodeMirror.defineMode("table", function (config, modeConfig) {
        function blankLine(state) {
            state.nextLineIsTable = false;
            return null;
        }

        return {
            startState: function () {
                return {
                    currentLineIsTable: false
                };
            },
            copyState: function (s) {
                return {
                    currentLineIsTable: s.currentLineIsTable
                };
            },
            token: function (stream, state) {
                if(! state.currentLineIsTable) {
                    if(stream.match(/(\|[^|]+\|([^|]+\|)?)+/, false)) {
                        state.currentLineIsTable = true;
                    }
                }
                if(state.currentLineIsTable) {
                    if(stream.next() === '|') {
                        return "line-table-line table-cell table-cell-border";
                    }
                    stream.skipTo("|");
                    return "line-table-line table-cell table-cell-content";
                }
                stream.skipToEnd();
                return null;
            },
            blankLine: blankLine
        };

    });

    CodeMirror.defineMIME("text/x-table", "table");

});
