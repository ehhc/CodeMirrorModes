
CodeMirror.defineMode("codemirrormodes", function(conf) {
    let admonitionMode = CodeMirror.getMode(conf, "admonition");
    let tableMode = CodeMirror.getMode(conf, "table")
    console.log(tableMode)
    return CodeMirror.overlayMode(admonitionMode, tableMode, true);
});

CodeMirror.defineMIME("text/x-codemirrormodes", "codemirrormodes");
