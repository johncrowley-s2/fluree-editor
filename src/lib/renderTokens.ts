import { JSON_LD_KEYWORDS } from "./jsonLd";
import { Theme } from "./themes/types";
import { Token, TokenMap } from "./tokenize";

export default function renderTokens(
  tokens: Token[],
  tokenMap: TokenMap,
  theme: Theme
): string {
  // Render the tokenized input into an html string.
  // Could also rewrite this to render JSX instead of HTML;
  // Not sure if that would be less performant?

  return tokens
    .map((t, i) => {
      const tokenClass = tokenMap[t.type]?.tokenClass;
      const color = tokenClass
        ? theme.tokenColors[tokenClass]
        : theme.defaultTextColor;
      if (t.type === "whitespace") return t.value;
      if (t.type === "invalid") {
        return `<span style="font-family:inherit;color:${color};text-decoration-line:underline;text-decoration-style:wavy;text-decoration-skip-ink:none;text-decoration-color:${color};">${t.value}</span>`;
      }
      if (t.value && (t.type === "string_key" || t.type === "string_value")) {
        if (JSON_LD_KEYWORDS.includes(t.value)) {
          return `<span id=${`jldKeyword_${t.value}_${i}`} style="font-family:inherit;color:${color};background-color: ${
            theme.highlightColor
          };">${t.value}</span>`;
        }
      }
      return `<span style="font-family:inherit;color:${color};">${t.value}</span>`;
    })
    .join("");
}
