import { useMemo, useRef, useState } from "react";
import findCurrentTokenIndex from "../lib/findCurrentTokenIndex";
import getCaretCoordinates from "../lib/getCaretCoordinates";
import useTheme from "../lib/hooks/useTheme";
import { LanguageDefinition } from "../lib/languages/types";
import { renderTokensJsx as renderTokens } from "../lib/renderTokensJsx";
import tokenize, { Token } from "../lib/tokenize";
import AutoComplete from "./AutoComplete";
import Checkmark from "./Checkmark";
import HoverCard from "./HoverCard";
import StatusBar from "./StatusBar";
import XMark from "./XMark";

interface Props {
  value: string;
  onValueChange: (s: string) => void;
  showLineNumbers: boolean;
  showStatusBar: boolean;
  readonly?: boolean;
  highlight?: boolean;
  language: LanguageDefinition;
}

export default function Editor({
  value,
  onValueChange,
  showLineNumbers,
  showStatusBar,
  highlight = true,
  readonly = false,
  language,
}: Props) {
  const { getSuggestions, getHovercards, getErrors } = language;

  const editorRef = useRef<HTMLTextAreaElement>(null);

  const { theme } = useTheme();

  const tokens = useMemo(() => tokenize(value, language.tokenMap), [value]);
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
    if (!getSuggestions || !editorRef.current) return [];
    const caretPosition = editorRef.current.selectionStart;
    return getSuggestions(tokens, currentTokenIndex, caretPosition);
  }, [tokens, currentTokenIndex]);

  const hoverCards = useMemo(() => {
    if (!getHovercards || !editorRef.current) return {};
    const caretPosition = editorRef.current.selectionStart;
    return getHovercards(tokens, currentTokenIndex, caretPosition);
  }, [tokens, currentTokenIndex]);

  const errors = useMemo(() => {
    if (!getErrors || !editorRef.current) return [];
    const caretPosition = editorRef.current.selectionStart;
    return getErrors(value, tokens, currentTokenIndex, caretPosition);
  }, [value, tokens, currentTokenIndex]);

  function handleEnter(text: string) {
    if (!editorRef.current) return;
    const { value: tokenValue } = tokens[currentTokenIndex];
    const newValue =
      value.slice(0, editorRef.current.selectionStart - tokenValue.length) +
      text +
      value.slice(editorRef.current.selectionStart);
    onValueChange(newValue);
  }

  const currentToken = tokens[currentTokenIndex];

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `.no-scrollbar{overflow:auto;-ms-overflow-style:none;scrollbar-width:none;}.no-scrollbar::-webkit-scrollbar{display:none;}`,
        }}
      />
      <div
        id="editorContainer"
        className="no-scrollbar"
        style={{
          height: "100%",
          width: "100%",
          overflow: "scroll",
          backgroundColor: theme.backgroundColor,
          color: theme.defaultTextColor,
          lineHeight: "1.2rem",
          border: "1px solid rgba(0,0,0,0)",
          borderRadius: "1rem",
          boxShadow: "0 0 6px rgba(0, 0, 0, 0.17)",
          position: "relative",
        }}
      >
        <div
          style={{
            ...styles.container,
            fontFamily: '"Source Code Pro", "Fira Mono", monospace',
            fontSize: 14,
          }}
        >
          {showLineNumbers ? (
            <div
              style={{
                position: "absolute",
                fontFamily: "inherit",
                fontSize: 12,
                height: "max-content",
                width: "1.4rem",
                color: theme.lineNumberColor,
                userSelect: "none",
                paddingRight: "0.3rem",
                paddingLeft: "0.3rem",
                textAlign: "right",
                padding: "0.7rem 0.3rem",
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
              ...styles.highlight,
              marginLeft: showLineNumbers ? "2rem" : 0,
              paddingLeft: "0.6rem",
            }}
          >
            {highlight
              ? renderTokens(tokens, language.tokenMap, theme, hoverCards)
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
                ...styles.textarea,
                marginLeft: showLineNumbers ? "2rem" : 0,
                paddingLeft: "0.6rem",
              }}
              value={value}
              onChange={(e) => onValueChange(e.target.value)}
              spellCheck="false"
              onKeyDown={(e) => {
                if (e.key == "Tab" && e.target instanceof HTMLTextAreaElement) {
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
          />
        </div>
        {showStatusBar ? (
          <StatusBar
            theme={theme}
            errors={errors}
            tokens={tokens}
            language={language}
          />
        ) : null}
      </div>
      {getHovercards ? <HoverCard hoverCards={hoverCards} /> : null}
    </>
  );
}

const styles = {
  container: {
    position: "relative",
    textAlign: "left",
    boxSizing: "border-box",
    padding: 0,
    overflow: "hidden",
    minHeight: "3rem",
  },
  textarea: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
    resize: "none",
    color: "inherit",
    overflow: "hidden",
    MozOsxFontSmoothing: "grayscale",
    WebkitFontSmoothing: "antialiased",
    WebkitTextFillColor: "transparent",
  },
  highlight: {
    position: "relative",
    // pointerEvents: "none",
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
    padding: "0.7rem 0.3rem",
    tabSize: "inherit",
    textIndent: "inherit",
    textRendering: "inherit",
    textTransform: "inherit",
    whiteSpace: "pre",
    overflowWrap: "normal",
  },
} as const;
