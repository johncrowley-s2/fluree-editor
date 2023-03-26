// XMark.tsx
import React from "react";

interface XMarkProps {
  className?: string;
  size?: number;
  color?: string;
}

const XMark: React.FC<XMarkProps> = ({
  className = "",
  size = 24,
  color = "red",
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M18 6L6 18"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6 6L18 18"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default XMark;
