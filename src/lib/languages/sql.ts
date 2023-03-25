import { TokenMap } from "../tokenize";

export const tokenMap: TokenMap = {
  Keyword: {
    pattern:
      /^(?:SELECT|FROM|WHERE|AND|OR|(?:LEFT|RIGHT|FULL|INNER|OUTER|CROSS|NATURAL)?\s*JOIN|ON|ORDER BY|GROUP BY|HAVING|UNION|INSERT|UPDATE|DELETE|VALUES|CREATE|ALTER|DROP|TRUNCATE|DISTINCT|LIMIT|ASC|DESC|COUNT|AVG|SUM|MIN|MAX|IN|BETWEEN|LIKE|NULL|NOT|EXISTS|IS|ALL|ANY|SOME|CASE|WHEN|THEN|ELSE|END|CAST|CONVERT|COALESCE|NULLIF|AS)\b/i,
    tokenClass: "Keyword",
  },
  Identifier: {
    pattern: /^(?:[a-zA-Z_][a-zA-Z0-9_]*\s*\.\s*)?(?:[a-zA-Z_][a-zA-Z0-9_]*)/,
  },
  StringValue: { pattern: /^'(?:''|[^'])*'/, tokenClass: "String" },
  Number: {
    pattern: /^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/,
    tokenClass: "Numeric",
  },
  Whitespace: { pattern: /^\s+/ },
  Punctuation: { pattern: /^(?:[(),;*])/, tokenClass: "Punctuation" },
  Invalid: { pattern: /^[^\s\w(),;*']+/ },
};

// export function prettify(sql: string): string {
//   const tokens: Token[] = tokenize(sql, tokenMap);

//   let formattedSQL = "";

//   let previousToken: Token | null = null;
//   let indentLevel = 0;

//   for (const token of tokens) {
//     if (token.type === "Whitespace") {
//       continue;
//     }

//     if (
//       previousToken &&
//       (previousToken.type === "Keyword" || token.type === "Keyword")
//     ) {
//       if (
//         token.value.toUpperCase() === "SELECT" ||
//         token.value.toUpperCase() === "FROM"
//       ) {
//         formattedSQL += "\n" + " ".repeat(Math.max(0, indentLevel * 2));
//       } else if (
//         token.value.toUpperCase() === "WHERE" ||
//         token.value.toUpperCase() === "GROUP BY" ||
//         token.value.toUpperCase() === "HAVING" ||
//         token.value.toUpperCase() === "ORDER BY" ||
//         token.value.toUpperCase() === "LIMIT"
//       ) {
//         indentLevel++;
//         formattedSQL += "\n" + " ".repeat(Math.max(0, indentLevel * 2));
//       } else {
//         formattedSQL += " ";
//       }
//     } else if (
//       previousToken &&
//       (previousToken.type === "Punctuation" || token.type === "Punctuation")
//     ) {
//       if (token.value === "," || previousToken.value === ",") {
//         formattedSQL = formattedSQL.trimRight() + " ";
//       } else if (previousToken.value === "(" || token.value === ")") {
//         formattedSQL += token.value;
//       } else {
//         formattedSQL += " " + token.value + " ";
//       }
//     } else if (previousToken) {
//       formattedSQL += " ";
//     }

//     formattedSQL += token.value;

//     if (
//       token.type === "Keyword" &&
//       (token.value.toUpperCase() === "FROM" ||
//         token.value.toUpperCase() === "GROUP BY" ||
//         token.value.toUpperCase() === "HAVING" ||
//         token.value.toUpperCase() === "ORDER BY" ||
//         token.value.toUpperCase() === "LIMIT")
//     ) {
//       indentLevel--;
//     }

//     previousToken = token;
//   }

//   return formattedSQL.trim();
// }
