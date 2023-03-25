import { useEffect, useState } from "react";
import Editor from "./components/Editor";
import TokenInspector from "./components/TokenInspector";
import Toolbar from "./components/Toolbar";
import fuzzySearch from "./lib/fuzzySearch";
import { ThemeProvider } from "./lib/hooks/useTheme";
import { jld, sql } from "./lib/initValue";
import * as jsonLd from "./lib/languages/json-ld";
import { LanguageDefinition } from "./lib/languages/types";
import { Token } from "./lib/tokenize";
import { testSuggestions } from "./testSuggestions";

function App() {
  const [value, setValue] = useState("");
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [highlight, setHighlight] = useState(true);
  const [readonly, setReadonly] = useState(false);
  const [language, setLanguage] = useState<LanguageDefinition>(jsonLd);

  useEffect(() => {
    if (language === jsonLd) setValue(jld);
    else setValue(sql);
  }, [language]);

  function prettify() {
    setValue((prev) => (language.prettify ? language.prettify(prev) : prev));
  }

  function getSuggestions(
    tokens: Token[],
    currentTokenIndex: number,
    position: number
  ) {
    const currentToken = tokens[currentTokenIndex];
    if (!currentToken) return [];
    const value = currentToken.value;
    if (/\W+/.test(value)) return [];
    console.log("VALUE: ", value);
    return fuzzySearch(value, testSuggestions).slice(0, 5);
  }

  return (
    <ThemeProvider>
      <div style={{ display: "flex", alignItems: "baseline" }}>
        <h2>Johnaco Editor </h2>&nbsp;
        <a
          href="https://github.com/johncrowley-s2/johnaco-editor"
          target="_blank"
        >
          View code on Github
        </a>
      </div>
      <div
        style={{
          width: "100%",
          height: "48rem",
          border: "1px solid black",
          borderRadius: "4px",
        }}
      >
        <Editor
          readonly={readonly}
          language={language}
          value={value}
          onValueChange={(x) => setValue(x)}
          showLineNumbers={showLineNumbers}
          getSuggestions={getSuggestions}
        />
      </div>
      <Toolbar
        showLineNumbers={showLineNumbers}
        setShowLineNumbers={setShowLineNumbers}
        highlight={highlight}
        setHighlight={setHighlight}
        readonly={readonly}
        setReadonly={setReadonly}
        language={language}
        setLanguage={setLanguage}
        prettify={prettify}
      />
      {/* <hr /> */}
      {/* <Errors numLines={numLines} numTokens={tokens.length} errors={errors} /> */}
      {/* <hr /> */}
      <TokenInspector value={value} language={language} />
    </ThemeProvider>
  );
}

export default App;
