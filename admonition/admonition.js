let admonitionTypes = '(note|abstract|info|tip|success|question|warning|failure|danger|bug|example|quote\"|NOTE|ABSTRACT|INFO|TIP|SUCCESS|QUESTION|WARNING|FAILURE|DANGER|BUG|EXAMPLE|QUOTE")';

CodeMirror.defineMode("admonition", function (config, modeConfig) {
  function blankLine(state) {
    if (state.isAdmonition) {
      return `line-admonition line-content line-background-admonition line-background-${state.admonitionType} admonition ${state.admonitionType} `;
    }
    return null;
  }

  return {
    startState: function () {
      return {
        isAdmonition: false,
        admonitionType: "none"
      };
    },
    copyState: function (s) {
      return {
        isAdmonition: s.isAdmonition,
        admonitionType: s.admonitionType,
      };
    },
    token: function (stream, state) {
      if (stream.sol()) {
        if (!state.isAdmonition) {
          if (stream.match(new RegExp('!!!' + admonitionTypes), false)) {
            stream.eatWhile('!');
            state.admonitionType = stream.match(new RegExp('^' + admonitionTypes))[0].toLowerCase();
            state.isAdmonition = true;
            return `line-admonition line-background-admonition line-background-header line-background-${state.admonitionType} admonition admonition-type ${state.admonitionType}`
          }
          stream.skipToEnd();
          return null;
        } else {
          if (stream.match(/!!!/, true)) {
            state.isAdmonition = false;
            stream.skipToEnd();
            return `line-admonition line-background-admonition line-background-${state.admonitionType} admonition admonition-end ${state.admonitionType}`;
          }
          stream.skipToEnd();
          return `line-admonition line-content line-background-admonition line-background-${state.admonitionType} admonition ${state.admonitionType} `;
        }
      } else {
        stream.skipToEnd();
        return null;
      }
    },
    blankLine: blankLine
  };
});
CodeMirror.defineMIME("text/x-admonition", "admonition");
