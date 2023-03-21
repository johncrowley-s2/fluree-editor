import { useEffect, useState } from "react";
import Editor from "./components/Editor";
import { initValue } from "./lib/initValue";
import {
  JldKeyword,
  JSON_LD_KEYWORDS,
  JSON_LD_KEYWORD_DESCRIPTIONS,
} from "./lib/jsonLd";
import tokenize, { Token } from "./lib/lexer";
import {
  altDarkTheme,
  altLightTheme,
  darkTheme,
  lightTheme,
  Theme,
} from "./themes";

function App() {
  const [value, setValue] = useState(initValue);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [numLines, setNumLines] = useState(0);
  const [theme, setTheme] = useState<Theme>(lightTheme);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [highlight, setHighlight] = useState(true);
  const [readonly, setReadonly] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [currentKeyword, setCurrentKeyword] = useState<JldKeyword>("@context");

  useEffect(() => {
    // Lexer tokenizes input string whenever it changes
    const { tokens, errors, numLines } = tokenize(value);
    setTokens(tokens);
    setErrors(errors);
    setNumLines(numLines);
  }, [value]);

  useEffect(() => {
    // Effect for showing the "tooltip" thing (need a better term but yea...)
    // Doing some hacky shit here to find the overlapping span element behind the text area.

    // Debounce function to delay handleMouseMove calls
    const debounce = (func: any, delay: number) => {
      let timeoutId: any;
      return function (...args: any[]) {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
          func.apply(null, args);
        }, delay);
      };
    };

    // Debounced handleMouseMove function with a 200ms delay
    const handleMouseMoveDebounced = debounce(handleMouseMove, 200);

    function handleMouseMove(e: MouseEvent) {
      setTooltipPosition({ x: e.clientX, y: e.clientY });
      // All the elements the mouse is currently overlapping with
      const _overlapped = document.elementsFromPoint(e.pageX, e.pageY);
      // Check to see if any element id matches an id in elems
      const _included = _overlapped.filter(
        (el) => el.id.split("_")[0] === "jldKeyword"
      );
      const ids = _included.map((el) => el.id);

      const elems = Array.from(
        document.querySelectorAll('[id^="jldKeyword"]')
      ).map((x) => x.id);

      for (const index in elems) {
        const id = elems[index];
        const elem = document.getElementById(id);
        if (elem && ids.includes(id)) {
          setCurrentKeyword(id.split("_")[1] as JldKeyword);
          setTimeout(() => setShowTooltip(true), 800);
        } else {
          setShowTooltip(false);
        }
      }
    }

    document.addEventListener("mousemove", handleMouseMoveDebounced);

    return () =>
      document.removeEventListener("mousemove", handleMouseMoveDebounced);
  }, []);

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

  function handleChangeTheme(e: React.ChangeEvent<HTMLSelectElement>) {
    if (e.target.value === "light1") setTheme(lightTheme);
    if (e.target.value === "light2") setTheme(altLightTheme);
    if (e.target.value === "dark1") setTheme(darkTheme);
    if (e.target.value === "dark2") setTheme(altDarkTheme);
  }

  return (
    <>
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
          theme={theme}
          numLines={numLines}
          showLineNumbers={showLineNumbers}
        />
      </div>
      <div style={{ padding: "1rem" }}>
        <select onChange={handleChangeTheme}>
          <option value="light1">Light theme 1</option>
          <option value="light2">Light theme 2</option>
          <option value="dark1">Dark theme 1</option>
          <option value="dark2">Dark theme 2</option>
        </select>
        &nbsp;
        <input
          type="checkbox"
          id="lineNums"
          name="lineNums"
          value="lineNums"
          checked={showLineNumbers}
          onChange={(e) => setShowLineNumbers(e.target.checked)}
        />
        <label htmlFor="lineNums"> Line Numbers</label>
        &nbsp;
        <input
          type="checkbox"
          id="highlight"
          name="highlight"
          value="highlight"
          checked={highlight}
          onChange={(e) => setHighlight(e.target.checked)}
        />
        <label htmlFor="highlight"> Syntax Highlighting</label>
        &nbsp;
        <input
          type="checkbox"
          id="readonly"
          name="readonly"
          value="readonly"
          checked={readonly}
          onChange={(e) => setReadonly(e.target.checked)}
        />
        <label htmlFor="readonly"> Readonly</label>
        <hr />
        <div>
          Analyzed <b>{numLines}</b> lines and found <b>{tokens.length}</b>{" "}
          tokens in document with <b>{errors.length}</b> lexical error
          {errors.length === 1 ? "" : "s"}
          {errors.length === 0 ? "." : ":"}
        </div>
        <ul>
          {errors.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
        <hr />
        <div style={{ width: "100%", height: "100%" }}>
          <h3>Tokens ({tokens.length}):</h3>
          <div>
            <table>
              <thead>
                <tr>
                  <th>Index</th>
                  <th>Type</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {tokens.map((t, i) => (
                  <tr key={t.type + i}>
                    <td>{i}</td>
                    <td>
                      <pre style={{ color: theme.tokenColors[t.type] }}>
                        {t.type}
                      </pre>
                    </td>
                    <td>
                      <pre>{t.value}</pre>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {showTooltip ? (
        <div
          id="tooltip"
          style={{
            maxWidth: "16rem",
            position: "fixed",
            top: tooltipPosition.y,
            left: tooltipPosition.x,
            padding: "1rem",
            backgroundColor: theme.backgroundColor,
            color: theme.defaultTextColor,
            border: `1px solid ${theme.defaultTextColor}`,
            fontSize: 14,
            fontFamily: "sans-serif",
          }}
        >
          <b>{currentKeyword}:</b>{" "}
          {JSON_LD_KEYWORD_DESCRIPTIONS[currentKeyword]}
        </div>
      ) : null}
    </>
  );
}

export default App;
