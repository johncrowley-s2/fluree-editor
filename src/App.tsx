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

  return (
    <ThemeProvider>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          padding: "1.5rem 3rem 0 3rem",
        }}
      >
        <h2>Johnaco Editor </h2>&nbsp;&nbsp;
        <a
          href="https://github.com/johncrowley-s2/johnaco-editor"
          target="_blank"
        >
          View code on Github
        </a>
      </div>
      <div
        style={{
          height: "30rem",
          padding: "1rem 3rem",
        }}
      >
        <Editor
          readonly={readonly}
          highlight={highlight}
          language={language}
          value={value}
          onValueChange={(x) => setValue(x)}
          showLineNumbers={showLineNumbers}
        />
      </div>
      <div style={{ padding: "0 3rem" }}>
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
      </div>
    </ThemeProvider>
  );
}

export default App;
