import { Datasworn } from "@datasworn-community/core";

/**
 * True when every move in a collection replaces a move that is already known.
 *
 * Sundered Isles ships a "Exploration Moves" collection whose four moves each
 * replace a Starforged move. The collection declares neither `replaces` nor
 * `enhances`, so it renders as its own root section while the Starforged
 * section renders the same four moves substituted in place - one heading twice,
 * with overlapping contents.
 *
 * A collection like that contributes nothing the replaced collection does not
 * already show, so it is dropped from the root list. If any target is missing
 * from the loaded tree the collection is kept, so a partially loaded expansion
 * hides nothing.
 */
export function isFullyReplacingMoveCategory(
  category: Datasworn.MoveCategory,
  knownMoveIds: Record<string, Datasworn.Move>
): boolean {
  const moves = Object.values(category.contents ?? {});

  if (moves.length === 0) {
    return false;
  }

  return moves.every((move) =>
    (move.replaces ?? []).some((replacesId) => !!knownMoveIds[replacesId])
  );
}
