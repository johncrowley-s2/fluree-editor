import { useState } from "react";
import { Theme } from "../..";
import Checkmark from "./Checkmark";
import Chevron from "./Chevron";
import XMark from "./XMark";

interface Props {
  theme: Theme;
  errors: string[];
  backgroundColor: string;
  overlayBackgroundColor: string;
  textColor: string;
  errorColor: string;
  fontSize: number;
  languageName: string;
  currentLine: number;
  currentColumn: number;
}

export default function StatusBar({
  errors,
  fontSize,
  languageName,
  backgroundColor,
  overlayBackgroundColor,
  textColor,
  errorColor,
  currentLine,
  currentColumn,
}: Props) {
  const [showErrors, setShowErrors] = useState(false);

  return (
    <>
      <div
        style={{
          position: "absolute",
          width: "100%",
          left: 0,
          bottom: 0,
          height: fontSize * 2.5,
          backgroundColor: backgroundColor,
          fontFamily: "sans-serif",
          fontSize: fontSize,
          userSelect: "none",
          borderRadius: 12,
        }}
      >
        <div
          style={{
            height: "100%",
            borderTop: "1px solid " + textColor,
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
                <XMark size={14} color={errorColor} />
              ) : (
                <Checkmark size={14} color={textColor} />
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
                <Chevron
                  size={14}
                  direction={showErrors ? "down" : "up"}
                  color={textColor}
                />
              ) : null}
            </div>
          </div>
          <div>
            Ln {currentLine}, Col {currentColumn}
            &nbsp;&nbsp;&nbsp;&nbsp;{languageName}
          </div>
        </div>
      </div>
      {showErrors && errors.length > 0 ? (
        <div
          style={{
            position: "absolute",
            boxSizing: "border-box",
            backgroundColor: overlayBackgroundColor,
            left: 0,
            bottom: fontSize * 2.5,
            width: "100%",
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
