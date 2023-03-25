function stringSimilarity(a: string, b: string): number {
  a = a.toLowerCase().replace(/[^a-z0-9]/g, "");
  b = b.toLowerCase().replace(/[^a-z0-9]/g, "");

  if (b.includes(a)) {
    return 1;
  }

  return 0;
}

export default function fuzzySearch(
  input: string,
  searchArray: string[],
  minSimilarity: number = 0.1
): string[] {
  if (/[\s]+/.test(input)) return [];
  const results: { searchString: string; similarity: number }[] = [];

  // Iterate through the searchArray and calculate the string similarity
  for (const searchString of searchArray) {
    const similarity = stringSimilarity(input, searchString);
    // If the similarity is greater than or equal to the minSimilarity, add the searchString to the results array
    if (similarity >= minSimilarity) {
      results.push({ searchString, similarity });
    }
  }

  // Sort the results based on the similarity, and map the sorted array to include only the search strings
  return results
    .sort((a, b) => b.similarity - a.similarity)
    .map((result) => result.searchString);
}
