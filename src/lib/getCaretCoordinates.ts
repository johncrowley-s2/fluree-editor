export interface Coordinates {
  top: number;
  left: number;
}

const DEBUG = false;

function getCaretCoordinates(element: HTMLTextAreaElement): Coordinates {
  if (DEBUG) {
    const el = document.querySelector("#caret-position-mirror-div");
    if (el) el.parentNode?.removeChild(el);
  }

  const position = element.selectionStart;

  // The mirror div will replicate the textarea's style
  const div = document.createElement("div");
  div.id = "caret-position-mirror-div";
  document.body.appendChild(div);

  const style = div.style;
  const computed = window.getComputedStyle(element);

  // Default textarea styles
  style.whiteSpace = "pre";
  style.overflowWrap = "normal";

  // Position off-screen
  style.position = "absolute"; // required to return coordinates properly
  if (!DEBUG) style.visibility = "hidden"; // not 'display: none' because we want rendering

  Object.keys(computed).forEach((prop) =>
    style.setProperty(prop, computed.getPropertyValue(prop))
  );

  div.textContent = element.value.substring(0, position);

  const span = document.createElement("span");

  span.textContent = element.value.substring(position) || "."; // because a completely empty faux span doesn't render at all
  div.appendChild(span);

  const coordinates = {
    top: span.offsetTop + parseInt(computed["borderTopWidth"]) + 16, // Add 16 pixels to compensate for caret height
    left: span.offsetLeft + parseInt(computed["borderLeftWidth"]) + 24, // Add 24 pixels to compensate for some mysterious inaccuracy that I have yet to track down.
  };

  if (!DEBUG) {
    document.body.removeChild(div);
  } else {
    span.style.backgroundColor = "#aaa";
  }

  return coordinates;
}

export default getCaretCoordinates;
