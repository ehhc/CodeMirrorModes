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
            state.isCell = false;
            return null;
        }

        return {
            startState: function () {
                return {
                    isCell: false,
                };
            },
            copyState: function (s) {
                return {
                    isCell: s.isCell
                };
            },
            token: function (stream, state) {
                if (stream.next() === '|') {
                    stream.skipTo("|");
                    stream.next();
                    state.isCell = true;
                    return "line-table-line table-cell cell-even";
                } else {
                    if (state.isCell) {
                        stream.skipTo("|") || stream.skipToEnd();
                        state.isCell = false;
                        return "line-table-line  table-cell cell-odd";
                    }
                    stream.skipTo("|") || stream.skipToEnd();
                    return null;
                }
            },
            blankLine: blankLine
        };

    });

    CodeMirror.defineMIME("text/x-table", "table");

});
