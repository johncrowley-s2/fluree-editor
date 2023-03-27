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
        padding: fontSize / 2,
        backgroundColor: backgroundColor,
        color: textColor,
        border: `1px solid ${textColor}`,
        borderRadius: "4px",
        fontSize: fontSize,
        fontFamily: "sans-serif",
      }}
    >
      {content}
    </div>
  );
}
