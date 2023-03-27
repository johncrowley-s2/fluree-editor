import { useMemo, useRef } from "react";
import { LanguageDefinition, Theme } from "../..";
import * as jsonLd from "../../languages/json-ld";
import * as sql from "../../languages/sql";
import { flureeDarkTheme, flureeLightTheme } from "../../themes/fluree";
import { renderTokensJsx as renderTokens } from "../renderTokensJsx"; // Change to renderTokensHtml fro HTML rendering
import tokenize from "../tokenize";
import findCurrentTokenIndex from "../utils/findCurrentTokenIndex";
import getCaretCoordinates from "../utils/getCaretCoordinates";
import AutoComplete from "./AutoComplete";
import HoverCard from "./HoverCard";
import StatusBar from "./StatusBar";

const languageMap: Record<string, LanguageDefinition> = {
  "json-ld": jsonLd,
  sql: sql,
};

const themeMap: Record<string, Theme> = {
  light: flureeLightTheme,
  dark: flureeDarkTheme,
};

interface Props {
  value: string;
  onValueChange: (s: string) => void;
  showLineNumbers?: boolean;
  showStatusBar?: boolean;
  readonly?: boolean;
  highlight?: boolean;
  language?: string;
  theme?: string;
  fontSize?: number;
}

export default function Editor({
  value,
  onValueChange,
  showLineNumbers = true,
  showStatusBar = true,
  highlight = true,
  readonly = false,
  language = "json-ld",
  theme: themeKey = "light",
  fontSize = 14,
}: Props) {
  const lang: LanguageDefinition = languageMap[language] || jsonLd;
  const { displayName, tokenMap, getSuggestions, getHovercards, getErrors } =
    lang;

  const theme = themeMap[themeKey];

  const editorRef = useRef<HTMLTextAreaElement>(null);

  const tokens = useMemo(() => tokenize(value, tokenMap), [value]);
  const numLines = useMemo(() => value.split("\n").length, [value]);

  const { top, left } = useMemo(() => {
    if (editorRef.current) {
      return getCaretCoordinates(editorRef.current);
    }
    return { top: 0, left: 0 };
  }, [value]);

  const currentTokenIndex = useMemo(() => {
    if (!editorRef.current) return 0;
    const caretPosition = editorRef.current.selectionStart;
    return findCurrentTokenIndex(tokens, caretPosition);
  }, [tokens]);

  const suggestions = useMemo(() => {
    if (!getSuggestions) return [];
    const caretPosition = editorRef.current?.selectionStart || 0;
    return getSuggestions(tokens, currentTokenIndex, caretPosition);
  }, [tokens, currentTokenIndex]);

  const hoverCards = useMemo(() => {
    if (!getHovercards) return {};
    const caretPosition = editorRef.current?.selectionStart || 0;
    return getHovercards(tokens, currentTokenIndex, caretPosition);
  }, [tokens, currentTokenIndex]);

  const errors = useMemo(() => {
    if (!getErrors) return [];
    const caretPosition = editorRef.current?.selectionStart || 0;
    return getErrors(value, tokens, currentTokenIndex, caretPosition);
  }, [value, tokens, currentTokenIndex]);

  // TODO: This logic probably needs to be more language-agnostic or else
  // moved to be with the language definition.
  function handleEnter(text: string) {
    if (!editorRef.current) return;
    const { value: tokenValue } = tokens[currentTokenIndex];
    let start = editorRef.current.selectionStart - tokenValue.length;
    if (tokenValue[0] === '"') start++;
    const newValue =
      value.slice(0, start) +
      text +
      (tokenValue[0] === '"' ? '"' : "") +
      value.slice(editorRef.current.selectionStart);
    onValueChange(newValue);
  }

  const currentToken = tokens[currentTokenIndex];

  const additionalEditorStyles = {
    marginLeft: showLineNumbers ? fontSize * 1.2 : 0,
    paddingLeft: fontSize * 0.8,
  };

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `.no-scrollbar{overflow:auto;-ms-overflow-style:none;scrollbar-width:none;}.no-scrollbar::-webkit-scrollbar{display:none;}`,
        }}
      />
      <div
        id="editorContainer"
        style={{
          height: "100%",
          width: "100%",
          backgroundColor: theme.backgroundColor,
          color: theme.defaultTextColor,
          lineHeight: fontSize * 1.5 + "px",
          border: "1px solid rgba(0,0,0,0)",
          borderRadius: 8,
          boxShadow: "0 0 6px rgba(0, 0, 0, 0.1)",
          padding: fontSize,
          paddingBottom: showStatusBar ? fontSize * 1.5 : fontSize,
          boxSizing: "border-box",
          position: "relative",
          overflow: "visible",
        }}
      >
        <div
          className="no-scrollbar"
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
            overflow: "scroll",
          }}
        >
          <div
            style={{
              ...styles.container,
              fontFamily: '"Source Code Pro", "Fira Mono", monospace',
              fontSize: fontSize,
            }}
          >
            {showLineNumbers ? (
              <div
                style={{
                  position: "absolute",
                  fontFamily: "inherit",
                  fontSize: fontSize * 0.8,
                  height: "max-content",
                  width: fontSize * 1.2,
                  color: theme.lineNumberColor,
                  userSelect: "none",
                  textAlign: "right",
                  padding: 0,
                }}
              >
                {[...Array(numLines)].map((_, i) => (
                  <div
                    key={i}
                    style={{
                      fontFamily: "inherit",
                      ...(currentToken?.line === i + 1
                        ? { color: theme.defaultTextColor }
                        : {}),
                    }}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
            ) : null}
            <pre
              style={{
                ...styles.editor,
                ...additionalEditorStyles,
                ...styles.highlight,
              }}
            >
              {highlight
                ? renderTokens(tokens, tokenMap, theme, hoverCards)
                : value}
            </pre>
            {!readonly && (
              <textarea
                id="textarea"
                ref={editorRef}
                rows={numLines}
                cols={100}
                wrap="off"
                style={{
                  ...styles.editor,
                  ...additionalEditorStyles,
                  ...styles.textarea,
                }}
                value={value}
                onChange={(e) => onValueChange(e.target.value)}
                spellCheck="false"
                onKeyDown={(e) => {
                  if (
                    e.key == "Tab" &&
                    e.target instanceof HTMLTextAreaElement
                  ) {
                    e.preventDefault();
                    const start = e.target.selectionStart;
                    const end = e.target.selectionEnd;
                    e.target.value =
                      e.target.value.substring(0, start) +
                      "\t" +
                      e.target.value.substring(end);
                    e.target.selectionStart = e.target.selectionEnd = start + 1;
                  }
                }}
              />
            )}
            <AutoComplete
              isVisible={suggestions.length > 0}
              top={top}
              left={left}
              suggestions={suggestions}
              handleEnter={handleEnter}
              backgroundColor={theme.backgroundColor}
              textColor={theme.defaultTextColor}
            />
          </div>
        </div>
        {showStatusBar ? (
          <StatusBar
            theme={theme}
            errors={errors}
            tokens={tokens}
            languageName={displayName}
            fontSize={fontSize * 0.8}
          />
        ) : null}
      </div>
      {getHovercards ? (
        <HoverCard
          hoverCards={hoverCards}
          backgroundColor={theme.backgroundColor}
          textColor={theme.defaultTextColor}
          fontSize={fontSize}
        />
      ) : null}
    </>
  );
}

const styles = {
  container: {
    position: "relative",
    textAlign: "left",
    boxSizing: "border-box",
    padding: 0,
    height: "100%",
  },
  textarea: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "500%",
    resize: "none",
    color: "inherit",
    MozOsxFontSmoothing: "grayscale",
    WebkitFontSmoothing: "antialiased",
    WebkitTextFillColor: "transparent",
  },
  highlight: {
    position: "relative",
  },
  editor: {
    margin: 0,
    border: 0,
    background: "none",
    boxSizing: "inherit",
    display: "inherit",
    fontFamily: "inherit",
    fontSize: "inherit",
    fontStyle: "inherit",
    fontVariantLigatures: "inherit",
    fontWeight: "inherit",
    letterSpacing: "inherit",
    lineHeight: "inherit",
    tabSize: "inherit",
    textIndent: "inherit",
    textRendering: "inherit",
    textTransform: "inherit",
    whiteSpace: "pre",
    overflowWrap: "normal",
    padding: 0,
  },
} as const;
