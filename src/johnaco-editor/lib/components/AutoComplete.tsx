import { useEffect, useState } from "react";

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
  suggestions: string[];
  handleEnter: (text: string) => void;
  backgroundColor: string;
  textColor: string;
}

export default function AutoComplete({
  isVisible,
  top,
  left,
  suggestions,
  handleEnter,
  backgroundColor,
  textColor,
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
        handleEnter(suggestions[activeIndex]);
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
          padding: "0.5rem",
          backgroundColor: backgroundColor,
          color: textColor,
          border: `1px solid ${textColor}`,
          borderRadius: "4px",
          fontSize: 12,
          fontFamily: "sans-serif",
        }}
      >
        {suggestions.map((s, i) => (
          <div
            key={s}
            style={{
              userSelect: "none",
              padding: "0.1rem 0.3rem",
              borderRadius: "4px",
              ...(activeIndex === i
                ? { border: "1px solid " + textColor }
                : {}),
            }}
            onMouseEnter={() => setActiveIndex(i)}
            onClick={() => handleEnter(suggestions[i])}
          >
            {s}
          </div>
        ))}
      </div>
    </>
  );
}
