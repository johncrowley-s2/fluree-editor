import { Token, TokenMap } from "..";
import { testSuggestions } from "../../testSuggestions";
import fuzzySearch from "../lib/utils/fuzzySearch";
import { removeQuotes } from "../lib/utils/removeQuotes";

export const displayName = "JSON-LD";

export const tokenMap: TokenMap = {
  StringKey: {
    pattern: /^"(?:\\.|[^\n\r"\\])*?"(?=\s*:)/,
    tokenClass: "Keyword",
  },
  StringValue: { pattern: /^"(?:\\.|[^\n\r"\\])*?"/, tokenClass: "String" },
  Number: {
    pattern: /^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/,
    tokenClass: "Numeric",
  },
  Boolean: { pattern: /^(?:true|false)(?=[\s\]\},]|$)/, tokenClass: "Ext1" },
  Null: { pattern: /^null/, tokenClass: "Ext3" },
  Whitespace: { pattern: /^[\s]+/ },
  Punctuation: { pattern: /^(?:[{}\[\],:])/, tokenClass: "Punctuation" },
  IncompleteString: {
    pattern: /^"(?:\\.|[^\n\r"\\])*$/,
    tokenClass: "Invalid",
  },
  Invalid: { pattern: /.*/, tokenClass: "Invalid" },
  Newline: { pattern: /^(\r\n|\r|\n)/ },
};

export function prettify(jsonString: string): string {
  try {
    const parsed: any = JSON.parse(jsonString);
    const prettified: string = JSON.stringify(parsed, null, 2); // The number 2 indicates the number of spaces for indentation
    return prettified;
  } catch (error) {
    // If the input is not a valid JSON string, return the original input
    console.error("Invalid JSON string:", error);
    return jsonString;
  }
}

export function getSuggestions(
  value: string,
  tokens: Token[],
  currentTokenIndex: number,
  position: number
) {
  if (/^{\s*"(?!\S)/.test(value)) return snippets;
  const currentToken = tokens[currentTokenIndex];
  if (!currentToken) return [];
  const tokenValue = removeQuotes(currentToken.value);
  if (/\W+/.test(tokenValue)) return [];
  const matches = fuzzySearch(tokenValue, testSuggestions).slice(0, 5);
  if (matches.some((m) => m === tokenValue)) return [];
  return matches.map((m) => ({ label: m, value: m }));
}

export function getHovercards(
  value: string,
  tokens: Token[],
  currentTokenIndex: number,
  position: number
) {
  return {
    "@context":
      "Specifies the context in which a JSON-LD document is interpreted. It can be used to map terms used in the document to URIs and to provide information about the meaning of terms.",
    "@id":
      "Provides a unique identifier for a node in the graph. This can be a URL, a blank node identifier, or a JSON-LD string.",
    "@type":
      "Indicates the type of a node in the graph. This can be a URI or a JSON-LD string.",
    "@value":
      "Specifies the value of a node in the graph. This can be a literal value or a reference to another node.",
    "@language":
      "Indicates the language of a literal value. This can be any valid language tag.",
    "@index":
      "Specifies the index value of an element in a collection node. This can be any valid JSON-LD string.",
    "@reverse":
      "Indicates that a property is used to express a reverse relationship between nodes. The value of this keyword is another JSON-LD object.",
    "@nest":
      "Indicates that a property is used to nest a node within another node. The value of this keyword is another JSON-LD object.",
    "@prefix":
      "Provides a prefix that can be used in property names and value strings in a JSON-LD document. The value of this keyword is a string.",
    "@vocab":
      "Specifies a default vocabulary that can be used to expand property names in a JSON-LD document.",
  };
}

export function getErrors(
  value: string,
  tokens: Token[],
  currentTokenIndex: number,
  position: number
) {
  let results: string[] = [];
  tokens.forEach((t) => {
    if (t.type === "Invalid")
      results.push(
        `LexicalError: Invalid token \`${t.value}\` at position ${t.position} (Ln ${t.line}/Col ${t.column})`
      );
  });
  try {
    JSON.parse(value);
  } catch (e: any) {
    results.push(e.toString());
  }
  return results;
}

export const snippets = [
  {
    label: "query select",
    value: '{\n  "select": ["*"],\n  "from": "_collection"\n}',
  },
  {
    label: "query selectOne",
    value: '{\n  "selectOne": ["*"],\n  "from": "_collection"\n}',
  },
  {
    label: "query analytical",
    value:
      '{\n  "where": [\n      ["?p", "_predicate/name", "?name"]\n    ],\n  "select": ["?name"]\n}',
  },
  {
    label: "query block",
    value: '{\n  "block": 2,\n  "prettyPrint": false\n}',
  },
  { label: "query history", value: '{\n  "history": 123456789\n}' },
];
