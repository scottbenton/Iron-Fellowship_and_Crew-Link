import { Datasworn } from "@datasworn/core";

export function getMoveIdsForCategory(category: Datasworn.MoveCategory) {
  return Object.values(category.contents ?? {}).map((move) => move._id);
}
