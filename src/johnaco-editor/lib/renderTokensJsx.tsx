import { CSSProperties, ReactNode } from "react";
import { Theme, Token, TokenMap } from "..";
import { removeQuotes } from "./utils/removeQuotes";

interface Props {
  id?: string;
  children: ReactNode;
  color: string;
  style?: React.CSSProperties;
}

const TokenSpan = ({ id, children, color, style = {} }: Props) => (
  <span
    className="token"
    style={{ fontFamily: "inherit", color, ...style }}
    {...(id ? { id } : {})}
  >
    {children}
  </span>
);

export function renderTokensJsx(
  tokens: Token[],
  tokenMap: TokenMap,
  theme: Theme,
  hoverCards?: Record<string, string>
): JSX.Element[] {
  return tokens.map((t, i) => {
    const tokenClass = tokenMap[t.type]?.tokenClass;
    const color = tokenClass
      ? theme.tokenColors[tokenClass]
      : theme.defaultTextColor;

    let id: string | undefined;
    let style: CSSProperties = {};

    if (tokenClass === "Invalid")
      style = {
        ...style,
        textDecorationLine: "underline",
        textDecorationSkipInk: "none",
        textDecorationStyle: "wavy",
      };

    if (hoverCards) {
      const trimmed = removeQuotes(t.value);
      if (Object.keys(hoverCards).includes(trimmed)) {
        id = `hovercard_${trimmed}_${i}`;
        style = { ...style, backgroundColor: theme.highlightColor };
      }
    }

    return (
      <TokenSpan
        key={t.value + i.toString()}
        id={id}
        color={color}
        style={style}
      >
        {t.value}
      </TokenSpan>
    );
  });
}
