import useHoverCard from "../lib/hooks/useHoverCard";
import useTheme from "../lib/hooks/useTheme";

interface Props {
  hoverCards: Record<string, string>;
}

export default function HoverCard({ hoverCards }: Props) {
  const { isVisible, top, left, content } = useHoverCard(hoverCards);

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
        borderRadius: "4px",
        fontSize: 12,
        fontFamily: "sans-serif",
      }}
    >
      {content}
    </div>
  );
}
