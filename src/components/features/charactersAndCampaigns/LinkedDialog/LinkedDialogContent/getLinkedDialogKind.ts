export type LinkedDialogKind = "move" | "oracle" | "asset" | "unsupported";

/**
 * Chooses which dialog renders a Datasworn id.
 *
 * The object type is everything before the colon, and nesting is expressed by
 * dotting it: "move.oracle_rollable:delve/delve/delve_the_depths.edge" is an
 * oracle rollable, and
 * "asset.ability.move:starforged/module/shields.0.raise_shields" is a move.
 *
 * Matching the type as a bare substring instead sent every nested id to
 * whichever branch was checked first, so move.oracle_rollable ids were read as
 * moves and dead-ended on "Move Not Found".
 */
export function getLinkedDialogKind(id: string): LinkedDialogKind {
  const objectType = id.split(":")[0];

  if (
    objectType === "oracle_collection" ||
    objectType === "oracle_rollable" ||
    objectType.endsWith(".oracle_rollable")
  ) {
    return "oracle";
  }

  if (objectType === "move" || objectType.endsWith(".move")) {
    return "move";
  }

  if (objectType === "asset") {
    return "asset";
  }

  return "unsupported";
}
