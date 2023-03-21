// Lexer analyzes the input string and outpust an array of tokens.
// Also returning the number of lines and an array of errors (if any).
// Can add much more functionality here as project grows.

type TokenType =
  | "whitespace"
  | "punctuator"
  | "string_key"
  | "string_value"
  | "number"
  | "literal"
  | "invalid";

type TokenValue = string | number | boolean | null | undefined;

type LexerResult = {
  numLines: number;
  tokens: Token[];
  errors: string[];
};

export interface Token {
  type: TokenType;
  value: TokenValue;
  raw: string;
}

export default function tokenize(input: string): LexerResult {
  const length = input.length;

  let tokens: Token[] = [];
  let errors: string[] = [];
  let numLines = 1;
  let cursor = 0;
  let char = input[cursor];
  let mostRecentPunctuator: string | null = null;
  let mostRecentBrace: string | null = null;

  while (cursor < length) {
    // Handle whitespace
    if (/\s/.test(char)) {
      let value = "";
      while (/\s/.test(char)) {
        if (/\n/.test(char)) numLines++;
        value += char;
        char = input[++cursor];
      }

      tokens.push({
        type: "whitespace",
        value: JSON.stringify(value),
        raw: value,
      });
      continue;
    }

    // Handle Punctuators
    if (
      char === "," ||
      char === ":" ||
      char === "{" ||
      char === "}" ||
      char === "[" ||
      char === "]"
    ) {
      mostRecentPunctuator = char;
      if (/[{}[\]]/.test(char)) mostRecentBrace = char;
      tokens.push({ type: "punctuator", value: char, raw: char });
      cursor++;
      char = input[cursor];
      continue;
    }

    // Handle string keys
    if (
      char === '"' &&
      (mostRecentPunctuator === "{" ||
        (mostRecentPunctuator === "," && mostRecentBrace !== "["))
    ) {
      let value = "";
      char = input[++cursor];
      while (
        cursor < length &&
        (char !== '"' || (char === '"' && input[cursor - 1] === "\\"))
      ) {
        value += char;
        char = input[++cursor];
      }

      tokens.push({ type: "string_key", value: value, raw: `"${value}"` });
      char = input[++cursor];
      continue;
    }

    // Handle string values
    if (char === '"') {
      let value = "";
      char = input[++cursor];

      while (
        cursor < length &&
        (char !== '"' || (char === '"' && input[cursor - 1] === "\\"))
      ) {
        value += char;
        char = input[++cursor];
      }

      tokens.push({ type: "string_value", value: value, raw: `"${value}"` });
      char = input[++cursor];
      continue;
    }

    // Handle numbers
    if (/\d/.test(char)) {
      let value = "";
      while (
        /\d/.test(char) ||
        char === "." ||
        char === "-" ||
        char === "+" ||
        char.toLowerCase() === "e"
      ) {
        value += char;
        char = input[++cursor];
      }

      tokens.push({ type: "number", value: Number(value), raw: value });
      continue;
    }

    // Handle boolean and null literals
    const booleanRegex = /^(true|false)/;
    const nullRegex = /^null/;
    if (
      booleanRegex.test(input.substring(cursor)) ||
      nullRegex.test(input.substring(cursor))
    ) {
      const match =
        input.substring(cursor).match(booleanRegex) ||
        input.substring(cursor).match(nullRegex);
      const keyword = match?.[0] || "";
      tokens.push({ type: "literal", value: keyword, raw: keyword });
      cursor += keyword.length;
      char = input[cursor];
      continue;
    }

    // Handle Unrecognized input
    let value = "";
    while (cursor < length && !/[{}[\]:,\s]/.test(char)) {
      value += char;
      cursor++;
      char = input[cursor];
    }
    tokens.push({
      type: "invalid",
      value: value,
      raw: value,
    });
    errors.push(
      "Invalid token " + value + " at position " + (cursor - value.length)
    );
  }

  return {
    numLines: numLines,
    tokens: tokens,
    errors: errors,
  };
}
