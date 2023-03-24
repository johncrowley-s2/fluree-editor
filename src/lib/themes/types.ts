export type ThemeTokenClass =
  | "Keyword"
  | "String"
  | "Numeric"
  | "Punctuation"
  | "Invalid"
  | "Ext1"
  | "Ext2"
  | "Ext3"
  | "Ext4";

type TokenColors = {
  [key in ThemeTokenClass]: string;
};

export interface Theme {
  defaultTextColor: string;
  backgroundColor: string;
  caretColor: string;
  highlightColor: string;
  tokenColors: TokenColors;
}
