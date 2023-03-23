import { useEffect, useState } from "react";
import { debounce } from "../debounce";
import { JldKeyword, JSON_LD_KEYWORD_DESCRIPTIONS } from "../jsonLd";

export default function useHoverCard() {
  const [hoverCardPosition, setHoverCardPosition] = useState({ x: 0, y: 0 });
  const [currentKeyword, setCurrentKeyword] = useState<JldKeyword>("@context");
  const [showHoverCard, setShowHoverCard] = useState(false);

  useEffect(() => {
    // Effect for showing the "hoverCard" thing (need a better term but yea...)
    // Doing some hacky shit here to find the overlapping span element behind the text area.

    // Debounced handleMouseMove function with a 200ms delay
    const handleMouseMoveDebounced = debounce(handleMouseMove, 200);

    function handleMouseMove(e: MouseEvent) {
      setHoverCardPosition({ x: e.clientX, y: e.clientY });
      // All the elements the mouse is currently overlapping with
      const _overlapped = document.elementsFromPoint(e.pageX, e.pageY);
      // Check to see if any element id matches an id in elems
      const _included = _overlapped.filter(
        (el) => el.id.split("_")[0] === "jldKeyword"
      );
      const ids = _included.map((el) => el.id);

      const elems = Array.from(
        document.querySelectorAll('[id^="jldKeyword"]')
      ).map((x) => x.id);

      for (const index in elems) {
        const id = elems[index];
        const elem = document.getElementById(id);
        if (elem && ids.includes(id)) {
          setCurrentKeyword(id.split("_")[1] as JldKeyword);
          setTimeout(() => setShowHoverCard(true), 800);
        } else {
          setShowHoverCard(false);
        }
      }
    }

    document.addEventListener("mousemove", handleMouseMoveDebounced);

    return () =>
      document.removeEventListener("mousemove", handleMouseMoveDebounced);
  }, []);

  return {
    isVisible:
      showHoverCard && hoverCardPosition.y !== 0 && hoverCardPosition.x !== 0,
    top: hoverCardPosition.y,
    left: hoverCardPosition.x,
    content: (
      <>
        <b>{currentKeyword}:</b> {JSON_LD_KEYWORD_DESCRIPTIONS[currentKeyword]}
      </>
    ),
  };
}
