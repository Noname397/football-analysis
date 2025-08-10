export function createInstanceUrl(
  chemicalId: string,
  recipeId: string
): string {
  const url = new URL("/instances/create", window.location.origin);
  url.searchParams.set("chemical", chemicalId);
  url.searchParams.set("recipe", recipeId);
  return url.toString();
}
