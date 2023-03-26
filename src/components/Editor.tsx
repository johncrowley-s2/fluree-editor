import { useMemo, useRef, useState } from "react";
import getCaretCoordinates from "../lib/getCaretCoordinates";
import useTheme from "../lib/hooks/useTheme";
import { LanguageDefinition } from "../lib/languages/types";
import renderTokens from "../lib/renderTokens";
import tokenize, { Token } from "../lib/tokenize";
import AutoComplete from "./AutoComplete";
import Checkmark from "./Checkmark";
import HoverCard from "./HoverCard";
import XMark from "./XMark";

type ContextType = "property" | "value" | "unknown";

interface Context {
  type: ContextType;
  key?: string;
  contextObj?: Record<string, any>;
}

interface Props {
  value: string;
  onValueChange: (s: string) => void;
  showLineNumbers: boolean;
  readonly?: boolean;
  highlight?: boolean;
  language: LanguageDefinition;
}

function findCurrentTokenIndex(
  tokens: Token[],
  cursorPosition: number
): number {
  let currentTokenIndex = 0;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.position < cursorPosition) {
      if (
        currentTokenIndex === null ||
        token.position > tokens[currentTokenIndex].position
      ) {
        currentTokenIndex = i;
      }
    } else {
      break;
    }
  }

  return currentTokenIndex;
}

// function getContext(tokens: Token[], cursorPosition: number): Context {
//   const currentToken = findCurrentToken(tokens, cursorPosition);
//   console.log("CURRENT TOKEN: ", currentToken);
//   if (!currentToken) {
//     return { type: "unknown" };
//   }

//   let key: string | undefined;
//   let contextObj: Record<string, any> | undefined;

//   switch (currentToken.type) {
//     case "StringKey":
//       return { type: "property", key: currentToken.value, contextObj };

//     case "StringValue":
//     case "Number":
//     case "Boolean":
//     case "Null":
//       // Find the corresponding key
//       for (let i = tokens.indexOf(currentToken) - 1; i >= 0; i--) {
//         if (tokens[i].type === "StringKey") {
//           key = tokens[i].value;
//           break;
//         }
//       }

//       // Find the "@context" object
//       for (let i = 0; i < tokens.length; i++) {
//         if (
//           tokens[i].type === "StringKey" &&
//           tokens[i].value === '"@context"'
//         ) {
//           try {
//             const contextStr = tokens[i + 2]?.value;
//             contextObj = contextStr ? JSON.parse(contextStr) : undefined;
//           } catch (err) {
//             // Invalid JSON in the "@context" value
//           }
//           break;
//         }
//       }

//       return { type: "value", key, contextObj };

//     default:
//       return { type: "unknown" };
//   }
// }

export default function Editor({
  value,
  onValueChange,
  showLineNumbers,
  highlight = true,
  readonly = false,
  language,
}: Props) {
  const { getSuggestions, getHovercards } = language;

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
          __html: `.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none;}.no-scrollbar::-webkit-scrollbar{display:none;/*SafariandChrome*/}`,
        }}
      />
      <div
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
          position: "relative"
        }}
      >
        <div
          style={{
            ...styles.container,
            fontFamily: '"Fira code", "Fira Mono", monospace',
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
            dangerouslySetInnerHTML={{
              __html: highlight
                ? renderTokens(tokens, language.tokenMap, theme, hoverCards)
                : value,
            }}
          />
          {!readonly && (
            <textarea
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
                  var start = e.target.selectionStart;
                  var end = e.target.selectionEnd;
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
        <div
          style={{
            position: "sticky",
            left: 0,
            bottom: -1,
            height: "1.7rem",
            backgroundColor: theme.backgroundColor,
            padding: "0 0.5rem",
            fontFamily: "sans-serif",
            fontSize: "0.7rem",
          }}
        >
          <div
            style={{
              height: "100%",
              borderTop: "1px solid " + theme.defaultTextColor,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0 1rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <Checkmark size={14} color={theme.defaultTextColor} />
              &nbsp;0 Errors
            </div>
            <div>
              Ln {currentToken?.line}, Col {currentToken?.column}&nbsp;&nbsp;&nbsp;&nbsp;{language.displayName || ""}
            </div>
          </div>
        </div>
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
