import { useMemo, useState } from "react";
import Editor from "./components/Editor";
import Errors from "./components/Errors";
import TokenInspector from "./components/TokenInspector";
import Toolbar from "./components/Toolbar";
import useTheme, { ThemeProvider } from "./lib/hooks/useTheme";
import { initValue } from "./lib/initValue";
import { JSON_LD_KEYWORDS } from "./lib/jsonLd";
import tokenize from "./lib/lexer";

function App() {
  const [value, setValue] = useState(initValue);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [highlight, setHighlight] = useState(true);
  const [readonly, setReadonly] = useState(false);

  const { tokens, errors, numLines } = useMemo(() => tokenize(value), [value]);

  const { theme } = useTheme();

  function render(): string {
    // This function renders the tokenized input into an html string.
    // Could also rewrite this to render JSX instead of HTML;
    // Not sure if that would be less performant?
    return tokens
      .map((t, i) => {
        if (t.type === "whitespace") return t.raw;
        if (t.type === "invalid") {
          return `<span style="font-family:inherit;color:${
            theme.tokenColors[t.type]
          };text-decoration-line:underline;text-decoration-style:wavy;text-decoration-skip-ink:none;text-decoration-color:${
            theme.tokenColors.invalid
          };">${t.raw}</span>`;
        }
        if (t.value && (t.type === "string_key" || t.type === "string_value")) {
          if (JSON_LD_KEYWORDS.includes(t.value?.toString())) {
            return `<span id=${`jldKeyword_${t.value}_${i}`} style="font-family:inherit;color:${
              theme.tokenColors[t.type]
            };background-color: ${theme.highlightColor};">${t.raw}</span>`;
          }
        }
        return `<span style="font-family:inherit;color:${
          theme.tokenColors[t.type]
        };">${t.raw}</span>`;
      })
      .join("");
  }

  return (
    <ThemeProvider>
      <div style={{ display: "flex", alignItems: "baseline" }}>
        <h2>Fluree Editor </h2>&nbsp;
        <a
          href="https://github.com/johncrowley-s2/fluree-editor"
          target="_blank"
        >
          View code on Github
        </a>
      </div>
      <div
        style={{
          width: "100%",
          height: "24rem",
          border: "1px solid black",
          borderRadius: "4px",
        }}
      >
        <Editor
          readonly={readonly}
          rows={numLines}
          value={value}
          onValueChange={(x) => setValue(x)}
          render={highlight ? render : () => value}
          numLines={numLines}
          showLineNumbers={showLineNumbers}
        />
      </div>
      <Toolbar
        showLineNumbers={showLineNumbers}
        setShowLineNumbers={setShowLineNumbers}
        highlight={highlight}
        setHighlight={setHighlight}
        readonly={readonly}
        setReadonly={setReadonly}
      />
      <hr />
      <Errors numLines={numLines} numTokens={tokens.length} errors={errors} />
      <hr />
      <TokenInspector tokens={tokens} />
    </ThemeProvider>
  );
}

export default App;
