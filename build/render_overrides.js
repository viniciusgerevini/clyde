import { Lexer } from "@clyde-lang/parser";

const tokenMapping = {
	// [Lexer.TOKENS.TEXT]: "",
	// [Lexer.TOKENS.INDENT]: "",
	// [Lexer.TOKENS.DEDENT]: "",
	[Lexer.TOKENS.OPTION]: "function",
	[Lexer.TOKENS.STICKY_OPTION]: "function",
	[Lexer.TOKENS.FALLBACK_OPTION]: "function",
	[Lexer.TOKENS.BRACKET_OPEN]: "punctuation",
	[Lexer.TOKENS.BRACKET_CLOSE]: "punctuation",
	// [Lexer.TOKENS.EOF]: "",
	[Lexer.TOKENS.SPEAKER]: "string",
	[Lexer.TOKENS.LINE_ID]: "variable",
	[Lexer.TOKENS.TAG]: "tag",
	[Lexer.TOKENS.ID_SUFFIX]: "variable",
	[Lexer.TOKENS.BLOCK]: "keyword",
	[Lexer.TOKENS.DIVERT]: "function",
	[Lexer.TOKENS.DIVERT_PARENT]: "function",
	[Lexer.TOKENS.VARIATIONS_MODE]: "keyword",
	[Lexer.TOKENS.MINUS]: "operator",
	[Lexer.TOKENS.PLUS]: "operator",
	[Lexer.TOKENS.MULT]: "operator",
	[Lexer.TOKENS.DIV]: "operator",
	[Lexer.TOKENS.POWER]: "operator",
	[Lexer.TOKENS.MOD]: "operator",
	[Lexer.TOKENS.BRACE_OPEN]: "punctuation",
	[Lexer.TOKENS.BRACE_CLOSE]: "punctuation",
	[Lexer.TOKENS.AND]: "keyword",
	[Lexer.TOKENS.OR]: "keyword",
	[Lexer.TOKENS.NOT]: "keyword",
	[Lexer.TOKENS.EQUAL]: "keyword",
	[Lexer.TOKENS.NOT_EQUAL]: "keyword",
	[Lexer.TOKENS.GE]: "keyword",
	[Lexer.TOKENS.LE]: "keyword",
	[Lexer.TOKENS.GREATER]: "keyword",
	[Lexer.TOKENS.LESS]: "keyword",
	[Lexer.TOKENS.NUMBER_LITERAL]: "number",
	[Lexer.TOKENS.NULL_TOKEN]: "keyword",
	[Lexer.TOKENS.BOOLEAN_LITERAL]: "boolean",
	[Lexer.TOKENS.STRING_LITERAL]: "string",
	[Lexer.TOKENS.IDENTIFIER]: "variable",
	[Lexer.TOKENS.KEYWORD_SET]: "keyword",
	[Lexer.TOKENS.KEYWORD_TRIGGER]: "keyword",
	[Lexer.TOKENS.KEYWORD_WHEN]: "keyword",
	[Lexer.TOKENS.KEYWORD_MATCH]: "keyword",
	[Lexer.TOKENS.KEYWORD_DEFAULT]: "keyword",
	[Lexer.TOKENS.ASSIGN]: "operator",
	[Lexer.TOKENS.ASSIGN_SUM]: "operator",
	[Lexer.TOKENS.ASSIGN_SUB]: "operator",
	[Lexer.TOKENS.ASSIGN_DIV]: "operator",
	[Lexer.TOKENS.ASSIGN_MULT]: "operator",
	[Lexer.TOKENS.ASSIGN_POW]: "operator",
	[Lexer.TOKENS.ASSIGN_MOD]: "operator",
	[Lexer.TOKENS.ASSIGN_INIT]: "operator",
	// [Lexer.TOKENS.COMMA]: "",
	// [Lexer.TOKENS.LINE_BREAK]: "",
	[Lexer.TOKENS.LINK_FILE]: "url",
}

// https://marked.js.org/using_pro#renderer
export default (marked) => {
	marked.use({
		renderer: {
			code(token) {
				try {
					if (token.lang === "clyde" && !token.p) {
						const allTokens = Lexer.tokenize(token.text).getAll();
						const lines = token.text.split(/\r\n|\r|\n/);
						const lineBreaks = lines.length
						const lineNumbers = "<span></span>".repeat(lineBreaks);

						for (let i = allTokens.length - 1; i >= 0; i--) {
							const t = allTokens[i];
							let line = lines[t.line];

							if (tokenMapping[t.token]) {
								lines[t.line] = replaceInLine(line, t, tokenMapping[t.token]);
							} else if (t.token === Lexer.TOKENS.TEXT) {
								lines[t.line] = replaceInterpolatedVars(line, t);
							}
						}

						for (let i = 0; i < lines.length; i++) {
							if (lines[i].startsWith("--")) {
								lines[i] = `<span class="token comment">` + lines[i] + '</span>';
							}
						}

						const text = lines.join("\n");

						return `<pre class="clyde-code"><code>${text}<span aria-hidden="true" class="line-numbers-rows">${lineNumbers}</span></code></pre>`;
					}
				} catch (e) {
					console.error("Failed to parse code block", e);
				}
				return false;
			}
		}
	});
};

function replaceInLine(line, t, type) {
	const l = t.length ? t.length : t.value?.length || 1;
	return line.slice(0, t.column) +
				`<span class="token ${type}">` +
				line.slice(t.column, t.column + l) +
				'</span>' +
				line.slice(t.column + l);
}

function replaceInterpolatedVars(line, t) {
	const l = t.length ? t.length : t.value.length;
	const text = line.slice(t.column, t.column + l).replaceAll(/(%[\w|@]+%)/g, "<span class='token variable'>$1</span>");

	return line.slice(0, t.column) + text + line.slice(t.column + l);
}
