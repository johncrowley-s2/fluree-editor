import { TokenMap } from "../tokenize";

export const tokenMap: TokenMap = {
  Keyword: {
    pattern:
      /^(?:SELECT|FROM|WHERE|AND|OR|JOIN|ON|ORDER BY|GROUP BY|HAVING|UNION|INSERT|UPDATE|DELETE|VALUES|CREATE|ALTER|DROP|TRUNCATE|DISTINCT|LIMIT|ASC|DESC|COUNT|AVG|SUM|MIN|MAX|IN|BETWEEN|LIKE|NULL|NOT|EXISTS|IS|ALL|ANY|SOME|INNER|OUTER|LEFT|RIGHT|FULL|CROSS|NATURAL|CASE|WHEN|THEN|ELSE|END|CAST|CONVERT|COALESCE|NULLIF|AS)\b/i,
    tokenClass: "Keyword",
  },
  Identifier: {
    pattern: /^(?:[a-zA-Z_][a-zA-Z0-9_]*)/,
  },
  StringValue: { pattern: /^'(?:''|[^'])*'/, tokenClass: "String" },
  Number: {
    pattern: /^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/,
    tokenClass: "Numeric",
  },
  Whitespace: { pattern: /^\s+/ },
  Punctuation: { pattern: /^(?:[(),;*\.=])/, tokenClass: "Punctuation" },
  Invalid: { pattern: /^[^\s\w(),;*'=]+/, tokenClass: "Invalid" },
};
