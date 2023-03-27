import { useMemo, useState } from "react";
import { LanguageDefinition, Theme, Token } from "../..";
import useTextAreaSelectionStart from "../hooks/useTextAreaSelectionStart";
import findCurrentTokenIndex from "../utils/findCurrentTokenIndex";
import Checkmark from "./Checkmark";
import Chevron from "./Chevron";
import XMark from "./XMark";

interface Props {
  theme: Theme;
  errors: string[];
  tokens: Token[];
  fontSize: number;
  languageName: string;
}

export default function StatusBar({
  theme,
  errors,
  tokens,
  fontSize,
  languageName,
}: Props) {
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
          position: "absolute",
          width: "100%",
          left: 0,
          bottom: 0,
          height: fontSize * 2.5,
          backgroundColor: theme.backgroundColor,
          fontFamily: "sans-serif",
          fontSize: fontSize,
          userSelect: "none",
          borderRadius: 12,
        }}
      >
        <div
          style={{
            height: "100%",
            borderTop: "1px solid " + theme.defaultTextColor,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 " + fontSize + "px",
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
            <div
              style={{
                display: "flex",
                alignItems: "center",
                paddingRight: fontSize / 2,
              }}
            >
              {errors.length > 0 ? (
                <XMark size={14} color={theme.tokenColors.Invalid} />
              ) : (
                <Checkmark size={14} color={theme.defaultTextColor} />
              )}
            </div>
            {errors.length} Errors
            <div
              style={{
                display: "flex",
                alignItems: "center",
                paddingLeft: fontSize / 2,
              }}
            >
              {errors.length > 0 ? (
                <Chevron size={14} direction={showErrors ? "down" : "up"} />
              ) : null}
            </div>
          </div>
          <div>
            Position {selectionStart}&nbsp;&nbsp; Ln {currentLine}, Col{" "}
            {currentColumn}
            &nbsp;&nbsp;&nbsp;&nbsp;{languageName}
          </div>
        </div>
      </div>
      {showErrors && errors.length > 0 ? (
        <div
          style={{
            position: "absolute",
            boxSizing: "border-box",
            backgroundColor: theme.backgroundColor,
            left: 0,
            bottom: fontSize * 2.5,
            width: "100%",
            border: "1px solid" + theme.defaultTextColor,
            borderBottom: "none",
            borderRadius: "4px 4px 0 0",
            padding: fontSize,
            fontSize: fontSize * 1.2,
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
