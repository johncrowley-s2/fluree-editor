import useHoverCard from "../lib/hooks/useHoverCard";
import useTheme from "../lib/hooks/useTheme";

export default function HoverCard() {
  const { isVisible, top, left, content } = useHoverCard();

  const { theme } = useTheme();

  if (!isVisible) return null;
  return (
    <div
      id="hoverCard"
      style={{
        maxWidth: "16rem",
        position: "fixed",
        top: top,
        left: left,
        padding: "0.5rem",
        backgroundColor: theme.backgroundColor,
        color: theme.defaultTextColor,
        border: `1px solid ${theme.defaultTextColor}`,
        fontSize: 12,
        fontFamily: "sans-serif",
      }}
    >
      {content}
    </div>
  );
}
