export function buildExpansionChanges(
  expansionId: string,
  enabled: boolean,
): Record<string, boolean> {
  const changes: Record<string, boolean> = { [expansionId]: enabled };
  if (expansionId === "lodestar" && enabled) {
    changes.delve = true;
  } else if (expansionId === "delve" && !enabled) {
    changes.lodestar = false;
  }
  return changes;
}
