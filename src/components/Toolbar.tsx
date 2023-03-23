import { Dispatch, SetStateAction } from "react";
import useTheme from "../lib/hooks/useTheme";

interface Props {
  showLineNumbers: boolean;
  setShowLineNumbers: Dispatch<SetStateAction<boolean>>;
  highlight: boolean;
  setHighlight: Dispatch<SetStateAction<boolean>>;
  readonly: boolean;
  setReadonly: Dispatch<SetStateAction<boolean>>;
}

export default function Toolbar({
  showLineNumbers,
  setShowLineNumbers,
  highlight,
  setHighlight,
  readonly,
  setReadonly,
}: Props) {
  const { handleChangeTheme } = useTheme();

  return (
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
    </div>
  );
}
