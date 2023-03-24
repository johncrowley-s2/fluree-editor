import { useMemo, useRef, useState } from "react";
import { debounce } from "../lib/debounce";
import getCaretCoordinates from "../lib/getCaretCoordinates";
import useTheme from "../lib/hooks/useTheme";
import { LanguageDefinition } from "../lib/languages/types";
import renderTokens from "../lib/renderTokens";
import tokenize from "../lib/tokenize";
import AutoComplete from "./AutoComplete";
import HoverCard from "./HoverCard";

interface Props {
  value: string;
  onValueChange: (s: string) => void;
  showLineNumbers: boolean;
  readonly?: boolean;
  language: LanguageDefinition;
}

export default function Editor({
  value,
  onValueChange,
  showLineNumbers,
  readonly = false,
  language,
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

  const suggestions: string[] = []; //useMemo(() => {
  //   if (!editorRef.current) return [];

  //   let cursor = editorRef.current.selectionStart - 1;
  //   let char = value[cursor];
  //   let recentInput = "";

  //   while (!/\s/.test(char)) {
  //     recentInput = char + recentInput;
  //     char = value[--cursor];
  //   }

  //   if (!recentInput.length) return [];

  //   const result = aCsuggestions.filter((s) =>
  //     s.includes(recentInput.toLowerCase())
  //   );
  //   if (!result.length) {
  //     if (isAutoCompleteVisible) setIsAutoCompleteVisible(false);
  //     return [];
  //   }

  //   flashAutocomplete();
  //   return result;
  // }, [value]);

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
          <AutoComplete isVisible={isAutoCompleteVisible} top={top} left={left}>
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
    minHeight: "2rem",
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
    padding: 0,
    tabSize: "inherit",
    textIndent: "inherit",
    textRendering: "inherit",
    textTransform: "inherit",
    whiteSpace: "pre",
    overflowWrap: "normal",
  },
} as const;
