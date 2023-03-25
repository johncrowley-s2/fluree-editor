import { useMemo, useRef, useState } from "react";
import { debounce } from "../lib/debounce";
import getCaretCoordinates from "../lib/getCaretCoordinates";
import useTheme from "../lib/hooks/useTheme";
import { LanguageDefinition } from "../lib/languages/types";
import renderTokens from "../lib/renderTokens";
import tokenize, { Token } from "../lib/tokenize";
import AutoComplete from "./AutoComplete";
import HoverCard from "./HoverCard";

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
  language: LanguageDefinition;
  getSuggestions?: (
    tokens: Token[],
    currentTokenIndex: number,
    caretPosition: number
  ) => string[];
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
  readonly = false,
  language,
  getSuggestions,
}: Props) {
  const [isAutoCompleteVisible, setIsAutoCompleteVisible] = useState(false);

  const editorRef = useRef<HTMLTextAreaElement>(null);

  const { theme } = useTheme();

  const tokens = useMemo(() => tokenize(value, language.tokenMap), [value]);
  const numLines = useMemo(() => value.split("\n").length, [value]);

  const flashAutocomplete = debounce(() => {
    if (isAutoCompleteVisible) return;
    setIsAutoCompleteVisible(true);
    setTimeout(() => setIsAutoCompleteVisible(false), 3000);
  }, 200);

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

  return (
    <>
      <div
        style={{
          height: "100%",
          width: "100%",
          overflow: "scroll",
          backgroundColor: theme.backgroundColor,
          color: theme.defaultTextColor,
        }}
      >
        <div
          style={{
            ...styles.container,
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: 12,
          }}
        >
          {showLineNumbers ? (
            <div
              style={{
                position: "absolute",
                fontFamily: "inherit",
                height: "max-content",
                width: "1.4rem",
                color: theme.defaultTextColor,
                userSelect: "none",
                borderRight: "1px solid " + theme.defaultTextColor,
                paddingRight: "0.3rem",
                paddingLeft: "0.3rem",
                textAlign: "right",
                padding: "0.7rem 0.3rem",
              }}
            >
              {[...Array(numLines)].map((_, i) => (
                <div key={i} style={{ fontFamily: "inherit" }}>
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
              __html: renderTokens(tokens, language.tokenMap, theme),
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
          <AutoComplete isVisible={suggestions.length > 0} top={top} left={left}>
            {suggestions.map((s) => (
              <div key={s}>{s}</div>
            ))}
          </AutoComplete>
        </div>
      </div>
      <HoverCard />
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
