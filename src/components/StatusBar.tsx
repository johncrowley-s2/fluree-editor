import { useMemo, useState } from "react";
import findCurrentTokenIndex from "../lib/findCurrentTokenIndex";
import useTextAreaSelectionStart from "../lib/hooks/useTextAreaSelectionStart";
import { LanguageDefinition } from "../lib/languages/types";
import { Theme } from "../lib/themes/types";
import { Token } from "../lib/tokenize";
import Checkmark from "./Checkmark";
import Chevron from "./Chevron";
import XMark from "./XMark";

interface Props {
  theme: Theme;
  errors: string[];
  tokens: Token[];
  language: LanguageDefinition;
}

export default function StatusBar({ theme, errors, tokens, language }: Props) {
  const [showErrors, setShowErrors] = useState(false);

  const selectionStart = useTextAreaSelectionStart("textarea");

  const [currentLine, currentColumn] = useMemo(() => {
    const currentTokenIndex = findCurrentTokenIndex(tokens, selectionStart);
    const currentToken = tokens[currentTokenIndex];
    if (!currentToken) return [1, 1];
    const difference = selectionStart - currentToken.position;
    return [currentToken.line, currentToken.column + difference];
  }, [tokens, selectionStart]);

  return (
    <>
      <div
        style={{
          position: "sticky",
          left: 0,
          bottom: -1,
          height: "1.7rem",
          backgroundColor: theme.backgroundColor,
          padding: "0 0.5rem",
          fontFamily: "sans-serif",
          fontSize: "0.7rem",
          userSelect: "none",
        }}
      >
        <div
          style={{
            height: "100%",
            borderTop: "1px solid " + theme.defaultTextColor,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 1rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              ...(errors.length > 0 ? { cursor: "pointer" } : {}),
            }}
            onClick={() => setShowErrors(!showErrors)}
            {...(errors.length > 0 ? { title: "See Errors" } : {})}
          >
            {errors.length > 0 ? (
              <XMark size={14} color={theme.tokenColors.Invalid} />
            ) : (
              <Checkmark size={14} color={theme.defaultTextColor} />
            )}
            {errors.length} Errors
            {errors.length > 0 ? (
              <Chevron size={14} direction={showErrors ? "down" : "up"} />
            ) : null}
          </div>
          <div>
            Position {selectionStart}&nbsp;&nbsp; Ln {currentLine}, Col{" "}
            {currentColumn}
            &nbsp;&nbsp;&nbsp;&nbsp;{language.displayName || ""}
          </div>
        </div>
      </div>
      {showErrors && errors.length > 0 ? (
        <div
          style={{
            position: "sticky",
            backgroundColor: theme.backgroundColor,
            left: 16,
            bottom: 24,
            border: "1px solid" + theme.defaultTextColor,
            borderRadius: 4,
            padding: "1rem",
          }}
        >
          <ul style={{ listStyle: "none" }}>
            {errors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </>
  );
}
