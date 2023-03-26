import { Theme } from "./types";

export const flureeLightTheme: Theme = {
  defaultTextColor: "#333333",
  backgroundColor: "#FCFCFC",
  caretColor: "#5A5A5A",
  lineNumberColor: "#888888",
  highlightColor: "#FFF8DC",
  tokenColors: {
    Keyword: "#0070AF",
    String: "#333333",
    Numeric: "#00518C",
    Punctuation: "#5A5A5A",
    Invalid: "#FF4242",
    Ext1: "#F57C00",
    Ext2: "#007A5E",
    Ext3: "#5E5E5E",
    Ext4: "#B388FF",
  },
};

export const flureeDarkTheme: Theme = {
  defaultTextColor: "#F8F8F2",
  backgroundColor: "#282A36",
  caretColor: "#F1F1F1",
  lineNumberColor: "#7F848E",
  highlightColor: "#44475A",
  tokenColors: {
    Keyword: "#61AFEF",
    String: "#FF6B6B",
    Numeric: "#C678DD",
    Punctuation: "#D4D4D4",
    Invalid: "#FF5555",
    Ext1: "#E5C07B",
    Ext2: "#98C379",
    Ext3: "#ABB2BF",
    Ext4: "#82AAFF",
  },
};
