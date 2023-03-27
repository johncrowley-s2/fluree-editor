import React from "react";

interface Props {
  className?: string;
  size?: number;
  color?: string;
  direction?: "up" | "down";
}

const Chevron: React.FC<Props> = ({
  className = "",
  size = 24,
  color = "black",
  direction = "up",
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...(direction === "down" ? { transform: "rotate(180)" } : {})}
  >
    <path
      d="M6 15L12 9L18 15"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
export default Chevron;
