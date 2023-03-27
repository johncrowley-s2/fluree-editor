import { Token } from "../..";

export default function findCurrentTokenIndex(
  tokens: Token[],
  cursorPosition: number
): number {
  let currentTokenIndex = 0;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.position < cursorPosition) {
      if (
        currentTokenIndex === null ||
        token.position > tokens[currentTokenIndex].position
      ) {
        currentTokenIndex = i;
      }
    } else {
      break;
    }
  }

  return currentTokenIndex;
}
