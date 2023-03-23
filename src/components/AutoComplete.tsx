import useTheme from "../lib/hooks/useTheme";

interface Props {
  isVisible: boolean;
  top: number;
  left: number;
}

export default function AutoComplete({ isVisible, top, left }: Props) {
  const { theme } = useTheme();

  return (
    <>
      {isVisible ? (
        <div
          id="autocomplete"
          style={{
            maxWidth: "16rem",
            position: "absolute",
            top: top,
            left: left,
            padding: "0.3rem",
            backgroundColor: theme.backgroundColor,
            color: theme.defaultTextColor,
            border: `1px solid ${theme.defaultTextColor}`,
            fontSize: 12,
            fontFamily: "sans-serif",
          }}
        >
          TODO: AUTOCOMPLETE GOES HERE
        </div>
      ) : null}
    </>
  );
}
