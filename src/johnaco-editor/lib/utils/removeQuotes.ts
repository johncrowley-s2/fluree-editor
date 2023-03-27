export function removeQuotes(str: string): string {
  let newStr = str;

  // Remove quote at the beginning
  if (newStr.length >= 1 && newStr.charAt(0) === '"') {
    newStr = newStr.slice(1);
  }

  // Remove quote at the end
  if (newStr.length >= 1 && newStr.charAt(newStr.length - 1) === '"') {
    newStr = newStr.slice(0, -1);
  }

  return newStr;
}
