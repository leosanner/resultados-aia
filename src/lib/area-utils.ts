export function stageKeyToSlug(stageKey: string) {
  return stageKey.replaceAll("_", "-");
}

export function slugToStageKey(areaSlug: string) {
  return areaSlug.replaceAll("-", "_");
}

export function formatStageTitle(stageKey: string) {
  return stageKey
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
