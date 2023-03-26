import { ChangeEvent, Dispatch, SetStateAction } from "react";
import useTheme from "../lib/hooks/useTheme";
import * as jsonLd from "../lib/languages/json-ld";
import * as sql from "../lib/languages/sql";
import { LanguageDefinition } from "../lib/languages/types";

interface Props {
  showLineNumbers: boolean;
  setShowLineNumbers: Dispatch<SetStateAction<boolean>>;
  highlight: boolean;
  setHighlight: Dispatch<SetStateAction<boolean>>;
  readonly: boolean;
  setReadonly: Dispatch<SetStateAction<boolean>>;
  language: LanguageDefinition;
  setLanguage: Dispatch<SetStateAction<LanguageDefinition>>;
  prettify: () => void;
}

export default function Toolbar({
  showLineNumbers,
  setShowLineNumbers,
  highlight,
  setHighlight,
  readonly,
  setReadonly,
  language,
  setLanguage,
  prettify,
}: Props) {
  const { handleChangeTheme } = useTheme();

  function handleChangeLanguage(e: ChangeEvent<HTMLSelectElement>) {
    if (e.target.value === "sql") setLanguage(sql);
    else setLanguage(jsonLd);
  }

  return (
    <div>
      <select onChange={handleChangeTheme}>
        <option value="flureeLight">Fluree Light Theme</option>
        <option value="flureeDark">Fluree Dark Theme</option>
        <option value="light1">Light theme 1</option>
        <option value="light2">Light theme 2</option>
        <option value="dark1">Dark theme 1</option>
        <option value="dark2">Dark theme 2</option>
      </select>
      &nbsp;
      <select onChange={handleChangeLanguage}>
        <option value="json-ld">JSON-LD</option>
        <option value="sql">SQL</option>
      </select>
      &nbsp;
      <button onClick={prettify}>Prettify</button>
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
  );
}
