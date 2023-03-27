import { Theme } from "..";

export const flureeLightTheme: Theme = {
  defaultTextColor: "#333333",
  backgroundColor: "#FCFCFC",
  overlayBackgroundColor: "#F0F0F0",
  activeItemBackgroundColor: "#0070AF",
  activeItemTextColor: "#FFFFFF",
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
  defaultTextColor: "#CCCCCC",
  backgroundColor: "#1E1E1E",
  overlayBackgroundColor: "#2A2A2A",
  activeItemBackgroundColor: "#0070AF",
  activeItemTextColor: "#FFFFFF",
  caretColor: "#A5A5A5",
  lineNumberColor: "#888888",
  highlightColor: "#444444",
  tokenColors: {
    Keyword: "#57AFFF",
    String: "#CCCCCC",
    Numeric: "#2D96FF",
    Punctuation: "#A5A5A5",
    Invalid: "#FF7F7F",
    Ext1: "#FFB74D",
    Ext2: "#00BFA5",
    Ext3: "#9E9E9E",
    Ext4: "#D1BBFF",
  },
};
