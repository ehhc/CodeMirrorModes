(function (mod) {
    if (typeof exports === "object" && typeof module === "object") // CommonJS
        mod(require("codemirror/lib/codemirror"));
    else if (typeof define === "function" && define.amd) // AMD
        define(["codemirror/lib/codemirror"], mod);
    else // Plain browser env
        mod(CodeMirror);
})(function (CodeMirror) {
    "use strict";

    CodeMirror.defineMode("codemirrormodes", function (conf) {
        let admonitionMode = CodeMirror.getMode(conf, "admonition");
        let tableMode = CodeMirror.getMode(conf, "table")
        console.log(tableMode)
        return CodeMirror.overlayMode(admonitionMode, tableMode, true);
    });

    CodeMirror.defineMIME("text/x-codemirrormodes", "codemirrormodes");
});
