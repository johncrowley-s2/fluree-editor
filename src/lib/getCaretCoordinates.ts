export interface Coordinates {
  top: number;
  left: number;
}

const properties = [
  "direction",
  "boxSizing",
  "width",
  "height",
  "overflowX",
  "overflowY",
  "borderTopWidth",
  "borderRightWidth",
  "borderBottomWidth",
  "borderLeftWidth",
  "borderStyle",
  "paddingTop",
  "paddingRight",
  "paddingBottom",
  "paddingLeft",
  "fontStyle",
  "fontVariant",
  "fontWeight",
  "fontStretch",
  "fontSize",
  "fontSizeAdjust",
  "lineHeight",
  "fontFamily",
  "textAlign",
  "textTransform",
  "textIndent",
  "textDecoration",
  "letterSpacing",
  "wordSpacing",
  "tabSize",
  "MozTabSize",
];

function getCaretCoordinates(
  element: HTMLTextAreaElement,
  position: number
): Coordinates {
  // The mirror div will replicate the textarea's style
  const div = document.createElement("div");
  div.id = "caret-position-mirror-div";
  document.body.appendChild(div);

  const style = div.style;
  const computed = window.getComputedStyle(element);

  // Default textarea styles
  style.whiteSpace = "pre-wrap";
  style.wordWrap = "break-word";

  // Position off-screen
  style.position = "absolute"; // required to return coordinates properly
  style.visibility = "hidden"; // not 'display: none' because we want rendering

  // Transfer the element's properties to the div
  properties.forEach((prop) =>
    style.setProperty(prop, computed.getPropertyValue(prop))
  );

  div.textContent = element.value.substring(0, position);

  const span = document.createElement("span");

  span.textContent = element.value.substring(position) || "."; // because a completely empty faux span doesn't render at all
  div.appendChild(span);

  const coordinates = {
    top: span.offsetTop + parseInt(computed["borderTopWidth"]),
    left: span.offsetLeft + parseInt(computed["borderLeftWidth"]),
  };

  document.body.removeChild(div);

  return coordinates;
}

export default getCaretCoordinates;
