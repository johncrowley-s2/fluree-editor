import { useMemo, useState } from "react";
import useTheme from "../lib/hooks/useTheme";
import { LanguageDefinition } from "../lib/languages/types";
import tokenize, { Token } from "../lib/tokenize";

interface Props {
  value: string;
  language: LanguageDefinition;
}

export default function TokenInspector({ value, language }: Props) {
  const [showTokens, setShowTokens] = useState(false); // Default false bc rendering the token table slows down the UI considerably

  const { theme } = useTheme();

  const tokens = useMemo(
    () => (!showTokens ? [] : tokenize(value, language.tokenMap)),
    [showTokens, value]
  );

  return (
    <>
      {" "}
      <div style={{ width: "100%", height: "100%" }}>
        <div style={{ display: "flex" }}>
          <button
            style={{ alignSelf: "center", marginRight: "1rem" }}
            onClick={() => setShowTokens(!showTokens)}
          >
            {showTokens ? "Close" : "Open"}
          </button>
          <h3>Inspect Tokens ({tokens.length}):</h3>
        </div>
        <div>
          {showTokens ? (
            <table>
              <thead>
                <tr>
                  <th>Index</th>
                  <th>Type</th>
                  <th>Line</th>
                  <th>Position</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {tokens.map((t, i) => (
                  <tr key={t.type + i}>
                    <td>{i}</td>
                    <td>
                      <pre>{t.type}</pre>
                    </td>
                    <td>{t.line}</td>
                    <td>{t.position}</td>
                    <td>
                      <pre>{t.value}</pre>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            "Open to inspect tokens."
          )}
        </div>
      </div>
    </>
  );
}
