import { TokenMap } from "../tokenize";

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
