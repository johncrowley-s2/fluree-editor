import { useRef, useState } from "react";
import { Coordinates } from "../getCaretCoordinates";

export default function useCaretCoordinates() {
  const [coordinates, setCoordinates] = useState<Coordinates>({
    top: 0,
    left: 0,
  });

  const textareaRef = useRef(null);
}
