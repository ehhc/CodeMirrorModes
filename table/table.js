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
            state.currentLineIsTable = false;
			state.lineCounter = 0;
			state.cellCounter = 0;
			state.textAlignStore = [];
            return null;
        }
		
		function getTextAlignmentAsArray(line) {
			if(! line || (!line.match(/(\|[:-\s]+\|([:-\s]+\|)?)+/))){
				return [];
			}
			let result = [];
			let elements = line.trim().split("|");
			for(let e of elements) {
				if(e === "") {
					continue;
				}
				let align = "";
				if(e.match(/\s*:\s*-+\s*/)) {
					align = " text-align-left ";
				}
				if(e.match(/\s*-+\s*:\s*/)) {
					align = " text-align-right ";
				}
				if(e.match(/\s*:\s*-+\s*:\s*/)) {
					align = " text-align-center ";
				}
				result.push(align);
			}
			return result;
		}

        return {
            startState: function () {
                return {
                    currentLineIsTable: false,
					lineCounter: 0,
					cellCounter: 0,
					textAlignStore : []
                };
            },
            copyState: function (s) {
                return {
                    currentLineIsTable: s.currentLineIsTable,
					lineCounter: s.lineCounter,
					textAlignStore: s.textAlignStore,
                };
            },
            token: function (stream, state) {
				if (stream.sol()) {
					state.cellCounter = 0;
					state.lineCounter++;
					if(stream.match(/(\|[^|]+\|([^|]+\|)?)+/, false)) {
                        state.currentLineIsTable = true;
                    }
					if(state.lineCounter === 1){
						state.textAlignStore = getTextAlignmentAsArray(stream.lookAhead(1));
					}
				}
                if(state.currentLineIsTable) {
					let evenOddPrefix = state.lineCounter % 2 !== 0 ? " line-table-line-even " : " line-table-line-odd ";
					let alignPrefix = "";
					let headerPrefix = state.lineCounter === 1 ? " line-table-line-header " : "";
					if(state.textAlignStore && (state.textAlignStore.length >= state.cellCounter)) {
						alignPrefix = state.textAlignStore[state.cellCounter]
					}
                    if(stream.next() === '|') {
                        return "line-table-line table-cell table-cell-border" + evenOddPrefix + headerPrefix;
                    }
                    stream.skipTo("|");
					state.cellCounter++;
                    return "line-table-line table-cell table-cell-content" + evenOddPrefix + alignPrefix + headerPrefix;
                }
                stream.skipToEnd();
                return null;
            },
            blankLine: blankLine
        };

    });

    CodeMirror.defineMIME("text/x-table", "table");

});
