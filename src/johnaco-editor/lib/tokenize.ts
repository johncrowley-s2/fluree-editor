import { Token, TokenMap } from "..";

export default function tokenize(input: string, tokenMap: TokenMap): Token[] {
  const tokens: Token[] = [];
  let position = 0;
  let line = 1;
  let column = 1;

  function match(regex: RegExp): string | null {
    const match = input.slice(position).match(regex);
    return match ? match[0] : null;
  }

  function addToken(type: string, value: string) {
    tokens.push({
      type,
      value,
      line,
      position,
      column,
    });
    const newlineCount = (value.match(/\n/g) || []).length;
    line += newlineCount;
    if (newlineCount > 0) {
      column = value.length - value.lastIndexOf("\n");
    } else {
      column += value.length;
    }
    position += value.length;
  }

  while (position < input.length) {
    let matched = false;
    for (const tokenType of Object.keys(tokenMap)) {
      const tokenDef = tokenMap[tokenType];
      const matchResult = match(tokenDef.pattern);
      if (matchResult) {
        matched = true;
        addToken(tokenType, matchResult);
        break;
      }
    }
    if (!matched) {
      addToken("Invalid", input[position]);
      position++;
      column++;
    }
  }

  return tokens;
}
