import { TokenMap } from "../tokenize";

export interface LanguageDefinition {
  tokenMap: TokenMap;
  prettify?: (value: string) => string;
}
