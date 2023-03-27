import React, { useState, useEffect } from "react";

export default function useTextareaSelectionStart(textareaId: string) {
  const [selectionStart, setSelectionStart] = useState(0);

  useEffect(() => {
    const textarea = document.getElementById(textareaId) as HTMLTextAreaElement;

    if (!textarea) {
      console.error(`Textarea with ID '${textareaId}' not found.`);
      return;
    }

    const updateSelectionStart = () => {
      setSelectionStart(textarea.selectionStart);
    };

    textarea.addEventListener("input", updateSelectionStart);
    textarea.addEventListener("click", updateSelectionStart);
    textarea.addEventListener("keyup", updateSelectionStart);

    return () => {
      textarea.removeEventListener("input", updateSelectionStart);
      textarea.removeEventListener("click", updateSelectionStart);
    };
  }, [textareaId]);

  return selectionStart;
}
