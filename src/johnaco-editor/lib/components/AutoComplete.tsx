import { useEffect, useState } from "react";
import { Suggestion } from "../..";

function incrementIndex(currentIndex: number, arrayLength: number) {
  return (currentIndex + 1) % arrayLength;
}

function decrementIndex(currentIndex: number, arrayLength: number) {
  return (currentIndex - 1 + arrayLength) % arrayLength;
}

interface Props {
  isVisible: boolean;
  top: number;
  left: number;
  suggestions: Suggestion[];
  handleEnter: (text: string) => void;
  backgroundColor: string;
  activeBackgroundColor: string;
  textColor: string;
  activeTextColor: string;
  fontSize: number;
}

export default function AutoComplete({
  isVisible,
  top,
  left,
  suggestions,
  handleEnter,
  backgroundColor,
  activeBackgroundColor,
  textColor,
  activeTextColor,
  fontSize,
}: Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    function handleKeydown(e: KeyboardEvent) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) => incrementIndex(prev, suggestions.length));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => decrementIndex(prev, suggestions.length));
      } else if (e.key === "Enter") {
        e.preventDefault();
        setActiveIndex(0);
        handleEnter(suggestions[activeIndex].value);
      }
    }

    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, [suggestions, activeIndex]);

  if (!isVisible) return null;
  return (
    <>
      <div
        id="autocomplete"
        style={{
          minWidth: "8rem",
          maxWidth: "16rem",
          position: "absolute",
          top: top,
          left: left,
          padding: 0,
          backgroundColor: backgroundColor,
          color: textColor,
          borderRadius: "4px",
          fontSize: fontSize,
          fontFamily: "sans-serif",
        }}
      >
        {suggestions.map((s, i) => (
          <div
            key={s.label}
            style={{
              userSelect: "none",
              padding: `${fontSize / 4}px ${fontSize}px`,
              ...(activeIndex === i
                ? {
                    backgroundColor: activeBackgroundColor,
                    color: activeTextColor,
                  }
                : {}),
              ...(i === 0
                ? {
                    borderRadius: "4px 4px 0 0",
                  }
                : {}),
              ...(i === suggestions.length - 1
                ? {
                    borderRadius: "0 0 4px 4px",
                  }
                : {}),
              ...(suggestions.length === 1
                ? {
                    borderRadius: "4px",
                  }
                : {}),
            }}
            onMouseEnter={() => setActiveIndex(i)}
            onClick={() => handleEnter(suggestions[i].value)}
          >
            {s.label}
          </div>
        ))}
      </div>
    </>
  );
}
