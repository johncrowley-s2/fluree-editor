import { Theme, Token, TokenMap } from "..";
import { removeQuotes } from "./utils/removeQuotes";

export function renderTokensHtml(
  tokens: Token[],
  tokenMap: TokenMap,
  theme: Theme,
  hoverCards?: Record<string, string>
): string {
  // Render the tokenized input into an html string.
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
          return `<span id=${`hovercard_${t.value}_${i}`} style="font-family:inherit;color:${color};background-color:white;background-color:${
            theme.highlightColor
          };">${t.value}</span>`;
        }
      }
      return `<span style="font-family:inherit;color:${color};">${t.value}</span>`;
    })
    .join("");
}
