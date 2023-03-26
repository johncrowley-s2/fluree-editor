import { removeQuotes } from "./removeQuotes";
import { Theme } from "./themes/types";
import { Token, TokenMap } from "./tokenize";

export default function renderTokens(
  tokens: Token[],
  tokenMap: TokenMap,
  theme: Theme,
  hoverCards?: Record<string, string>
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
      if (t.type === "Whitespace") return t.value;
      if (tokenClass === "Invalid") {
        return `<span style="font-family:inherit;color:${color};text-decoration-line:underline;text-decoration-style:wavy;text-decoration-skip-ink:none;text-decoration-color:${color};">${t.value}</span>`;
      }
      if (hoverCards) {
        if (Object.keys(hoverCards).includes(removeQuotes(t.value))) {
          return `<span id=${`hovercard_${t.value}_${i}`} style="font-family:inherit;color:${color};background-color:white;background-color:${theme.highlightColor};">${t.value}</span>`;
        }
      }
      return `<span style="font-family:inherit;color:${color};">${t.value}</span>`;
    })
    .join("");
}
