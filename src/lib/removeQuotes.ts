export function removeQuotes(str: string): string {
  if (
    str.length >= 2 &&
    str.charAt(0) === '"' &&
    str.charAt(str.length - 1) === '"'
  ) {
    // Remove surrounding quotes
    return str.slice(1, -1).replace(/\\"/g, '"');
  } else {
    // String is not surrounded by quotes, return as-is
    return str;
  }
}
