import { ChangeEvent, useEffect, useState } from "react";
import { jld, sql } from "./initValue";
import { JohnacoEditor } from "./johnaco-editor";

function App() {
  const [value, setValue] = useState("");
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [highlight, setHighlight] = useState(true);
  const [readonly, setReadonly] = useState(false);
  const [language, setLanguage] = useState<string>("json-ld");
  const [showStatusBar, setShowStatusBar] = useState(true);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    if (language === "json-ld") setValue(jld);
    else setValue(sql);
  }, [language]);

  // function prettify() {
  //   if (!language.prettify) return;
  //   console.log("ORIG: ", value, "PRETTY: ", language.prettify(value));
  //   setValue(language.prettify(value));
  // }

  function handleChangeLanguage(e: ChangeEvent<HTMLSelectElement>) {
    if (e.target.value === "sql") setLanguage("sql");
    else setLanguage("json-ld");
  }

  function handleChangeTheme(e: ChangeEvent<HTMLSelectElement>) {
    if (e.target.value === "dark") setTheme("dark");
    else setTheme("light");
  }

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
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
        <JohnacoEditor
          value={value}
          onValueChange={(x) => setValue(x)}
          language={language}
          theme={theme}
          showStatusBar={showStatusBar}
          showLineNumbers={showLineNumbers}
          highlight={highlight}
          readonly={readonly}
        />
      </div>
      <div style={{ padding: "0 3rem" }}>
        <div>
          {/* <button onClick={prettify}>Prettify</button>
          &nbsp; */}
          <select onChange={handleChangeTheme}>
            <option value="light">Light Theme</option>
            <option value="dark">Dark Theme</option>
          </select>
          &nbsp;
          <select onChange={handleChangeLanguage}>
            <option value="json-ld">JSON-LD</option>
            <option value="sql">SQL</option>
          </select>
          &nbsp;
          <input
            type="checkbox"
            id="statusBar"
            name="statusBar"
            value="statusBar"
            checked={showStatusBar}
            onChange={(e) => setShowStatusBar(e.target.checked)}
          />
          <label htmlFor="lineNums"> Status Bar</label>
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
        </div>
      </div>
    </div>
  );
}

export default App;
