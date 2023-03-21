interface TokenColors {
  [key: string]: string;
}

export interface Theme {
  defaultTextColor: string;
  backgroundColor: string;
  caretColor: string;
  highlightColor: string;
  tokenColors: TokenColors;
}

export const altLightTheme: Theme = {
  defaultTextColor: "#24292e",
  backgroundColor: "#f5f5f5",
  caretColor: "#000000",
  highlightColor: "#ffffcc",
  tokenColors: {
    punctuator: "#6c757d",
    string_key: "#0077c2",
    string_value: "#24292e",
    number: "#28a745",
    literal: "#6f42c1",
    invalid: "#dc3545",
  },
};

export const lightTheme: Theme = {
  defaultTextColor: "#1a1a1a",
  backgroundColor: "#ffffff",
  caretColor: "#000000",
  highlightColor: "#f2f2cc",
  tokenColors: {
    punctuator: "#868e96",
    string_key: "#006699",
    string_value: "#1a1a1a",
    number: "#007f00",
    literal: "#993399",
    invalid: "#cc0000",
  },
};

export const darkTheme: Theme = {
  defaultTextColor: "#d4d4d4",
  backgroundColor: "#1e1e1e",
  caretColor: "#ffffff",
  highlightColor: "#333333",
  tokenColors: {
    punctuator: "#d4d4d4",
    string_key: "#d1d1ff",
    string_value: "#d4d4d4",
    number: "#b5cea8",
    literal: "#b392f0",
    invalid: "#ff6464",
  },
};

export const altDarkTheme: Theme = {
  defaultTextColor: "#e1e1e1",
  backgroundColor: "#262626",
  caretColor: "#ffffff",
  highlightColor: "#404040",
  tokenColors: {
    punctuator: "#b3b3b3",
    string_key: "#ccccff",
    string_value: "#e1e1e1",
    number: "#79a14d",
    literal: "#d699ff",
    invalid: "#ff4d4d",
  },
};
