import { useState } from "react";
import useTheme from "../lib/hooks/useTheme";
import { Token } from "../lib/lexer";

interface Props {
  tokens: Token[];
}

export default function TokenInspector({ tokens }: Props) {
  const [showTokens, setShowTokens] = useState(false); // Default false bc rendering the token table slows down the UI considerably

  const { theme } = useTheme();

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
                      <pre style={{ color: theme.tokenColors[t.type] }}>
                        {t.type}
                      </pre>
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
