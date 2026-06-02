import { Datasworn } from "@datasworn/core";
import { describe, expect, it } from "vitest";
import { getMoveIdsForCategory } from "./moveCategoryUtils";

describe("getMoveIdsForCategory", () => {
  it("uses the category contents without appending enhancing categories again", () => {
    const baseMove = {
      _id: "move:classic/combat/strike",
      type: "move",
      name: "Strike",
      roll_type: "no_roll",
    } as Datasworn.Move;
    const enhancedMove = {
      _id: "move:homebrew/combat/custom",
      type: "move",
      name: "Custom Move",
      roll_type: "no_roll",
    } as Datasworn.Move;

    const category = {
      _id: "move_category:classic/combat",
      type: "move_category",
      name: "Combat",
      contents: {
        strike: baseMove,
        custom: enhancedMove,
      },
    } as unknown as Datasworn.MoveCategory;

    expect(getMoveIdsForCategory(category)).toEqual([
      "move:classic/combat/strike",
      "move:homebrew/combat/custom",
    ]);
  });
});
