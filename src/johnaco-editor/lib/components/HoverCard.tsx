import useHoverCard from "../hooks/useHoverCard";

interface Props {
  hoverCards: Record<string, string>;
  backgroundColor: string;
  textColor: string;
  fontSize: number;
}

export default function HoverCard({
  hoverCards,
  backgroundColor,
  textColor,
  fontSize,
}: Props) {
  const { isVisible, top, left, content } = useHoverCard(hoverCards);

  if (!isVisible) return null;
  return (
    <div
      id="hoverCard"
      style={{
        maxWidth: fontSize * 16,
        position: "fixed",
        top: top,
        left: left,
        padding: fontSize,
        backgroundColor: backgroundColor,
        color: textColor,
        // border: `1px solid ${textColor}`,
        boxShadow: "0 0 6px rgba(0, 0, 0, 0.1)",
        borderRadius: "4px",
        fontSize: fontSize,
        fontFamily: "sans-serif",
      }}
    >
      {content}
    </div>
  );
}
