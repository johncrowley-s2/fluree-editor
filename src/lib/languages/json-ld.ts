import { TokenMap } from "../tokenize";

export const tokenMap: TokenMap = {
  StringKey: {
    pattern: /^"(?:\\.|[^"\\])*"(?=\s*:)/,
    tokenClass: "Keyword",
  },
  StringValue: { pattern: /^"(?:\\.|[^"\\])*"/, tokenClass: "String" },
  Number: {
    pattern: /^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/,
    tokenClass: "Numeric",
  },
  Boolean: { pattern: /^(?:true|false)/, tokenClass: "Ext1" },
  Null: { pattern: /^null/, tokenClass: "Ext3" },
  Whitespace: { pattern: /^\s+/ },
  Punctuation: { pattern: /^(?:[{}\[\],:])/, tokenClass: "Punctuation" },
  Invalid: { pattern: /^[^\s"0-9\[\]{},:tfn-]+/, tokenClass: "Invalid" },
};
