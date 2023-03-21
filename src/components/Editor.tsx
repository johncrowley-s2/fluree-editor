// The editor uses a textare element with text color set to transparent
// overlaid over a pre element which shows the actual text with syntax highlighting.
// See the render() func that gets passed in as a prop here to see how that happens.

import { Theme } from "../themes";

interface Props {
  rows: number;
  value: string;
  onValueChange: (s: string) => void;
  render: () => string;
  theme: Theme;
  showLineNumbers: boolean;
  numLines: number;
  readonly?: boolean;
}

export default function Editor({
  rows,
  value,
  theme,
  onValueChange,
  render,
  showLineNumbers,
  numLines,
  readonly = false,
}: Props) {
  return (
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
              width: "1.7rem",
              color: theme.defaultTextColor,
              userSelect: "none",
              borderRight: "1px solid black",
              paddingLeft: "0.3rem",
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
          />
        )}
      </div>
    </div>
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
