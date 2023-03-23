// The editor uses a textarea element with text color set to transparent
// overlaid over a pre element which shows the actual text with syntax highlighting.
// See the render() func that gets passed in as a prop here to see how that happens.

import { useMemo, useRef, useState } from "react";
import { debounce } from "../lib/debounce";
import getCaretCoordinates from "../lib/getCaretCoordinates";
import useTheme from "../lib/hooks/useTheme";
import AutoComplete from "./AutoComplete";
import HoverCard from "./HoverCard";

interface Props {
  rows: number;
  value: string;
  onValueChange: (s: string) => void;
  render: () => string;
  showLineNumbers: boolean;
  numLines: number;
  readonly?: boolean;
}

export default function Editor({
  rows,
  value,
  onValueChange,
  render,
  showLineNumbers,
  numLines,
  readonly = false,
}: Props) {
  const [isAutoCompleteVisible, setIsAutoCompleteVisible] = useState(false);

  const editorRef = useRef<HTMLTextAreaElement>(null);

  const { theme } = useTheme();

  const flashAutocomplete = debounce(() => {
    if (isAutoCompleteVisible) return;
    setIsAutoCompleteVisible(true);
    setTimeout(() => setIsAutoCompleteVisible(false), 3000);
  }, 200);

  const { top, left } = useMemo(() => {
    if (editorRef.current) {
      flashAutocomplete();
      return getCaretCoordinates(editorRef.current);
    }
    return { top: 0, left: 0 };
  }, [value]);

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
                borderRight: "1px solid black",
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
              marginLeft: showLineNumbers ? "1.7rem" : 0,
              paddingLeft: "0.6rem",
            }}
            dangerouslySetInnerHTML={{ __html: render() }}
          />
          {!readonly && (
            <textarea
              ref={editorRef}
              rows={rows}
              cols={100}
              wrap="off"
              style={{
                ...styles.editor,
                ...styles.textarea,
                marginLeft: showLineNumbers ? "1.7rem" : 0,
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
            isVisible={isAutoCompleteVisible}
            top={top}
            left={left}
          />
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
