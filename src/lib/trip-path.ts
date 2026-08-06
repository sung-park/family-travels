/** false → exclude from collections listings / getStaticPaths */
export function isPublishableTripPath(entryPathOrSlug: string): boolean {
  const norm = entryPathOrSlug.replace(/\\/g, "/");
  if (norm.startsWith("_")) return false;
  const afterTrips = norm.includes("/trips/")
    ? norm.split("/trips/")[1]
    : norm;
  if (afterTrips) {
    const topFolder = afterTrips.split("/")[0];
    if (topFolder?.startsWith("_")) return false;
  }
  return true;
}
