import { Token, TokenMap } from "../tokenize";

export interface LanguageDefinition {
  displayName: string;
  tokenMap: TokenMap;
  prettify?: (value: string) => string;
  getSuggestions?: (
    tokens: Token[],
    currentTokenIndex: number,
    position: number
  ) => string[];
  getHovercards?: (
    tokens: Token[],
    currentTokenIndex: number,
    position: number
  ) => Record<string, string>;
  getErrors?: (
    value: string,
    tokens: Token[],
    currentTokenIndex: number,
    position: number
  ) => string[];
}
